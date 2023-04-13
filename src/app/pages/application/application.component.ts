import { AfterViewInit, Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatAccordion } from '@angular/material/expansion';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';

import { UsersService } from 'src/app/core/services/users.services';
import { CatalogService } from 'src/app/core/services/catalog.service';
import { CommonService } from 'src/app/core/services/common.service';

/**
 * Componente.
 */
@Component({
	selector: 'app-application',
	templateUrl: './application.component.html'
})
export class ApplicationComponent implements OnInit, AfterViewInit {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatAccordion) accordion!: MatAccordion;

	/** Sesión. */
	public sessionData: any;

	/** Objeto formulario. */
	public actionForm: any;

	/** Objeto tabla. */
	public dataSource = new MatTableDataSource<any>();

	/** Listado de columnas. */
	public displayedColumns: string[] = [
		'id',
		'selection',
		'name',
		'cappCode',
		'creationDate',
		'actions'
	];

	/** Listado de parámetros del paginador. */
	public pageParameters = {
		page: 1,
		pageSize: 100,
		order: 'desc',
		sort: 'id',
		startDate: null,
		endDate: null,
		pageStatus: 'loading', // 'void', 'data'
		pageSizeTable: 10,
		pageSizeOptions: [5, 10, 25, 100],
		filterLoading: false,
		filterOpenState: false
	};

	/** Listado de axisAtributes. */
	public axisAtributes: any;

	/** Listado de grupos. */
	public groups: any;

	/** Ventana. */
	public window: any = window;

	/**
	 * Constructor de la clase.
	 * @param dialog Objeto dialog.
	 * @param _fb Objeto formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param usersService Servicio de usuarios.
	 * @param CatalogService Servicio de catalogos.
	 * @param commonService Servicio de endpoints genéricos.
	 */
	constructor(
		public dialog: MatDialog,
		private router: Router,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private usersService: UsersService,
		private catalogService: CatalogService,
		private commonService: CommonService
	) {}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			name: ['', [Validators.required]],
			startDate: ['', [Validators.required]],
			endDate: ['', [Validators.required]]
		});

		// Session
		this.sessionData = this.usersService.getLocalStorage()?.current;

		// get relational data
		this.selects();

		// load page data
		this.filter('apply', this.pageParameters);
	}

	/**
	 * Método que se ejecuta después de que la template de un componente se haya inicializado.
	 */
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	/**
	 * Método que obtiene el listado de los selects.
	 */
	selects() {
		let params = {id: 4};
		this.catalogService.getAxisAtribute(params)
			.subscribe((res: any) => {
				this.axisAtributes = res;
			});

		this.groups = this.sessionData.user.groups;
	}

	/**
	 * Método que comprueba que botón se ha seleccionado.
	 * @param type Tipo.
	 * @param ev  Evento.
	 */
	filter(type: any, ev: any) {
		if (type === 'toggle') {
			this.pageParameters.filterOpenState = !this.pageParameters.filterOpenState
		} else if (type === 'cancel') {
			this.pageParameters.filterOpenState = false;
		} else if (type === 'apply') {
			this.pageParameters.filterOpenState = false;
			this.pageParameters.filterLoading = true;
			this.pageParameters.pageStatus = 'loading';

			const form = this.actionForm.value;
			let params: any = this.pageParameters;
			params.name = form.name ? form.name : null;
			params.startDate = form.startDate ? new Date(form.startDate).getTime() : null;
			params.endDate = form.endDate ? new Date(form.endDate).getTime() : null;

			setTimeout(() => {
				this.catalogService.getAplicaciones(params)
					.subscribe(
						(res: any) => {
							this.pageParameters.filterLoading = false;

							if (res.length) {
								for (const item of res) {
									item.statusName = item.status ? item.status.name : null;
								}

								this.dataSource.data = res;
								const filterValue: any = params.name ? params.name : '';
								this.dataSource.filter = filterValue.trim().toLowerCase();

								if (!this.dataSource.filteredData.length) {
									this.pageParameters.pageStatus = 'void';
								} else {
									this.pageParameters.pageStatus = 'data';
								}
							} else {
								this.pageParameters.pageStatus = 'void';
							}
						},
						error => {
							this.pageParameters.filterLoading = false;
							this.pageParameters.pageStatus = 'void';

							this._snackBar.open('Ha ocurrido un error, intentelo de nuevo', 'Cerrar', {
								horizontalPosition: 'center',
								verticalPosition: 'top',
								duration: 3000
							});
						}
					);
			}, 1200);
		}
	}

	/**
	 * Método que añade nuevo.
	 */
	addNew() {
		const dialogRef = this.dialog.open(ApplicationAddnewDialog, {
			data: {
				name: 'new',
				sessionData: this.sessionData,
				selects: {
					axisAtributes: this.axisAtributes,
					groups: this.groups
				}
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result && result.type === 'save') {
				let r = result.res;
				r.style = 'create';
				r.statusName = r.status ? r.status.name : null;

				if (this.dataSource.data.length === 0) {
					this.pageParameters.pageStatus = 'data';
					this.dataSource = new MatTableDataSource<any>([r]);
				} else {
					this.dataSource.data.unshift(r);
					this.dataSource.filter = '';
				}
			}
		});
	}

	/**
	 * Método que abre la ventana modal.
	 * @param type Tipo de ventana
	 * @param item Elemento.
	 */
	itemActions(type: any, item: any) {
		if (type === 'edit') {
			const dialogRef = this.dialog.open(ApplicationEditDialog, {
				data: {
					name: 'edit',
					sessionData: this.sessionData,
					item: item,
					selects: {
						axisAtributes: this.axisAtributes,
						groups: this.groups
					}
				}
			});

			dialogRef.afterClosed().subscribe(result => {
				if (result && result.type === 'save') {
					let r = result.res;
					r.style = 'update';
					r.statusName = r.status ? r.status.name : null;

					for (let i in this.dataSource.data) {
						if (this.dataSource.data[i].id === r.id) {
							this.dataSource.data[i] = r;
							this.dataSource.filter = '';
							break;
						}
					}
				}
			});
		} else if (type === 'delete') {
			item.isDeleted = 1;

			this.catalogService.deleteItem(item)
				.subscribe(
					res => {
						item.style = 'delete';

						setTimeout(() => {
							var index = this.dataSource.data.map((x: any) => { return x.id; }).indexOf(item.id);
							this.dataSource.data.splice(index, 1);
							this.dataSource.filter = '';

							if (this.dataSource.data.length === 0) {
								this.pageParameters.pageStatus = 'void';
							}

							this._snackBar.open('Se ha eliminado con exito', 'Cerrar', {
								horizontalPosition: 'center',
								verticalPosition: 'top',
								duration: 3000
							});
						}, 1200);
					},
					error => {
						this._snackBar.open(error.error.errors[0].message ? error.error.errors[0].message : 'Error de aplicación', 'Cerrar', {
							horizontalPosition: 'center',
							verticalPosition: 'top',
							duration: 3000
						});
					}
				);
		}
	}

	/**
	 * Acciones de la tabla.
	 */
	tableActions(type: any) {
		let checkeds = this.dataSource.data.filter((i: any) => i.checked === true);

		if (!checkeds.length) {
			this._snackBar.open('Tiene que seleccionar un elemento de la tabla', 'Cerrar', {
				horizontalPosition: 'center',
				verticalPosition: 'top',
				duration: 3000
			});
		} else  {
			let item: any = this.dataSource.data.filter((i: any) => i.checked === true)[0];

			if (type === 'release-delivery') {
				let data = {
					comeFrom: 'application',
					id: item.id,
					name: item.name,
					catalogElementTypeId: item.catalogElementTypeId
				};
				this.window.localStorage.setItem('release-delivery', JSON.stringify(data));
				this.router.navigate(['release-delivery']);
			} else if (type === 'itinerary') {
				let data = {
					comeFrom: 'application',
					item: item,
					page: type,
					type: 1
				};
				this.window.localStorage.setItem('itinerary', JSON.stringify(data));
				this.router.navigate(['itinerary']);
			} else if (type === 'hierarchy') {
				let data = {
					comeFrom: 'application',
					item: item,
					page: type,
					type: 1
				};
				this.window.localStorage.setItem('hierarchy', JSON.stringify(data));
				this.router.navigate(['hierarchy']);
			}
		}
	}

	/**
	 * Seleccion elemento de la tabla en html.
	 */
	getSelectedElementFormTable(el: any) {
		this.dataSource.data.map((x: any) => el.id === x.id ? x.checked = true : x.checked = false);
	}
}

/**
 * Componente de añadir nuevo.
 */
@Component({
	selector: 'application.addnew',
	templateUrl: 'application.addnew.html',
})
export class ApplicationAddnewDialog implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	/** Sesión. */
	public sessionData: any;

	/** Objeto formulario. */
	public actionForm: any;

	/** Objeto tabla. */
	public dataSource = new MatTableDataSource<any>();

	/** Objeto tabla. */
	public dataSourceAditional = new MatTableDataSource<any>();

	/** Listado de columnas. */
	public displayedColumns: string[] = [
		'mandatory',
		'attribute',
		'description',
		'value'
	];

	/** Listado de columnas. */
	public displayedColumnsAditional: string[] = [
		'cappCode',
		'name',
		'actions'
	];

	/** Listado de parámetros del paginador. */
	public pageParameters = {
		page: 1,
		pageSize: 10,
		order: 'desc',
		sort: 'id',
		startDate: null,
		endDate: null,
		pageStatus: 'loading', // 'void', 'data'
		pageSizeTable: 10,
		pageSizeOptions: [5, 10, 25, 100],
		filterLoading: false,
		filterOpenState: false
	};

	/** Indica si el formulario se ha enviado. */
	public submitLoading: boolean = false;

	/** Listado de estados. */
	public axisAtributes: any;

	/** Listado de estados. */
	public axisAtributesAditional: any;

	/** Listado de estados. */
	public elementTypes: any;

	/** Objeto selector. */
	public selection: any;

	/** Objeto selector. */
	public aditionalData: any = [];

	/** Listado de grupos. */
	public groups: any;

	/**
	 * Constructor de la clase.
	 * @param dialogRef Objeto dialog.
	 * @param data Datos.
	 * @param fb Objeto Formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param catalogService Servicio de catalogos.
	 */
	constructor(
		public dialog: MatDialog,
		public dialogRef: MatDialogRef<ApplicationAddnewDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private catalogService: CatalogService,
	) {
		this.sessionData = this.data.sessionData ? this.data.sessionData : [];
		this.groups = this.data.selects ? this.data.selects.groups : [];
		let a = this.data.selects ? this.data.selects.axisAtributes : [];
		this.dataSource.data = a;
		this.axisAtributes = a;
	}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			name: ['', [Validators.required]],
			cappCode: ['', [Validators.required]],
			groupId: ['', [Validators.required]]
		});

		// Selects
		this.selects();
	}

	ngOnDestroy() {
		/* let c = {
			type: null,
			res: null
		};
		this.dialogRef.close(c); */
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	/**
	 * Método que obtiene el listado de los selects.
	 */
	selects() {
		this.catalogService.getElementosPromo()
			.subscribe((res: any) => {
				this.axisAtributesAditional = res;
			});
	}

	/**
	 * Método que añade nuevo.
	 */
	addNewAditional() {
		const dialogRef = this.dialog.open(ApplicationAddnewAditionalDialog, {
			data: {
				name: 'new',
				sessionData: this.sessionData,
				selects: {
					axisAtributes: this.axisAtributesAditional,
					elementTypes: this.elementTypes,
					aditionalData: this.aditionalData
				}
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result && result.type === 'save') {
				this.aditionalData = result.res;
				this.dataSourceAditional.data = this.aditionalData;
			}
		});
	}

	deleteAditional(item: any) {
		var index = this.aditionalData.map((x: any) => { return x.id; }).indexOf(item.id);
		this.aditionalData.splice(index, 1);
		this.dataSourceAditional.data = this.aditionalData;
	}

	/**
	 * Método que envia el formulario.
	 * @param type Tipo de botón clicado.
	 */
	submit(type: any) {
		if (type === 'save') {
			if (this.actionForm.valid) {
				const form = this.actionForm.value;
				const table: any = this.dataSource.filteredData;

				let keepGoing = true;
				let array = [];

				if (form.cappCode.length !== 4) {
					this._snackBar.open('El Código CAPP tiene que tener exactamente 4 caracteres alfanuméricos', 'Cerrar', {
						horizontalPosition: 'center',
						verticalPosition: 'top',
						duration: 3000
					});

					keepGoing = false;
				} else {
					for (let item of table) {
						if (item.mandatory && !item.valueSelect && !item.valuesOfSelect && !item.value) {
							if (item.valuesInDomain) {
								this._snackBar.open('Completa el Atributo "' + item.name + '"', 'Cerrar', {
									horizontalPosition: 'center',
									verticalPosition: 'top',
									duration: 3000
								});

								keepGoing = false;
								break;
							} else {
								this._snackBar.open('Completa el Atributo "' + item.name + '" con el formato "' + item.observations + '"', 'Cerrar', {
									horizontalPosition: 'center',
									verticalPosition: 'top',
									duration: 3000
								});

								keepGoing = false;
								break;
							}
						}

						if (item.mandatory && !item.valuesInDomain && item.value && !item.value.match(item.regex)) {
							this._snackBar.open('El Atributo "' + item.name + '" incumple el formato "' + item.observations + '", por favor reviselo', 'Cerrar', {
								horizontalPosition: 'center',
								verticalPosition: 'top',
								duration: 3000
							});

							keepGoing = false;
							break;
						}

						let ouputList = [];
						if (item.multiple) {
							for (let i=0; i < item.valuesOfSelect.length; i++) {
								if (item.valuesOfSelect[i]) {
									//console.log('item.valuesOfSelect[i]: ' + item.valuesOfSelect[i]);
									ouputList.push({domainValueId: item.valuesOfSelect[i], valorEjeElemCatId: null});
								}						
							}
						} else {								
							ouputList.push({domainValueId: item.valueSelect, valorEjeElemCatId: null});
						}
						const a: any = {							
							axisAttributeId: item.id,
							domainValues: ouputList,
							userValue: !item.valuesInDomain ? item.value : null
						};						
						array.push(a);
					}

					//console.log('Alta.array attrs: ' + JSON.stringify(array));
				}

				if (keepGoing) {
					this.submitLoading = true;

					let params = form;
					params.catalogElementTypeId = 4;
					params.attributeValuesCollection = array;					
					//console.log('Alta.attributeValuesCollection: ' + JSON.stringify(params.attributeValuesCollection));
					this.catalogService.createItem(params)
						.subscribe(
							res => {
								this.submitLoading = false;
								let c = {
									type: type,
									res: res
								};
								this.dialogRef.close(c);

								this._snackBar.open('Se ha creado con éxito', 'Cerrar', {
									horizontalPosition: 'center',
									verticalPosition: 'top',
									duration: 3000
								});
							},
							error => {
								this.submitLoading = false;

								this._snackBar.open(error.error.errors[0].message ? error.error.errors[0].message : 'Error de aplicación', 'Cerrar', {
									horizontalPosition: 'center',
									verticalPosition: 'top',
									duration: 3000
								});
							}
						);
				}
			} else {
				this._snackBar.open('Complete todos los campos', 'Cerrar', {
					horizontalPosition: 'center',
					verticalPosition: 'top',
					duration: 3000
				});
			}
		} else {
			let c = {
				type: type,
				res: null
			};
			this.dialogRef.close(c);
		}
	}
}

/**
 * Componente de añadir nuevo.
 */
 @Component({
	selector: 'application.addnew-aditional',
	templateUrl: 'application.addnew-aditional.html',
})
export class ApplicationAddnewAditionalDialog implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	/** Sesión. */
	public sessionData: any;

	/** Objeto formulario. */
	public actionForm: any;

	/** Objeto tabla. */
	public dataSource = new MatTableDataSource<any>();

	/** Listado de columnas. */
	public displayedColumns: any;

	/** Listado de parámetros del paginador. */
	public pageParameters = {
		page: 1,
		pageSize: 10,
		order: 'desc',
		sort: 'id',
		startDate: null,
		endDate: null,
		pageStatus: 'loading', // 'void', 'data'
		pageSizeTable: 10,
		pageSizeOptions: [5, 10, 25, 100],
		filterLoading: false,
		filterOpenState: false
	};

	/** Indica si el formulario se ha enviado. */
	public submitLoading: boolean = false;

	/** Listado de estados. */
	public axisAtributes: any;

	/** Listado de estados. */
	public elementTypes: any;

	/** Objeto selector. */
	public selection: any;

	/** Listado de grupos. */
	public groups: any;

	/**
	 * Constructor de la clase.
	 * @param dialogRef Objeto dialog.
	 * @param data Datos.
	 * @param fb Objeto Formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param catalogService Servicio de catalogos.
	 */
	constructor(
		public dialogRef: MatDialogRef<ApplicationAddnewDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private catalogService: CatalogService,
	) {
		this.sessionData = this.data.sessionData ? this.data.sessionData : [];
		this.elementTypes = this.data.selects ? this.data.selects.elementTypes : [];
		let axisAtributes = this.data.selects ? this.data.selects.axisAtributes : [];
		let aditionalData = this.data.selects ? this.data.selects.aditionalData : [];

		// From edit add selected to aditional
		if (this.data.name === 'edit') {
			axisAtributes = ([].concat(axisAtributes, aditionalData)).sort((a: any, b: any) => a.id - b.id);
		}

		// Show aditional table
		this.pageParameters.pageStatus = axisAtributes.length ? 'data' : 'void';

		// Table
		this.displayedColumns = ['select', 'cappCode', 'name'];
		this.dataSource = new MatTableDataSource<any>(axisAtributes);

		let s = [];
		if (aditionalData.length) {
			s = axisAtributes.map((i: any) => {
				if (aditionalData.find((a: any) => a.id === i.id)) {
					i.isSelected = true;
					return i;
				}
				return null;
			}).filter((n: any) => n);
		}
		this.selection = new SelectionModel<any>(true, s);
	}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			name: ['', [Validators.required]],
			cappCode: ['', [Validators.required]],
			elementType: ['', [Validators.required]]
		});
	}

	ngOnDestroy() {
		/* let c = {
			type: null,
			res: null
		};
		this.dialogRef.close(c); */
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	/**
	 * Método que comprueba si se han seleccionado todas las filas.
	 * @returns True en caso afirmativo, false en caso contrario.
	 */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	/**
	 * Método que selecciona todas las filas. Si están todas seleccionadas las limpia.
	 * @returns Nulo.
	 */
	masterToggle() {
		if (this.isAllSelected()) {
			this.selection.clear();
			return;
		}

		this.selection.select(...this.dataSource.data);
	}

	/**
	 * Método que selecciona o deselecciona.
	 * @param row Fila.
	 * @returns Valor.
	 */
	checkboxLabel(row?: any): string {
		if (!row) {
			return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
	}

	/**
	 * Método que envia el formulario.
	 * @param type Tipo de botón clicado.
	 */
	submit(type: any) {
		if (type === 'save') {
			
			this.submitLoading = true;

			let items = this.selection.selected.map((i: any) => {
				return {
					id: i.id,
					name: i.name,
					cappCode: i.cappCode,
				}
			});

			let c = {
				type: 'save',
				res: items
			};
			this.dialogRef.close(c);

			this._snackBar.open('Se ha añadido con éxito', 'Cerrar', {
				horizontalPosition: 'center',
				verticalPosition: 'top',
				duration: 3000
			});
			
		} else {
			let c = {
				type: type,
				res: null
			};
			this.dialogRef.close(c);
		}
	}
}

/**
 * Componente de editar.
 */
@Component({
	selector: 'application.edit',
	templateUrl: 'application.edit.html'
})
export class ApplicationEditDialog implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	/** Sesión. */
	public sessionData: any;

	/** Objeto formulario. */
	public actionForm: any;

	/** Objeto tabla. */
	public dataSource = new MatTableDataSource<any>();

	/** Objeto tabla. */
	public dataSourceAditional = new MatTableDataSource<any>();

	/** Listado de columnas. */
	public displayedColumns: string[] = [
		'mandatory',
		'attribute',
		'description',
		'value'
	];

	/** Listado de columnas. */
	public displayedColumnsAditional: string[] = [
		'cappCode',
		'name',
		'actions'
	];

	/** Listado de parámetros del paginador. */
	public pageParameters = {
		page: 1,
		pageSize: 10,
		order: 'desc',
		sort: 'id',
		startDate: null,
		endDate: null,
		pageStatus: 'loading', // 'void', 'data'
		pageSizeTable: 10,
		pageSizeOptions: [5, 10, 25, 100],
		filterLoading: false,
		filterOpenState: false
	};

	/** Indica si el formulario se ha enviado. */
	public submitLoading: boolean = false;

	/** Listado de estados. */
	public axisAtributes: any;

	/** Listado de estados. */
	public axisAtributesAditional: any;

	/** Listado de estados. */
	public elementTypes: any;

	/** Objeto selector. */
	public selection: any;

	/** Objeto selector. */
	public aditionalData: any;

	/** Listado de grupos. */
	public groups: any;

	/**
	 * Constructor de la clase.
	 * @param dialogRef Objeto dialog.
	 * @param data Datos.
	 * @param fb Objeto Formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param catalogService Servicio de catalogos.
	 */
	constructor(
		public dialog: MatDialog,
		public dialogRef: MatDialogRef<ApplicationAddnewDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private catalogService: CatalogService,
	) {
		this.sessionData = this.data.sessionData ? this.data.sessionData : [];
		this.groups = this.data.selects ? this.data.selects.groups : [];
		let axisAtributes = this.data.selects ? this.data.selects.axisAtributes : [];
		axisAtributes.map((x: any) => {
			let temp = this.data.item.attributeValuesCollection.find((element: any)=> element.axisAttributeId === x.id);
			x.valueSelect = temp.domainValues && temp.domainValues.length > 0 ? temp.domainValues[0].domainValueId : null;
			x.valueElementId = temp.domainValues.length > 0 ? temp.domainValues[0].valorEjeElemCatId : null;
			let inputSelectList = [];
			for (let i=0; i < temp.domainValues.length; i++) {
				inputSelectList.push(temp.domainValues[i].domainValueId);
			}
			x.valuesOfSelect = inputSelectList;
			x.value = temp.userValue;
		});

		this.dataSource.data = axisAtributes;

		// Aditional
		this.aditionalData = this.data.item.subElements;
		this.dataSourceAditional.data = this.aditionalData;
	}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			id: [this.data.item?.id, [Validators.required]],
			name: [this.data.item?.name, [Validators.required]],
			cappCode: [this.data.item?.cappCode, [Validators.required]],
			groupId: [this.data.item?.groupId, [Validators.required]]
		});

		// Selects
		this.selects();
	}

	ngOnDestroy() {
		/* let c = {
			type: null,
			res: null
		};
		this.dialogRef.close(c); */
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	/**
	 * Método que obtiene el listado de los selects.
	 */
	selects() {
		this.catalogService.getElementosPromo()
			.subscribe((res: any) => {
				this.axisAtributesAditional = res;
			});
	}

	/**
	 * Método que añade nuevo.
	 */
	addNewAditional() {
		const dialogRef = this.dialog.open(ApplicationAddnewAditionalDialog, {
			data: {
				name: 'edit',
				sessionData: this.sessionData,
				selects: {
					axisAtributes: this.axisAtributesAditional,
					elementTypes: this.elementTypes,
					aditionalData: this.aditionalData
				}
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result && result.type === 'save') {
				this.aditionalData = result.res;
				this.dataSourceAditional.data = this.aditionalData;
			}
		});
	}

	deleteAditional(item: any) {
		var index = this.aditionalData.map((x: any) => { return x.id; }).indexOf(item.id);
		this.aditionalData.splice(index, 1);
		this.dataSourceAditional.data = this.aditionalData;
	}

	/**
	 * Método que envia el formulario.
	 * @param type Tipo de botón clicado.
	 */
	submit(type: any) {
		if (type === 'save') {
			if (this.actionForm.valid) {
				const form = this.actionForm.value;
				const table: any = this.dataSource.filteredData;

				let keepGoing = true;
				let array = [];

				if (form.cappCode.length !== 4) {
					this._snackBar.open('El Código CAPP tiene que tener exactamente 4 caracteres alfanuméricos', 'Cerrar', {
						horizontalPosition: 'center',
						verticalPosition: 'top',
						duration: 3000
					});

					keepGoing = false;
				} else {
					for (let item of table) {
						if (item.mandatory && !item.valueSelect && !item.valuesOfSelect && !item.value) {
							if (item.valuesInDomain) {
								this._snackBar.open('Completa el Atributo "' + item.name + '"', 'Cerrar', {
									horizontalPosition: 'center',
									verticalPosition: 'top',
									duration: 3000
								});

								keepGoing = false;
								break;
							} else {
								this._snackBar.open('Completa el Atributo "' + item.name + '" con el formato "' + item.observations + '"', 'Cerrar', {
									horizontalPosition: 'center',
									verticalPosition: 'top',
									duration: 3000
								});

								keepGoing = false;
								break;
							}
						}

						if (item.mandatory && !item.valuesInDomain && item.value && !item.value.match(item.regex)) {
							this._snackBar.open('El Atributo "' + item.name + '" incumple el formato "' + item.observations + '", por favor reviselo', 'Cerrar', {
								horizontalPosition: 'center',
								verticalPosition: 'top',
								duration: 3000
							});

							keepGoing = false;
							break;
						}
						let ouputList = [];
						if (item.multiple) {
							for (let i=0; i < item.valuesOfSelect.length; i++) {
								if (item.valuesOfSelect[i]) {
									//console.log('item.valuesOfSelect[i]: ' + item.valuesOfSelect[i]);
									ouputList.push({domainValueId: item.valuesOfSelect[i], valorEjeElemCatId: item.valueElementId});
								}						
							}
						} else {
							//console.log('item.valueSelect: ' + item.valueSelect);				
							ouputList.push({domainValueId: item.valueSelect, valorEjeElemCatId: item.valueElementId});
						}
						const a: any = {							
							axisAttributeId: item.id,
							domainValues: ouputList,
							userValue: !item.valuesInDomain ? item.value : null
						};

						array.push(a);
					}
				}

				if (keepGoing) {
					this.submitLoading = true;

					let params = form;
					params.catalogElementTypeId = 4;
					params.attributeValuesCollection = array;
					//console.log('EDIT.attributeValuesCollection: ' + JSON.stringify(params.attributeValuesCollection));

					this.catalogService.updateItem(params)
						.subscribe(
							res => {
								this.submitLoading = false;
								let c = {
									type: type,
									res: res
								};
								this.dialogRef.close(c);

								this._snackBar.open('Se ha actualizado con éxito', 'Cerrar', {
									horizontalPosition: 'center',
									verticalPosition: 'top',
									duration: 3000
								});
							},
							error => {
								this.submitLoading = false;

								this._snackBar.open(error.error.errors[0].message ? error.error.errors[0].message : 'Error de aplicación', 'Cerrar', {
									horizontalPosition: 'center',
									verticalPosition: 'top',
									duration: 3000
								});
							}
						);
				}
			} else {
				this._snackBar.open('Complete todos los campos', 'Cerrar', {
					horizontalPosition: 'center',
					verticalPosition: 'top',
					duration: 3000
				});
			}
		} else {
			let c = {
				type: type,
				res: null
			};
			this.dialogRef.close(c);
		}
	}
}
