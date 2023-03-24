import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from 'src/environments/environment';
import { PromotableItemAddnewDialog } from '../promotable-item/promotable-item.component';
import { CatalogService } from 'src/app/core/services/catalog.service';

/**
 * Componente de la home.
 */
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, AfterViewInit {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild(MatAccordion) accordion!: MatAccordion;

	/** Titulo. */
	title = 'home';

	/** Entorno. */
	public env: any = environment;

	/** Sesión. */
	public sessionData: any;

	/** Listado de statuses. */
	public catalogueElementTypes: any = [];
	public computerProcessings: any = [];
	public groups: any = [];
	public situations: any = [];

	/** Objeto formulario. */
	public actionForm: any;

	/** Objeto tabla. */
	public dataSource = new MatTableDataSource<any>();

	/** Listado de columnas. */
	public displayedColumns: string[] = [
		'catalogueElementTypeName',
		'preffix',
		'name',
		'code',
		'responsible',
		'serviceName',
		'functionalAreaName',
		'computerProcessing',
		'group',
		'situation'
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

	constructor(
		public dialog: MatDialog,
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private catalogService: CatalogService,
	) {}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		// Form
		this.actionForm = this._fb.group({
			idOfCatalogueElementType: [''],
			preffix: [''],
			name: [''],
			code: [''],
			responsible: [''],
			serviceName: [''],
			functionalAreaName: [''],
			computerProcessingId: [''],
			groupId: [''],
			situationId: ['']
		});

		// get relational data
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
		this.catalogService.getTipoElementoGetAll()
			.subscribe((res: any) => {
				this.catalogueElementTypes = res;
			});

		this.catalogService.getAtributoEjeTratamientoInformatico()
			.subscribe((res: any) => {
				this.computerProcessings = res ? res.domainValues : [];
			});

		this.catalogService.getAtributoEjeGrupo()
			.subscribe((res: any) => {
				this.groups = res ? res.domainValues : [];
			});

		this.catalogService.getAtributoEjeSituacion()
			.subscribe((res: any) => {
				this.situations = res ? res.domainValues : [];
			});
	}

	/**
	 * Método buscador
	 */
	search() {
		const params = this.actionForm.value;

		this.catalogService.getElementocatalogoSearch(params)
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
	}

	addNew(type: any){}
}