import { AfterViewInit, Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { Validators, FormBuilder }  from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivitiesQAService } from 'src/app/core/services/activities-qa.services';
import { UsersService } from 'src/app/core/services/users.services';

/**
 * Componente de los atributos
 */
@Component({
	selector: 'app-activities-qa',
	templateUrl: './activities-qa.component.html'
})
export class ActivitiesQAComponent implements OnInit, AfterViewInit {
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
		"stageQAName",
		"description",
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

	public stagesQA: any = [];
	public pesos: any = [];
	public umbrales: any = [];

	/**
	 * Constructor de la clase.
	 * @param dialog Objeto dialog.
	 * @param _fb Objeto formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param usersService Servicio de usuarios.	 
	 * @param activitiesQAService Servicio de actividades QA.	 
	 */
	constructor(
		public dialog: MatDialog,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private activitiesQAService: ActivitiesQAService,
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
			testingStageId: ['', [Validators.required]],
			description: ['', [Validators.required]],
			help: ['', [Validators.required]],
			idealThreshold: ['', []],
			startDate: ['', [Validators.required]],
			endDate: ['', [Validators.required]],
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
		
		this.activitiesQAService.getStagesQA()			
			.subscribe((res: any) => {
				this.stagesQA = res;
				//this.stagesQA.unshift("{id=null, name=''}");
			});
		this.pesos = [];
		this.umbrales = [];
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
				this.activitiesQAService.getActivitiesQA(params)
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
		const dialogRef = this.dialog.open(ActivitiesQAAddnewDialog, {
			data: {
				name: 'new',
				sessionData: this.sessionData,
				selects: {										
					stagesQA: this.stagesQA
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
			const dialogRef = this.dialog.open(ActivitiesQAEditDialog, {
				data: {
					name: 'edit',
					sessionData: this.sessionData,
					item: item,
					selects: {
						stagesQA: this.stagesQA
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
		} else if (type === 'pesos') {
			const dialogRef = this.dialog.open(PesosQAEditDialog, {
				data: {
					name: 'pesos',
					sessionData: this.sessionData,
					item: item,
					selects: {						
						pesos: item.pesos
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
		} else if (type === 'umbrales') {
				const dialogRef = this.dialog.open(UmbralesQAEditDialog, {
					data: {
						name: 'umbrales',
						sessionData: this.sessionData,
						item: item,
						selects: {						
							umbrales: item.umbrales
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

			this.activitiesQAService.deleteActivityQA(item)
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
	selector: 'activities-qa.addnew',
	templateUrl: 'activities-qa.addnew.html',
})
export class ActivitiesQAAddnewDialog implements OnInit {

	/** Objeto formulario. */
	public actionForm: any;

	/** Indica si el formulario se ha enviado. */
	public submitLoading: boolean = false;

	public filteredOptions = [
		{ id: 1, name: "Sí" },
		{ id: 0, name: "No" }
	  ];

	/** Listado de valores de pesos y umbrales. */
	public stagesQA: Array<any> = [];
	public pesos: Array<any> = [];
	public umbrales: Array<any> = [];

	/**
	 * Constructor de la clase.
	 * @param dialogRef Objeto dialog.
	 * @param data Datos.
	 * @param _fb Objeto Formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param activitiesQAService Servicio de actividades QA.
	 */
	constructor(
		public dialogRef: MatDialogRef<ActivitiesQAAddnewDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private activitiesQAService: ActivitiesQAService
	) {
		this.stagesQA = this.data.selects ? this.data.selects.stagesQA : [];
		this.pesos = this.data.selects ? this.data.selects.pesos : [];
		this.umbrales = this.data.selects ? this.data.selects.umbrales : [];
	}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
				
		// Form
		this.actionForm = this._fb.group({
			name: ['', [Validators.required]],
			testingStageId: ['', [Validators.required]],
			description: ['', [Validators.required]],
			help: ['', [Validators.required]],
			idealThreshold: ['', []]		
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

				let params = form;				
				this.activitiesQAService.createActivityQA(params)
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
	selector: 'activities-qa.edit',
	templateUrl: 'activities-qa.edit.html',
})
export class ActivitiesQAEditDialog implements OnInit {

	/** Objeto formulario. */
	public actionForm: any;

	/** Indica si el formulario se ha enviado. */
	public submitLoading: boolean = false;

	/** Listado de valores de etapas QA. */
	public stagesQA: Array<any> = [];
		
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
	 * @param activitiesQAsService Servicio de actividades QA.
	 */
	constructor(
		public dialogRef: MatDialogRef<ActivitiesQAEditDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private activitiesQAService: ActivitiesQAService
	) {
		this.stagesQA = this.data.selects ? this.data.selects.stagesQA : [];		
	}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		
		// Form
		this.actionForm = this._fb.group({
			id: [this.data.item?.id, [Validators.required]],
			name: [this.data.item?.name, [Validators.required]],			
			testingStageId: [this.data.item?.testingStageId, [Validators.required]],
			description: [this.data.item?.description, [Validators.required]],			
			help: [this.data.item?.help, [Validators.required]],			
			idealThreshold: [this.data.item?.idealThreshold, []]
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
				
				let params = form;

				this.activitiesQAService.updateActivityQA(params)
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


@Component({
	selector: 'pesos-qa.edit',
	templateUrl: 'pesos-qa.editable.html'
})
export class PesosQAEditDialog implements OnInit, AfterViewInit {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	/** Objeto formulario. */
	public actionForm: any;

	@ViewChild('tablaPesos') tablaPesos!: ElementRef
	
	public nivelCatalogueLabels: any;
	public ejesQALabels: any; 
	public domainValuesLabels: any;

	public pesosQA: any;
	
	/** Indica si el formulario se ha enviado. */
	public submitLoading: boolean = false;

	/** Listado de parámetros del paginador. */
	public pageParameters = {
		pageStatus: 'loading', // 'void', 'data'
		pageSizeTable: 10,
		pageSizeOptions: [5, 10, 25, 100]
	};

	/**
	 * Constructor de la clase.
	 * @param dialogRef Objeto dialog.
	 * @param data Datos.
	 * @param _fb Objeto Formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param usersService Servicio de usuarios.
	 */
	constructor(
		public dialogRef: MatDialogRef<PesosQAEditDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private activitiesQAService: ActivitiesQAService,
	) {
		this.pesosQA = this.data.item.pesos;

		//cargar labels de los pesos
		this.activitiesQAService.getNamesOfCatLevels()
			.subscribe(
				(res: any) => {
					if (res.length) {
						this.nivelCatalogueLabels = res;
					}
				},
				error => {							
					this.pageParameters.pageStatus = 'void';
					this._snackBar.open('Ha ocurrido un error al cargar los labels de niveles de catálogo, intentelo de nuevo', 'Cerrar', {
						horizontalPosition: 'center',
						verticalPosition: 'top',
						duration: 10000
					});
				}
			);

		this.activitiesQAService.getAxisNames()
			.subscribe(
				(res: any) => {
					if (res.length) {
						this.ejesQALabels = res;
					}
				},
				error => {							
					this.pageParameters.pageStatus = 'void';
					this._snackBar.open('Ha ocurrido un error al cargar los labels de los ejes, intentelo de nuevo', 'Cerrar', {
						horizontalPosition: 'center',
						verticalPosition: 'top',
						duration: 10000
					});
				}
			);

		this.activitiesQAService.getDomainValuesNames()
		.subscribe(
			(res: any) => {
				if (res.length) {
					this.domainValuesLabels = res;
				}
			},
			error => {							
				this.pageParameters.pageStatus = 'void';
				this._snackBar.open('Ha ocurrido un error al cargar los labels de los ejes, intentelo de nuevo', 'Cerrar', {
					horizontalPosition: 'center',
					verticalPosition: 'top',
					duration: 10000
				});
			}
		);
		
	}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			id: [this.data.item?.id, [Validators.required]],			
			pesos: [this.data.item?.pesos, []]
		});
	}
	
	ngAfterViewInit() {
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
				
				const tabla = this.tablaPesos.nativeElement;
				const inputs = tabla.querySelectorAll('input');
				
				let params = form;
				params.id = form.id;

				let i = 0;
				inputs.forEach((input:any) => {
					const id = input.getAttribute('id');				
					const valor = input.value;
					params.pesos[i].id = id.split('-')[1];
					if (id.split('-')[0] === 'weightValue') {		
						//console.log("recogiendo	weightValue");		
						params.pesos[i].weightValue = valor;
					}else {
						//console.log("recogiendo forDelivery: " + input.checked);
						params.pesos[i++].forDelivery = (input.checked ? 1 : 0);
					}
				});
				
				this.submitLoading = true;
				
				this.activitiesQAService.updatePesosQA(params)
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


@Component({
	selector: 'umbrales-qa.edit',
	templateUrl: 'umbrales-qa.editable.html'
})
export class UmbralesQAEditDialog implements OnInit, AfterViewInit {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	/** Objeto formulario. */
	public actionForm: any;

	@ViewChild('tablaUmbrales') tablaUmbrales!: ElementRef
	
	public nivelCatalogueLabels: any;

	public umbrales: any;
	
	/** Indica si el formulario se ha enviado. */
	public submitLoading: boolean = false;

	/** Listado de parámetros del paginador. */
	public pageParameters = {
		pageStatus: 'loading', // 'void', 'data'
		pageSizeTable: 10,
		pageSizeOptions: [5, 10, 25, 100]
	};

	/**
	 * Constructor de la clase.
	 * @param dialogRef Objeto dialog.
	 * @param data Datos.
	 * @param _fb Objeto Formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param usersService Servicio de usuarios.
	 */
	constructor(
		public dialogRef: MatDialogRef<UmbralesQAEditDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private activitiesQAService: ActivitiesQAService,
	) {
		this.umbrales = this.data.item.umbrales;

		//cargar labels de los pesos
		this.activitiesQAService.getNamesOfCatLevels()
			.subscribe(
				(res: any) => {
					if (res.length) {
						this.nivelCatalogueLabels = res;
					}
				},
				error => {							
					this.pageParameters.pageStatus = 'void';
					this._snackBar.open('Ha ocurrido un error al cargar los labels de niveles de catálogo, intentelo de nuevo', 'Cerrar', {
						horizontalPosition: 'center',
						verticalPosition: 'top',
						duration: 10000
					});
				}
			);
		
	}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			id: [this.data.item?.id, [Validators.required]],			
			umbrales: [this.data.item?.umbrales, []]
		});
	}
	
	ngAfterViewInit() {
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
				
				const tabla = this.tablaUmbrales.nativeElement;
				const inputs = tabla.querySelectorAll('input');
				
				let params = form;
				params.id = form.id;

				let i = 0;
				inputs.forEach((input:any) => {
					const id = input.getAttribute('id');				
					const valor = input.value;
					params.umbrales[i].id = id.split('-')[1];
					if (id.split('-')[0] === 'lowerLimit') {		
						params.umbrales[i].lowerLimit = valor;
					}else if (id.split('-')[0] === 'upperLimit') {		
						params.umbrales[i].upperLimit = valor;
					}else if (id.split('-')[0] === 'threshold') {		
						params.umbrales[i].threshold = valor;
					}else {//forDelivery
						params.umbrales[i++].forDelivery = (input.checked ? 1 : 0);
					}
				});
				
				this.submitLoading = true;
				
				this.activitiesQAService.updateUmbralesQA(params)
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