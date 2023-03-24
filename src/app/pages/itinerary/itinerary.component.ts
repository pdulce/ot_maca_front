import { AfterViewInit, Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { UsersService } from 'src/app/core/services/users.services';
import { CatalogService } from 'src/app/core/services/catalog.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ItineraryService } from 'src/app/core/services/itinerary.service';

/**
 * Componente.
 */
@Component({
	selector: 'app-itinerary',
	templateUrl: './itinerary.component.html'
})
export class ItineraryComponent implements OnInit, AfterViewInit {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatAccordion) accordion!: MatAccordion;

	/** Sesión. */
	public sessionData: any;

	/** Objeto formulario. */
	public actionForm: any;

	/** Objeto tabla. */
	public dataSource = new MatTableDataSource<any>();

	/** Listado de columnas. updated */
	public displayedColumns: string[] = [
		'stage',
		'activity',
		'realization'
	];

	/** Listado de parámetros del paginador. */
	public pageParameters: any = {
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
		filterOpenState: false,
		queryData: null,
		queryParams: null
	};

	public iframeUrl: any;

	/** Listado de axisAtributes. */
	public axisAtributes: any = [];

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
		private itineraryService: ItineraryService,
		private commonService: CommonService,
		private route: ActivatedRoute,
		public sanitizer: DomSanitizer
	) {}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		let data: any = this.window.localStorage.getItem('itinerary');

		if (!data) {
			this._snackBar.open('La pantalla no dispone de suficiente informacion para calcular el itinerario', 'Cerrar', {
				horizontalPosition: 'center',
				verticalPosition: 'top',
				duration: 3000
			});

			this.pageParameters.pageStatus = 'void';
		} else {
			data = JSON.parse(data);

			this.pageParameters.queryData = data;

			let params = {
				id: data.item.id,
				catalogElementTypeId: data.item.catalogElementTypeId,
				delivery: (data.comeFrom === 'deliveries' ? 1 : 0),
				attributeValuesCollection: data.item.attributeValuesCollection,
				urlIt: this.itineraryService.env.urlIt
			};

			this.pageParameters.queryParams = params;

			// Session
			this.sessionData = this.usersService.getLocalStorage()?.current;

			// load page data
			this.filter('apply', this.pageParameters);
		}
	}

	/**
	 * Método que se ejecuta después de que la template de un componente se haya inicializado.
	 */
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
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

			let params = this.pageParameters.queryParams;

			//console.log("params.urlIt: " + params.urlIt);

			setTimeout(() => {
				this.itineraryService.calculateItinerary(params)
					.subscribe(
						(res: any) => {
							this.pageParameters.filterLoading = false;

							if (res) {
								this.pageParameters.pageStatus = 'data';
								this.pageParameters.queryData.item.creationDate = res.creationDate;
								let arr: any = [];

								this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/static/prettyItinerario.html?id=' + res.id + '&urlIti=' + params.urlIt);								

								if (res.stages.length) {
									for (const x of res.stages) {
										x.activities.map((i: any) => i.stage = x.stage);
										arr = arr.concat(x.activities);
									}

									this.dataSource.data = arr;
								} else {
									this.pageParameters.pageStatus = 'void';

									this._snackBar.open('No existen pesos definidos', 'Cerrar', {
										horizontalPosition: 'center',
										verticalPosition: 'top',
										duration: 3000
									});
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
	addNew(item: any) {
		const dialogRef = this.dialog.open(ItineraryAddnewDialog, {
			data: {
				name: 'new',
				sessionData: this.sessionData,
				selects: {
					item: item
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
			const dialogRef = this.dialog.open(ItineraryEditDialog, {
				data: {
					name: 'edit',
					sessionData: this.sessionData,
					item: item,
					selects: {
						statuses: this.axisAtributes
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

			this.catalogService.updateItem(item)
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
	selector: 'itinerary.addnew',
	templateUrl: 'itinerary.addnew.html',
})
export class ItineraryAddnewDialog implements OnInit, AfterViewInit {
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
		public dialogRef: MatDialogRef<ItineraryAddnewDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private catalogService: CatalogService,
	) {
		let axisAtributes = this.data.selects ? this.data.selects.axisAtributes : [];
		this.dataSource.data = axisAtributes;
	}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			name: ['', [Validators.required]],
			cappCode: ['', [Validators.required]]
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

				if (form.cappCode.length !== 4) {
					this._snackBar.open('El Código CAPP tiene que tener exactamente 4 caracteres alfanuméricos', 'Cerrar', {
						horizontalPosition: 'center',
						verticalPosition: 'top',
						duration: 3000
					});

					keepGoing = false;
				} else {
					for (let item of table) {
						if (item.mandatory && !item.valueSelect && !item.value) {
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

						const a: any = {
							axisAttributeId: item.id,
							domainValueId: item.valuesInDomain ? item.valueSelect : null,
							userValue: !item.valuesInDomain ? item.value : null
						};

						array.push(a);
					}
				}

				if (keepGoing) {
					this.submitLoading = true;

					let params = {
						name: form.name,
						cappCode: form.cappCode,
						catalogElementTypeId: 1,
						attributeValuesCollection: array
					};

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
 * Componente de editar.
 */
@Component({
	selector: 'itinerary.edit',
	templateUrl: 'itinerary.edit.html'
})
export class ItineraryEditDialog implements OnInit{

	/** Objeto formulario. */
	public actionForm: any;

	/** Indica si el formulario se ha enviado. */
	public submitLoading: boolean = false;

	/** Listado de estados. */
	public statuses: Array<any> = [];

	/**
	 * Constructor de la clase.
	 * @param dialogRef Objeto dialog.
	 * @param data Datos.
	 * @param _fb Objeto Formulario.
	 * @param _snackBar Objeto de mensajes.
	 * @param CatalogService Servicio de catalogos.
	 */
	constructor(
		public dialogRef: MatDialogRef<ItineraryEditDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private catalogService: CatalogService,
	) {
		this.statuses = this.data.selects ? this.data.selects.statuses : [];
	}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			id: [this.data.item?.id, [Validators.required]],
			name: [this.data.item?.name, [Validators.required]],
			statusId: [this.data.item?.status?.id, [Validators.required]]
		});
	}

	/**
	 * Método que envia el formulario.
	 * @param type Tipo de botón clicado.
	 */
	submit(type: any) {
		if (type === 'save') {
			if (this.actionForm.valid) {
				const form = this.actionForm.value;
				this.submitLoading = true;

				form.status = { id: form.statusId };
				let params = form;

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

							this._snackBar.open('Ha ocurrido un error, intentelo de nuevo', 'Cerrar', {
								horizontalPosition: 'center',
								verticalPosition: 'top',
								duration: 3000
							});
						}
					);
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
