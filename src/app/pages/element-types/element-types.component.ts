import { AfterViewInit, Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatAccordion } from '@angular/material/expansion';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { UsersService } from 'src/app/core/services/users.services';
import { AttributesService } from 'src/app/core/services/attributes.services';

/**
 * Componente de los usuarios.
 */
@Component({
	selector: 'app-element-types',
	templateUrl: './element-types.component.html'
})
export class ElemenTypesComponent implements OnInit, AfterViewInit {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatAccordion) accordion!: MatAccordion;

	/** Sesión. */
	public sessionData: any;

	/** Objeto formulario. */
	public actionForm: any;

	/** Listado de elementos. */
	public elementTypesAttrs: any;

	/** Objeto tabla. */
	public dataSource = new MatTableDataSource<any>();

	/** Listado de columnas. */
	public displayedColumns: string[] = [
		//"id",
		"hierarchyLevel",
		"name",		
		"creationDate",
		"actions"
	];

	/** Listado de parámetros del paginador. */
	public pageParameters = {
		page: 1,
		pageSize: 1000,
		order: 'desc',
		sort: 'id',
		startDate: null,
		endDate: null,
		pageStatus: 'loading', // 'void', 'data'
		pageSizeTable: 10,
		pageSizeOptions: [10],
		filterLoading: false,
		filterOpenState: false
	};

	/**
	 * Constructor de la clase.
	 * @param dialog Objeto dialog.
	 * @param _fb Objeto formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param usersService Servicio de tipos de usuarios.	 
	 * @param attributesService Servicio de atributos, tipos de elementos...
	 */
	constructor(
		public dialog: MatDialog,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private usersService: UsersService,
		private attributesService: AttributesService
	) {
		// Session
		this.sessionData = this.usersService.getLocalStorage()?.current;
	}

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
	 * Método que obtiene el listado de los selects de atributos con los que dar de alta un tipo de elemento
	 */
	selects() {
		this.attributesService.getElementAttrs()
			.subscribe((res: any) => {
				this.elementTypesAttrs = res;
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
				this.attributesService.getElementTypes(params)  // cambiado
					.subscribe(
						(res: any) => {
							this.pageParameters.filterLoading = false;

							if (res.length) {
								for (const item of res) {
									item.elementypeName = item.elementype ? item.elementype.name : null;
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
								duration: 10000
							});
						}
					);
			}, 1200);
		}
	}

	/**
	 * Método que añade un nuevo navegador.
	 */
	addNew() {
		const dialogRef = this.dialog.open(ElemenTypesAddnewDialog, {
			data: {
				name: 'new',
				sessionData: this.sessionData,
				selects: {
					elementTypesAttrs: this.elementTypesAttrs
				}
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result.type === 'save') {
				let r = result.res;
				r.style = 'create';

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
			const dialogRef = this.dialog.open(ElemenTypesEditDialog, {
				data: {
					name: 'edit',
					sessionData: this.sessionData,
					item: item,
					selects: {
						elementTypesAttrs: this.elementTypesAttrs
					}
				}
			});

			dialogRef.afterClosed().subscribe(result => {
				if (result.type === 'save') {
					let r = result.res;
					r.style = 'update';

					for (let i in this.dataSource.data) {
						if (this.dataSource.data[i].id === r.id) {
							this.dataSource.data[i] = r;
							this.dataSource.filter = '';
							break;
						}
					}
				}
			});		
		} else if (type === 'dashboard') {
			this._snackBar.open('En desarrollo', 'Cerrar', {
				horizontalPosition: 'center',
				verticalPosition: 'top',
				duration: 10000
			});
		}
	}
}

/**
 * Componente de añadir uno nuevo.
 */
@Component({
	selector: 'element-types.addnew',
	templateUrl: 'element-types.addnew.html',
})
export class ElemenTypesAddnewDialog implements OnInit, AfterViewInit {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	/** Objeto formulario. */
	public actionForm: any;

	/** Objeto tabla. */
	public dataSource = new MatTableDataSource<any>();

	/** Listado de columnas. */
	public displayedColumns: any;

	/** Objeto selección. */
	public selection: any;
	
	/** Indica si el formulario se ha enviado. */
	public submitLoading: boolean = false;

	/** Listado de parámetros del paginador. */
	public pageParameters = {
		pageStatus: 'loading', // 'void', 'data'
		pageSizeTable: 100,
		pageSizeOptions: [100]
	};

	/**
	 * Constructor de la clase.
	 * @param dialogRef Objeto dialog.
	 * @param data Datos.
	 * @param _fb Objeto Formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param attributesService Servicio de usuarios.
	 */
	constructor(
		public dialogRef: MatDialogRef<ElemenTypesAddnewDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private attributesService: AttributesService
	) {
		let elementTypesAttrs = this.data.selects ? this.data.selects.elementTypesAttrs : [];

		// Show aditional table
		this.pageParameters.pageStatus = elementTypesAttrs.length ? 'data' : 'void';

		// Table
		this.displayedColumns = ['select', 'id', 'name'];
		this.dataSource = new MatTableDataSource<any>(elementTypesAttrs);
		this.selection = new SelectionModel<any>(true, []);
	}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	 ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			name: ['', [Validators.required]],
			hierarchyLevel: ['', [Validators.required]]
		});
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
	 * @param ev Evento.
	 */
	submit(type: any, ev: Event) {
		if (type === 'save') {
			if (this.actionForm.valid) {
				const form = this.actionForm.value;
				this.submitLoading = true;
				let params = form;

				if (this.selection.selected.length === 0) {
					this.submitLoading = false;
	
					this._snackBar.open('Debe seleccionar al menos un atributo asociado a este tipo de elemento', 'Cerrar', {
						horizontalPosition: 'center',
						verticalPosition: 'top',
						duration: 3000
					});
				} else {
					this.submitLoading = true;

					let items = this.selection.selected.map((i: any) => {
						return {
							axisAttributeId: i.id
						}
					});
					params.atributosAsociados = items;

					this.attributesService.createElementType(params)
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
									duration: 10000
								});
							},
							error => {
								this.submitLoading = false;

								this._snackBar.open('Ha ocurrido un error, intentelo de nuevo', 'Cerrar', {
									horizontalPosition: 'center',
									verticalPosition: 'top',
									duration: 10000
								});
							}
						);
				}
			} else {
				this._snackBar.open('Complete todos los campos', 'Cerrar', {
					horizontalPosition: 'center',
					verticalPosition: 'top',
					duration: 10000
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
	selector: 'element-types.edit',
	templateUrl: 'element-types.edit.html',
})
export class ElemenTypesEditDialog implements OnInit, AfterViewInit {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	/** Objeto formulario. */
	public actionForm: any;

	/** Objeto tabla. */
	public dataSource = new MatTableDataSource<any>();

	/** Listado de columnas. */
	public displayedColumns: any;

	/** Objeto selección. */
	public selection: any;
	
	/** Indica si el formulario se ha enviado. */
	public submitLoading: boolean = false;

	/** Listado de parámetros del paginador. */
	public pageParameters = {
		pageStatus: 'loading', // 'void', 'data'
		pageSizeTable: 100,
		pageSizeOptions: [100]
	};

	/**
	 * Constructor de la clase.
	 * @param dialogRef Objeto dialog.
	 * @param data Datos.
	 * @param _fb Objeto Formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param attributesService Servicio de atributos, tipos de elementos, ...
	 */
	constructor(
		public dialogRef: MatDialogRef<ElemenTypesEditDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private attributesService: AttributesService
	) {
		let elementTypesAttrs = this.data.selects ? this.data.selects.elementTypesAttrs : [];
		let attributes = this.data.item.atributosAsociados;

		// Table
		this.displayedColumns = ['select', 'id', 'name', 'forCatalogue', 'forDelivery'];
		

		// Show aditional table
		this.pageParameters.pageStatus = elementTypesAttrs.length ? 'data' : 'void';

		// Attributes of a element type
		let s = [];
		if (attributes.length) {
			s = elementTypesAttrs.map((objetoA: any) => {											
				if (attributes.find((objetoB: any) => objetoB.axisAttributeId === objetoA.id)) {					
					objetoA.isSelected = true;					
					return objetoA;
				}
				return null;
			}).filter((n: any) => n);

			s.forEach( (objetoA: any) => {
				const objetoB = attributes.find((objetoB: any) => objetoB.axisAttributeId === objetoA.id);				
				if (objetoB) {
				  	objetoA.forCatalogue = objetoB.forCatalogue;
				  	objetoA.forDelivery = objetoB.forDelivery;
				} else {
					//console.log('objetoB no chequeado: ' + JSON.stringify(objetoB));
				  	objetoA.forCatalogue = '';
					objetoA.forDelivery = '';
				}
			  });
			  

		}
		//console.log("attributes[0] (del objeto AtributoEjePorTipoElemento): " + JSON.stringify(attributes[0]));
		//console.log("s[5] (del objeto AtributoEje mutado con dos nuevas propiedades): " + JSON.stringify(s[0]));
		this.dataSource = new MatTableDataSource<any>(elementTypesAttrs);
		this.selection = new SelectionModel<any>(true, s);
	}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			id: [this.data.item?.id, [Validators.required]],
			name: [this.data.item?.name, [Validators.required]],
			hierarchyLevel: [this.data.item?.hierarchyLevel, [Validators.required]]
		});
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
		//console.log("han pulsado el evento de selección");
		if (!row) {
			return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
	}
	
	/**
	 * Método que envia el formulario.
	 * @param type Tipo de botón clicado.
	 * @param ev Evento.
	 */
	submit(type: any, ev: Event) {
		if (type === 'save') {
			if (this.actionForm.valid) {
				const form = this.actionForm.value;
				this.submitLoading = true;
				let params = form;
				let forcatalogueListSelected: any[] = [];
				let fordeliveryListSelected: any[] = [];
								
				if (this.selection.selected.length === 0) {
					this.submitLoading = false;
	
					this._snackBar.open('Debe seleccionar al menos un atributo', 'Cerrar', {
						horizontalPosition: 'center',
						verticalPosition: 'top',
						duration: 3000
					});
				} else {
					this.submitLoading = true;
					
					const inputs = document.querySelectorAll('table td input');
					
					inputs.forEach((input:any) => {
						const id = input.getAttribute('id');
						let idAxisAttribute = parseInt(id.split('-')[1]);	
						if (id.split('-')[0] === 'forCatalogue') {							
							if (input.checked) {
								forcatalogueListSelected.push(idAxisAttribute);
							}
							
						}else if (id.split('-')[0] === 'forDelivery') {
							if (input.checked) {
								fordeliveryListSelected.push(idAxisAttribute);
							}
						}
						
					});

					//console.log("fordeliveryListSelected: " + fordeliveryListSelected);
					let items = this.selection.selected.map((i: any) => {														
						return {
							catalogElementTypeId: params.id,
							axisAttributeId: i.id,
							forCatalogue: forcatalogueListSelected.includes(i.id) ? 1 : 0,
							forDelivery: fordeliveryListSelected.includes(i.id) ? 1 : 0
						}
					});
					
					//console.log("items: " + JSON.stringify(items));
					params.atributosAsociados = items;

					this.attributesService.updateElementType(params)
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
									duration: 10000
								});
							},
							error => {
								this.submitLoading = false;

								this._snackBar.open('Ha ocurrido un error, intentelo de nuevo', 'Cerrar', {
									horizontalPosition: 'center',
									verticalPosition: 'top',
									duration: 10000
								});
							}
						);
				}
			} else {
				this._snackBar.open('Complete todos los campos', 'Cerrar', {
					horizontalPosition: 'center',
					verticalPosition: 'top',
					duration: 10000
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
