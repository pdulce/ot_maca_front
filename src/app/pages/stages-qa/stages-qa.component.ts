import { AfterViewInit, Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Validators, FormBuilder }  from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivitiesQAService } from 'src/app/core/services/activities-qa.services';
import { UsersService } from 'src/app/core/services/users.services';

/**
 * Componente de los atributos
 */
@Component({
	selector: 'app-stages-qa',
	templateUrl: './stages-qa.component.html'
})
export class StagesQAComponent implements OnInit, AfterViewInit {
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

	/** Listado de valores de actividades QA. */
	public actividadesCalidad: any = [];

	/**
	 * Constructor de la clase.
	 * @param dialog Objeto dialog.
	 * @param _fb Objeto formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param usersService Servicio de usuarios.	 
	 * @param actividadesQAService Servicio de etapas y actividades de pruebas.	 
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

	selects() {
		
		this.activitiesQAService.getActivitiesQA()
			.subscribe((res: any) => {
				this.actividadesCalidad = res;				
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
				this.activitiesQAService.getStagesQA(params)
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
		const dialogRef = this.dialog.open(StagesQAAddnewDialog, {
			data: {
				name: 'new',
				sessionData: this.sessionData,
				selects: {
					actividadesCalidad: this.actividadesCalidad
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
			const dialogRef = this.dialog.open(StagesQAEditDialog, {
				data: {
					name: 'edit',
					sessionData: this.sessionData,
					item: item,
					selects: {
						actividadesCalidad: this.actividadesCalidad
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

			this.activitiesQAService.deleteStageQA(item)
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
	selector: 'stages-qa.addnew',
	templateUrl: 'stages-qa.addnew.html',
})
export class StagesQAAddnewDialog implements OnInit, AfterViewInit {
		@ViewChild(MatPaginator) paginator!: MatPaginator;
		@ViewChild(MatSort) sort!: MatSort;

	/** Objeto formulario. */
	public actionForm: any;

	/** Indica si el formulario se ha enviado. */
	public submitLoading: boolean = false;

	/** Listado de columnas. */
	public displayedColumns: any;

	/** Objeto tabla. */
	public dataSource = new MatTableDataSource<any>();

	/** Objeto selección. */
	public selection: any;

	public filteredOptions = [
		{ id: 1, name: "Sí" },
		{ id: 0, name: "No" }
	  ];

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
	 * @param activitiesQAService Servicio de etapas y actividades QA.
	 */
	constructor(
		public dialogRef: MatDialogRef<StagesQAAddnewDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private activitiesQAService: ActivitiesQAService
	) {		

		let actividadesCalidad = this.data.selects ? this.data.selects.actividadesCalidad : [];

		// Show aditional table
		this.pageParameters.pageStatus = actividadesCalidad.length ? 'data' : 'void';

		// Table
		this.displayedColumns = ['select', 'id', 'name', 'description'];
		this.dataSource = new MatTableDataSource<any>(actividadesCalidad);
		this.selection = new SelectionModel<any>(true, []);
	}	

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
				
		// Form
		this.actionForm = this._fb.group({
			name: ['', [Validators.required]],
			description: [this.data.item?.name, []]
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
					params.actividadesQA = [];
				} else {
					let items = this.selection.selected.map((i: any) => {					
						return {				
							id: i.id,		
							testingStageId: params.id
						}
					});
					params.actividadesQA = items;
				}
				this.submitLoading = true;

				this.activitiesQAService.createStageQA(params)
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
	selector: 'stages-qa.edit',
	templateUrl: 'stages-qa.edit.html',
})
export class StagesQAEditDialog implements OnInit, AfterViewInit {
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
		public dialogRef: MatDialogRef<StagesQAEditDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private activitiesQAService: ActivitiesQAService,
	) {
		let actividadesCalidad = this.data.selects ? this.data.selects.actividadesCalidad : [];
		let actividadesQA = this.data.item.actividadesQA;
		//console.log("actividadesQA.length: " + actividadesQA.length);

		// Table
		this.displayedColumns = ['select', 'id', 'name', 'description'];
		this.dataSource = new MatTableDataSource<any>(actividadesCalidad);

		// Show aditional table
		this.pageParameters.pageStatus = actividadesCalidad.length ? 'data' : 'void';
		
		// Actividades QA of a stage id
		let s = [];
		if (actividadesQA.length) {
			s = actividadesCalidad.map((i: any) => {
				if (actividadesQA.find((a: any) => a.id === i.id)) {
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
			id: [this.data.item?.id, [Validators.required]],
			name: [this.data.item?.name, [Validators.required]],
			description: [this.data.item?.name, []]
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
					params.actividadesQA = [];
				} else {
					let items = this.selection.selected.map((i: any) => {
						return {						
							id: i.id,
							testingStageId: params.id
						}
					});
					params.actividadesQA = items;	
				} 
				this.submitLoading = true;
				
				this.activitiesQAService.updateStageQA(params)
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
							//console.error('Ocurrió un error:', error.errors);
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