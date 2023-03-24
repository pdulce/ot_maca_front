import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { UsersService } from 'src/app/core/services/users.services';
import { HierarchyService } from 'src/app/core/services/hierarchy.service';

/**
 * Componente.
 */
@Component({
	selector: 'app-hierarchy',
	templateUrl: './hierarchy.component.html'
})

export class HierarchyComponent implements OnInit, AfterViewInit {
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
	 * @param HierarchyService Servicio de jerarquía.
	 * @param commonService Servicio de endpoints genéricos.
	 */
	constructor(
		public dialog: MatDialog,
		private _snackBar: MatSnackBar,
		private usersService: UsersService,
		private hierarchyService: HierarchyService,
		private route: ActivatedRoute,
		public sanitizer: DomSanitizer
	) {}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		let data: any = this.window.localStorage.getItem('hierarchy');

		if (!data) {
			this._snackBar.open('La pantalla no dispone de suficiente informacion para generar la jerarquía asociada a este elemento', 'Cerrar', {
				horizontalPosition: 'center',
				verticalPosition: 'top',
				duration: 3000
			});

			this.pageParameters.pageStatus = 'void';
		} else {
			data = JSON.parse(data);

			this.pageParameters.queryData = data;

			let params = {
				name: data.item.name,
				creationDate: data.item.creationDate,
				id: data.item.id,
				catalogElementTypeId: data.item.catalogElementTypeId,
				delivery: 0,
				attributeValuesCollection: data.item.attributeValuesCollection,
				urlCat: this.hierarchyService.env.urlCa
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
			
			console.log("params.urlCat: " + params.urlCat);			
			//console.log("params.creationDate: " + params.creationDate);
			//console.log("params.name: " + params.name);
			//console.log("params.attributeValuesCollection.item: " + params.attributeValuesCollection.item);

			this.pageParameters.pageStatus = 'data';
			this.pageParameters.queryData.item.creationDate = params.creationDate;
			//console.log("params: " + params);
			//console.log("this.pageParameters.queryData.item.creationDate: " + this.pageParameters.queryData.item.creationDate);
			let arr: any = [];
			
			//console.log("params.id: " + params.id);
			this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/static/tree.html?id=' + params.id + '&urlCat=' + params.urlCat);
						
		}
	}
}