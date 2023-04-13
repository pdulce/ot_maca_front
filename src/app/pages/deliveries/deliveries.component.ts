import { AfterViewInit, Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatAccordion } from '@angular/material/expansion';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { ActivatedRoute, Router } from '@angular/router';

import { UsersService } from 'src/app/core/services/users.services';
import { CatalogService } from 'src/app/core/services/catalog.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ItineraryService } from 'src/app/core/services/itinerary.service';

/**
 * Componente.
 */
@Component({
	selector: 'app-deliveries',
	templateUrl: './deliveries.component.html'
})
export class DeliveriesComponent implements OnInit, AfterViewInit {
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
		'creationDate'
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
		private router: Router,
		private route: ActivatedRoute,
		private usersService: UsersService,
		private catalogService: CatalogService,
		private itineraryService: ItineraryService,
		private commonService: CommonService,
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

		// load page data
		this.filter('apply', this.pageParameters);

		// Selects
		this.selects();
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
		// not in use
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
			params.startDate = form.startDate ? new Date(form.startDate) : null;
			params.endDate = form.endDate ? new Date(form.endDate) : null;

			setTimeout(() => {
				this.catalogService.getAllDeliveries(params)
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
			
			if (type === 'itinerary') {
				let data = {
					comeFrom: 'deliveries',
					item: item,
					page: type,
					type: 1
				};
				let dataParam = {
					data: JSON.stringify(data)
				};

				this.router.navigate(['itinerary', dataParam]);
			}
		}
	}

	getSelectedElementFormTable(el: any) {
		this.dataSource.data.map((x: any) => el.id === x.id ? x.checked = true : x.checked = false);
	}
}
