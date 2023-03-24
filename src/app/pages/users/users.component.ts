import { AfterViewInit, Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UsersService } from 'src/app/core/services/users.services';

/**
 * Componente de los usuarios.
 */
@Component({
	selector: 'app-users',
	templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit, AfterViewInit {
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
		"email",
		"silconCode",
		"roleName",
		"groupName",
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

	/** Listado de roles. */
	public roles: any = [];

	/** Listado de grupos de sistemas. */
	public groups: any = [];

	/**
	 * Constructor de la clase.
	 * @param dialog Objeto dialog.
	 * @param _fb Objeto formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param usersService Servicio de usuarios.
	 * @param rolesService Servicio de roles.
	 * @param groupsService Servicio de grupos de sistemas.
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
		this.usersService.getRoles()
			.subscribe((res: any) => {
				this.roles = res;
			});

		this.usersService.getGroups()
			.subscribe((res: any) => {
				this.groups = res;
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
				this.usersService.getUsers(params)
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
		const dialogRef = this.dialog.open(UsersAddnewDialog, {
			data: {
				name: 'new',
				sessionData: this.sessionData,
				selects: {
					roles: this.roles,
					groups: this.groups
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
			const dialogRef = this.dialog.open(UsersEditDialog, {
				data: {
					name: 'edit',
					sessionData: this.sessionData,
					item: item,
					selects: {
						roles: this.roles,
						groups: this.groups
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

			this.usersService.deleteUser(item)
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
	selector: 'users.addnew',
	templateUrl: 'users.addnew.html',
})
export class UsersAddnewDialog implements OnInit {

	/** Objeto formulario. */
	public actionForm: any;

	/** Indica si el formulario se ha enviado. */
	public submitLoading: boolean = false;

	/** Listado de roles. */
	public roles: Array<any> = [];

	/** Listado de grupos de sistemas. */
	public groups: Array<any> = [];

	/**
	 * Constructor de la clase.
	 * @param dialogRef Objeto dialog.
	 * @param data Datos.
	 * @param _fb Objeto Formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param usersService Servicio de usuarios.
	 */
	constructor(
		public dialogRef: MatDialogRef<UsersAddnewDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private usersService: UsersService,
	) {
		this.roles = this.data.selects ? this.data.selects.roles : [];
		this.groups = this.data.selects ? this.data.selects.groups : [];
	}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			name: ['', [Validators.required]],
			email: ['', [Validators.required]],
			password: ['', [Validators.required]],
			silconCode: ['', [Validators.required]],
			roleId: ['', [Validators.required]],
			groups: ['', [Validators.required]]
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

				let groups = form.groups.map((i: any) => {
					return {
						groupId: i
					}
				});

				form.groups = groups;
				let params = form;

				this.usersService.createUser(params)
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
 * Componente de editar un usuario.
 */
@Component({
	selector: 'users.edit',
	templateUrl: 'users.edit.html',
})
export class UsersEditDialog implements OnInit {

	/** Objeto formulario. */
	public actionForm: any;

	/** Indica si el formulario se ha enviado. */
	public submitLoading: boolean = false;

	/** Listado de roles. */
	public roles: Array<any> = [];

	/** Listado de grupos de sistemas. */
	public groups: Array<any> = [];

	/**
	 * Constructor de la clase.
	 * @param dialogRef Objeto dialog.
	 * @param data Datos.
	 * @param _fb Objeto Formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param usersService Servicio de usuarios.
	 */
	constructor(
		public dialogRef: MatDialogRef<UsersEditDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private usersService: UsersService,
	) {
		this.roles = this.data.selects ? this.data.selects.roles : [];
		this.groups = this.data.selects ? this.data.selects.groups : [];

		// Sistem groups
		if (this.data.item) {
			this.data.item.systemGroupIds = [];
			
			for (const i of this.data.item.groups) {
				this.data.item.systemGroupIds.push(i.id);
			}
		}
	}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		this.data.item.groupsIds = this.data.item.groups.map((i: any) => {
			return i.groupId 
		});

		// Form
		this.actionForm = this._fb.group({
			id: [this.data.item?.id, [Validators.required]],
			name: [this.data.item?.name, [Validators.required]],
			email: [this.data.item?.email, [Validators.required]],
			password: [this.data.item?.password, [Validators.required]],
			silconCode: [this.data.item?.silconCode, [Validators.required]],
			roleId: [this.data.item?.roleId, [Validators.required]],
			groups: [this.data.item?.groupsIds, [Validators.required]]
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
				
				let groups = form.groups.map((i: any) => {
					return {
						groupId: i
					}
				});

				form.groups = groups;
				let params = form;

				this.usersService.updateUser(params)
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
