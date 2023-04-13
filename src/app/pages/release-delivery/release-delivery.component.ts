import { AfterViewInit, Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatAccordion } from '@angular/material/expansion';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ActivatedRoute } from '@angular/router';

import { UsersService } from 'src/app/core/services/users.services';
import { CatalogService } from 'src/app/core/services/catalog.service';

/**
 * Componente.
 */
@Component({
	selector: 'app-release-delivery',
	templateUrl: './release-delivery.component.html'
})
export class ReleaseDeliveryComponent implements OnInit, AfterViewInit {
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
		'name',
		'creationDate',
		'actions'
	];

	/** Listado de parámetros del paginador. */
	public pageParameters = {
		id: null,
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
	public axisAtributes: any = [];

	/** Item. */
	public data: any;
	
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
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private usersService: UsersService,
		private catalogService: CatalogService,
		private route: ActivatedRoute
	) {}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		let data: any = this.window.localStorage.getItem('release-delivery');

		if (!data) {
			this._snackBar.open('La pantalla no dispone de suficiente informacion para dar de alta una entrega', 'Cerrar', {
				horizontalPosition: 'center',
				verticalPosition: 'top',
				duration: 3000
			});

			this.pageParameters.pageStatus = 'void';
		} else {
			data = JSON.parse(data);
			this.data = data;
			this.pageParameters.id = data.id;

			// selects
			this.selects(data.id);
		}

		// Form
		this.actionForm = this._fb.group({
			name: ['', [Validators.required]],
			startDate: ['', [Validators.required]],
			endDate: ['', [Validators.required]]
		});

		// Session
		this.sessionData = this.usersService.getLocalStorage()?.current;

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
	selects(id: any) {
		let params = {
			"id": id
		};
		this.catalogService.getByTypeOfIdElementAndDelivery(params)
			.subscribe((res: any) => {
				this.axisAtributes = res;
			});
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
				this.catalogService.getAllByIdOfElement(params)
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
		const dialogRef = this.dialog.open(ReleaseDeliveryAddnewDialog, {
			data: {
				name: 'new',
				sessionData: this.sessionData,
				item: this.data,
				selects: {
					axisAtributes: this.axisAtributes
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
			const dialogRef = this.dialog.open(ReleaseDeliveryEditDialog, {
				data: {
					name: 'edit',
					sessionData: this.sessionData,
					item: item,
					selects: {
						axisAtributes: this.axisAtributes
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

			this.catalogService.deleteDelivery(item)
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
						this._snackBar.open('Ha ocurrido un error, intentelo de nuevo', 'Cerrar', {
							horizontalPosition: 'center',
							verticalPosition: 'top',
							duration: 3000
						});
					}
				);
		}
	}
}

/**
 * Componente de añadir nuevo.
 */
@Component({
	selector: 'release-delivery.addnew',
	templateUrl: 'release-delivery.addnew.html',
})
export class ReleaseDeliveryAddnewDialog implements OnInit, AfterViewInit {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	/** Objeto formulario. */
	public actionForm: any;

	/** Objeto tabla. */
	public dataSource = new MatTableDataSource<any>();

	/** Listado de columnas. */
	public displayedColumns: string[] = [
		'mandatory',
		'attribute',
		'description',
		'value'
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

	/** Objeto selector. */
	public selection: any;

	/**
	 * Constructor de la clase.
	 * @param dialogRef Objeto dialog.
	 * @param data Datos.
	 * @param fb Objeto Formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param catalogService Servicio de catalogos.
	 */
	constructor(
		public dialogRef: MatDialogRef<ReleaseDeliveryAddnewDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private catalogService: CatalogService
	) {
		let axisAtributes = this.data.selects ? this.data.selects.axisAtributes : [];
		//axisAtributes.map((x: any) => {x.valueSelect = x.defaultValue});
		axisAtributes.map((x: any) => {
			//console.log('x.defaultValue: ' + x.defaultValue);
			let splitted = x.defaultValue === null ? [] : x.defaultValue.split(';');
			//console.log('splitted.length: ' + splitted.length);
			x.valueSelect = splitted.length === 0 ? '' : parseInt(splitted[0]);
			let inputSelectList = [];
			for (let i=0; i < splitted.length; i++) {
				inputSelectList.push(parseInt(splitted[i]));
			}
			x.valuesOfSelect = inputSelectList;
		});

		this.dataSource.data = axisAtributes;
	}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			name: ['', [Validators.required]]
		});
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
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
								ouputList.push({domainValueId: item.valuesOfSelect[i], valorEjeEntregaId: null});
							}						
						}
					} else {
						//console.log('item.valueSelect: ' + item.valueSelect);				
						ouputList.push({domainValueId: item.valueSelect, valorEjeEntregaId: null});
					}
					
					const a: any = {							
						axisAttributeId: item.id,
						domainValues: ouputList,
						userValue: !item.valuesInDomain ? item.value : null
					};

					array.push(a);
				}

				if (keepGoing) {
					this.submitLoading = true;

					let params = {
						name: this.data.item.name + '-' + form.name,
						catalogElementId: this.data.item.id,
						attributeValuesCollection: array
					};

					this.catalogService.createDelivery(params)
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
 * Componente de editar.
 */
@Component({
	selector: 'release-delivery.edit',
	templateUrl: 'release-delivery.edit.html'
})
export class ReleaseDeliveryEditDialog implements OnInit{
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	/** Objeto formulario. */
	public actionForm: any;

	/** Objeto tabla. */
	public dataSource = new MatTableDataSource<any>();

	/** Listado de columnas. */
	public displayedColumns: string[] = [
		'mandatory',
		'attribute',
		'description',
		'value'
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

	/** Objeto selector. */
	public selection: any;

	/**
	 * Constructor de la clase.
	 * @param dialogRef Objeto dialog.
	 * @param data Datos.
	 * @param fb Objeto Formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param catalogService Servicio de catalogos.
	 */
	constructor(
		public dialogRef: MatDialogRef<ReleaseDeliveryAddnewDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private catalogService: CatalogService,
	) {
		let axisAtributes = this.data.selects ? this.data.selects.axisAtributes : [];
		//console.log("this.data.item.attributeValuesCollection.length: " + this.data.item.attributeValuesCollection.length);
		//console.log("axisAtributes.length: " + axisAtributes.length);
		axisAtributes.map((x: any) => {
			
			let temp = this.data.item.attributeValuesCollection.find((element: any)=> element.axisAttributeId === x.id);
			x.valueSelect = temp.domainValues.length > 0 ? temp.domainValues[0].domainValueId : null;
			x.valueEntregaId = temp.domainValues.length > 0 ? temp.domainValues[0].valorEjeEntregaId : null;
			let inputSelectList = [];
			for (let i=0; i < temp.domainValues.length; i++) {
				inputSelectList.push(temp.domainValues[i].domainValueId);
			}
			x.valuesOfSelect = inputSelectList;
			x.value = temp.userValue;
		});

		this.dataSource.data = axisAtributes;
	}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			id: [this.data.item?.id, [Validators.required]],
			name: [this.data.item?.name, [Validators.required]]
		});
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
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
								ouputList.push({domainValueId: item.valuesOfSelect[i], valorEjeEntregaId: item.valueEntregaId});
							}						
						}
					} else {
						//console.log('item.valueSelect: ' + item.valueSelect);				
						ouputList.push({domainValueId: item.valueSelect, valorEjeEntregaId: item.valueEntregaId});
					}
					const a: any = {
						axisAttributeId: item.id,
						domainValues: ouputList,
						userValue: !item.valuesInDomain ? item.value : null
					};

					array.push(a);
				}

				if (keepGoing) {
					this.submitLoading = true;

					let params = {
						id: this.data.item.id,
						name: this.data.item.name,
						catalogElementId: this.data.item.id,
						attributeValuesCollection: array
					};

					this.catalogService.updateDelivery(params)
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
