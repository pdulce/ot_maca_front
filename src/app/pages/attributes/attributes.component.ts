import { AfterViewInit, Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Validators, FormBuilder }  from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AttributesService } from 'src/app/core/services/attributes.services';
import { UsersService } from 'src/app/core/services/users.services';

/**
 * Componente de los atributos
 */
@Component({
	selector: 'app-attributes',
	templateUrl: './attributes.component.html'
})
export class AttributesComponent implements OnInit, AfterViewInit {
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
		"id",
		"name",
		"code",
		"axis",
		"mandatory",
		"multiple",
		"domainValues",
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
		pageSizeOptions: [5, 10, 25, 100],
		filterLoading: false,
		filterOpenState: false
	};

	/** Listado de valores de elementypes. */
	public elementypes: any = [];
	public collateralAttributes: any = [];

	/**
	 * Constructor de la clase.
	 * @param dialog Objeto dialog.
	 * @param _fb Objeto formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param usersService Servicio de usuarios.	 
	 * @param attributesService Servicio de atributos.	 
	 */
	constructor(
		public dialog: MatDialog,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private attributesService: AttributesService,
		private usersService: UsersService
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
	 * Método que obtiene el listado de los selects.
	 */
	selects() {
		
		this.attributesService.getElementTypes()
			.subscribe((res: any) => {
				this.elementypes = res;
			});

		this.attributesService.getElementAttrs()
			.subscribe((res: any) => {
				this.collateralAttributes = res;
				this.collateralAttributes.unshift("{id=null, name=''}");
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
				this.attributesService.getElementAttrs(params)
					.subscribe(
						(res: any) => {
							this.pageParameters.filterLoading = false;

							if (res.length) {
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
		const dialogRef = this.dialog.open(AttributesAddnewDialog, {
			data: {
				name: 'new',
				sessionData: this.sessionData,
				selects: {					
					elementypes: this.elementypes,
					collateralAttributes: this.collateralAttributes
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
			const dialogRef = this.dialog.open(AttributesEditDialog, {
				data: {
					name: 'edit',
					sessionData: this.sessionData,
					item: item,
					selects: {
						domainValues: item.domainValues,
						elementypes: this.elementypes,
						collateralAttributes: this.collateralAttributes
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
		} else if (type === 'delete') {
			item.isDeleted = 1;

			this.attributesService.deleteElementAttr(item)
				.subscribe(
					res => {
						item.style = 'delete';

						setTimeout(() => {
							var index = this.dataSource.data.map((x: any) => { return x.id; }).indexOf(item.id);
							this.dataSource.data.splice(index, 1);
							this.dataSource.filter = '';

							this._snackBar.open('Se ha eliminado con exito', 'Cerrar', {
								horizontalPosition: 'center',
								verticalPosition: 'top',
								duration: 10000
							});
						}, 1200);
					},
					error => {
						this._snackBar.open('Ha ocurrido un error, intentelo de nuevo', 'Cerrar', {
							horizontalPosition: 'center',
							verticalPosition: 'top',
							duration: 10000
						});
					}
				);
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
 * Componente de añadir un nuevo usuario.
 */
@Component({
	selector: 'attributes.addnew',
	templateUrl: 'attributes.addnew.html',
})
export class AttributesAddnewDialog implements OnInit {

	/** Objeto formulario. */
	public actionForm: any;

	/** Indica si el formulario se ha enviado. */
	public submitLoading: boolean = false;

	public filteredOptions = [
		{ id: 1, name: "Sí" },
		{ id: 0, name: "No" }
	  ];

	/** Listado de valores de element types y de atributos elegibles. */
	public elementypes: Array<any> = [];
	public collateralAttributes: Array<any> = [];

	/**
	 * Constructor de la clase.
	 * @param dialogRef Objeto dialog.
	 * @param data Datos.
	 * @param _fb Objeto Formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param attributesService Servicio de atributos.
	 */
	constructor(
		public dialogRef: MatDialogRef<AttributesAddnewDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private attributesService: AttributesService
	) {
		this.elementypes = this.data.selects ? this.data.selects.elementypes : [];		
		this.collateralAttributes = this.data.selects ? this.data.selects.collateralAttributes : [];
	}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
				
		// Form
		this.actionForm = this._fb.group({
			name: ['', [Validators.required]],
			code: ['', [Validators.required]],
			axis: ['', [Validators.required]],
			mandatory: ['', [Validators.required]],
			valuesInDomain: ['', [Validators.required]],
			axisAttributeCollateralId: ['', []],
			defaultValue: ['', [Validators.nullValidator]],
			regex: ['', [Validators.nullValidator]],
			fromCapp: ['', [Validators.nullValidator]],
			multiple: ['', [Validators.nullValidator]],
			help: ['', [Validators.nullValidator]],
			observations: ['', [Validators.nullValidator]],
			elementypes: ['', [Validators.nullValidator]]
		});
	}

	/**
	 * Método que envia el formulario.
	 * @param type Tipo de botón clicado.
	 * @param ev Evento.
	 */
	submit(type: any) {
		if (type === 'save') {
			if (this.actionForm.valid) {
				const form = this.actionForm.value;
				this.submitLoading = true;

				let elementypes = form.elementypes.map((i: any) => {
					return {
						id: i
					}
				});

				form.elementypes = elementypes;				

				let params = form;

				this.attributesService.createElementAttr(params)
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

							this._snackBar.open(error.error.errors[0].message ? error.error.errors[0].message : 'Error de aplicación', 'Cerrar', {
								horizontalPosition: 'center',
								verticalPosition: 'top',
								duration: 10000
							});
						}
					);
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
 * Componente de editar un atributo.
 */
@Component({
	selector: 'attributes.edit',
	templateUrl: 'attributes.edit.html',
})
export class AttributesEditDialog implements OnInit {

	/** Objeto formulario. */
	public actionForm: any;

	/** Indica si el formulario se ha enviado. */
	public submitLoading: boolean = false;

	/** Listado de valores de dominio. */
	public domainValues: Array<any> = [];
	public elementypes: Array<any> = [];
	public collateralAttributes: Array<any> = [];
		
	public filteredOptions = [
		{ id: 1, name: "Sí" },
		{ id: 0, name: "No" }
	  ];

	/**
	 * Constructor de la clase.
	 * @param dialogRef Objeto dialog.
	 * @param data Datos.
	 * @param _fb Objeto Formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param attributesService Servicio de atributos.
	 */
	constructor(
		public dialogRef: MatDialogRef<AttributesEditDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private attributesService: AttributesService
	) {
		this.domainValues = this.data.selects ? this.data.selects.domainValues : [];
		this.elementypes = this.data.selects ? this.data.selects.elementypes : [];		
		this.collateralAttributes = this.data.selects ? this.data.selects.collateralAttributes : [];			
	}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		this.data.item.domainValuesIds = this.data.item.domainValues.map((i: any) => {			
			return i.id 
		});
		
		this.data.item.elementypesIds = this.data.item.elementypes.map((i: any) => {					
			return i.id 
		});
		
		// Form
		this.actionForm = this._fb.group({
			id: [this.data.item?.id, [Validators.required]],
			name: [this.data.item?.name, [Validators.required]],			
			code: [this.data.item?.code, [Validators.required]],
			axis: [this.data.item?.axis, [Validators.required]],
			mandatory: [this.data.item?.mandatory, [Validators.required]],
			valuesInDomain: [this.data.item?.valuesInDomain, [Validators.required]],
			axisAttributeCollateralId: [this.data.item?.axisAttributeCollateralId, []],
			defaultValue: [this.data.item?.defaultValue, [Validators.nullValidator]],
			regex: [this.data.item?.regex, [Validators.nullValidator]],			
			fromCapp: [this.data.item?.fromCapp, [Validators.nullValidator]],
			multiple: [this.data.item?.multiple, [Validators.nullValidator]],
			help: [this.data.item?.help, [Validators.nullValidator]],
			observations: [this.data.item?.observations, [Validators.nullValidator]],
			domainValues: [this.data.item?.domainValuesIds, [Validators.nullValidator]],
			elementypes: [this.data.item?.elementypesIds, [Validators.nullValidator]]			
		});

	}


	/**
	 * Método que envia el formulario.
	 * @param type Tipo de botón clicado.
	 * @param ev Evento.
	 */
	submit(type: any) {
		if (type === 'save') {
			if (this.actionForm.valid) {
				const form = this.actionForm.value;
				this.submitLoading = true;
				
				let domainValues = form.domainValues.map((i: any) => {
					return {
						id: i
					}
				});
				let elementypes = form.elementypes.map((i: any) => {
					return {
						id: i
					}
				});
				
				form.elementypes = elementypes;
				form.domainValues = domainValues;

				let params = form;

				this.attributesService.updateElementAttr(params)
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

							this._snackBar.open(error.error.errors[0].message ? error.error.errors[0].message : 'Error de aplicación', 'Cerrar', {
								horizontalPosition: 'center',
								verticalPosition: 'top',
								duration: 10000
							});
						}
					);
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
