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
	selector: 'app-groups',
	templateUrl: './groups.component.html'
})
export class GroupsComponent implements OnInit, AfterViewInit {
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
		// void
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
				this.usersService.getGroups(params)
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
		const dialogRef = this.dialog.open(GroupsAddnewDialog, {
			data: {
				name: 'new',
				sessionData: this.sessionData
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
			const dialogRef = this.dialog.open(GroupsEditDialog, {
				data: {
					name: 'edit',
					sessionData: this.sessionData,
					item: item
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

			this.usersService.deleteGroup(item)
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
 * Componente de añadir uno nuevo.
 */
@Component({
	selector: 'groups.addnew',
	templateUrl: 'groups.addnew.html',
})
export class GroupsAddnewDialog implements OnInit {

	/** Objeto formulario. */
	public actionForm: any;

	/** Indica si el formulario se ha enviado. */
	public submitLoading: boolean = false;

	/**
	 * Constructor de la clase.
	 * @param dialogRef Objeto dialog.
	 * @param data Datos.
	 * @param _fb Objeto Formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param usersService Servicio de usuarios.
	 */
	constructor(
		public dialogRef: MatDialogRef<GroupsAddnewDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private usersService: UsersService
	) { }

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			name: ['', [Validators.required]]
		});
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

				this.usersService.createGroup(params)
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
	selector: 'groups.edit',
	templateUrl: 'groups.edit.html',
})
export class GroupsEditDialog implements OnInit {

	/** Objeto formulario. */
	public actionForm: any;

	/** Indica si el formulario se ha enviado. */
	public submitLoading: boolean = false;

	/**
	 * Constructor de la clase.
	 * @param dialogRef Objeto dialog.
	 * @param data Datos.
	 * @param _fb Objeto Formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param usersService Servicio de usuarios.
	 */
	constructor(
		public dialogRef: MatDialogRef<GroupsEditDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private usersService: UsersService,
	) { }

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

				this.usersService.updateGroup(params)
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
