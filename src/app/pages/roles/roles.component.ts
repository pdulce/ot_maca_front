import { AfterViewInit, Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UsersService } from 'src/app/core/services/users.services';
import { identifierName } from '@angular/compiler';

/**
 * Componente de los usuarios.
 */
@Component({
	selector: 'app-roles',
	templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit, AfterViewInit {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatAccordion) accordion!: MatAccordion;

	/** Sesión. */
	public sessionData: any;

	/** Objeto formulario. */
	public actionForm: any;

	/** Listado de roles. */
	public rolePrivileges: any;

	/** Objeto tabla. */
	public dataSource = new MatTableDataSource<any>();

	/** Listado de columnas. */
	public displayedColumns: string[] = [
		"id",
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
		pageSizeOptions: [5, 10, 25, 100],
		filterLoading: false,
		filterOpenState: false
	};

	/**
	 * Constructor de la clase.
	 * @param dialog Objeto dialog.
	 * @param _fb Objeto formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param usersService Servicio de usuarios.
	 * @param rolesService Servicio de roles.
	 * @param commonService Servicio de endpoints genéricos.
	 */
	constructor(
		public dialog: MatDialog,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
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

	/**
	 * Método que obtiene el listado de los selects.
	 */
	selects() {
		this.usersService.getRolePrivileges()
			.subscribe((res: any) => {
				this.rolePrivileges = res;
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
				this.usersService.getRoles(params)
					.subscribe(
						(res: any) => {
							this.pageParameters.filterLoading = false;

							if (res.length) {
								for (const item of res) {
									item.roleName = item.role ? item.role.name : null;
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
		const dialogRef = this.dialog.open(RolesAddnewDialog, {
			data: {
				name: 'new',
				sessionData: this.sessionData,
				selects: {
					rolePrivileges: this.rolePrivileges
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
			const dialogRef = this.dialog.open(RolesEditDialog, {
				data: {
					name: 'edit',
					sessionData: this.sessionData,
					item: item,
					selects: {
						rolePrivileges: this.rolePrivileges
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

			this.usersService.deleteRole(item)		  
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
						//console.error('Ocurrió un error al borrar el rol:', errors.message);
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
 * Componente de añadir uno nuevo.
 */
@Component({
	selector: 'roles.addnew',
	templateUrl: 'roles.addnew.html',
})
export class RolesAddnewDialog implements OnInit, AfterViewInit {
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
		public dialogRef: MatDialogRef<RolesAddnewDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private usersService: UsersService
	) {
		let rolePrivileges = this.data.selects ? this.data.selects.rolePrivileges : [];

		// Show aditional table
		this.pageParameters.pageStatus = rolePrivileges.length ? 'data' : 'void';

		// Table
		this.displayedColumns = ['select', 'id', 'name', 'description'];
		this.dataSource = new MatTableDataSource<any>(rolePrivileges);
		this.selection = new SelectionModel<any>(true, []);
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
	
					this._snackBar.open('Debe seleccionar al menos un permiso', 'Cerrar', {
						horizontalPosition: 'center',
						verticalPosition: 'top',
						duration: 3000
					});
				} else {
					this.submitLoading = true;

					let items = this.selection.selected.map((i: any) => {
						return {
							privilegeId: i.id
						}
					});
					params.permisos = items;

					this.usersService.createRole(params)
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
	selector: 'roles.edit',
	templateUrl: 'roles.edit.html',
})
export class RolesEditDialog implements OnInit, AfterViewInit {
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
		public dialogRef: MatDialogRef<RolesEditDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private usersService: UsersService,
	) {
		let rolePrivileges = this.data.selects ? this.data.selects.rolePrivileges : [];
		let permissions = this.data.item.permisos;

		// Table
		this.displayedColumns = ['select', 'id', 'name', 'description'];
		this.dataSource = new MatTableDataSource<any>(rolePrivileges);

		// Show aditional table
		this.pageParameters.pageStatus = rolePrivileges.length ? 'data' : 'void';

		// Permissions
		let s = [];
		if (permissions.length) {
			s = rolePrivileges.map((i: any) => {
				if (permissions.find((a: any) => a.privilegeId === i.id)) {
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
			name: [this.data.item?.name, [Validators.required]]
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
	
					this._snackBar.open('Debe seleccionar al menos un permiso', 'Cerrar', {
						horizontalPosition: 'center',
						verticalPosition: 'top',
						duration: 3000
					});
				} else {
					this.submitLoading = true;

					let items = this.selection.selected.map((i: any) => {
						return {
							roleId: params.id,
							privilegeId: i.id
						}
					});
					params.permisos = items;

					this.usersService.updateRole(params)
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
