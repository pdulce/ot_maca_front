import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { HeadersService } from '../headers/headers.service';
import { UsersService } from 'src/app/core/services/users.services';

/**
 * Servicio para la gestión de los endpoints de los navegadores.
 */
@Injectable()
export class CatalogService {

	/** Entorno. */
	public env: any = environment;

	/**
	 * Constructor de la clase.
	 * @param httpClient Cliente http.
	 * @param headersService Servicio de las cabeceras.
	 */
	constructor(
		private httpClient: HttpClient,
		private headersService: HeadersService,
		private usersService: UsersService
	) { }

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	getAllPromotableItems(data: any = {}) {
		const id = this.usersService.getLocalStorage()?.current.user.id;
		const url = this.env.urlCa + 'elementocatalogo/getElementosPromo/' + id;

		let params 	  = (data.order 	? ('&order=' + data.order) : '') +
						(data.sort 		? ('&sort=' + data.sort) : '') +
						(data.startDate ? ('&startDate=' + data.startDate) : '') +
						(data.endDate 	? ('&endDate=' + data.endDate) : '') +
						(data.page	 	? ('&page=' + data.page) : '') +
						(data.pageSize 	? ('&pageSize=' + data.pageSize) : '');
		params = params ? params.replace('&', '?') : '';

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	getAllFunctionalGroupingItems(data: any = {}) {
		const id = this.usersService.getLocalStorage()?.current.user.id;
		const url = this.env.urlCa + 'elementocatalogo/getAgrupacionesFunc/' + id;

		let params 	  = (data.order 	? ('&order=' + data.order) : '') +
						(data.sort 		? ('&sort=' + data.sort) : '') +
						(data.startDate ? ('&startDate=' + data.startDate) : '') +
						(data.endDate 	? ('&endDate=' + data.endDate) : '') +
						(data.page	 	? ('&page=' + data.page) : '') +
						(data.pageSize 	? ('&pageSize=' + data.pageSize) : '');
		params = params ? params.replace('&', '?') : '';

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	getAplicaciones(data: any = {}) {
		const id = this.usersService.getLocalStorage()?.current.user.id;
		const url = this.env.urlCa + 'elementocatalogo/getAplicaciones/' + id;

		let params 	  = (data.order 	? ('&order=' + data.order) : '') +
						(data.sort 		? ('&sort=' + data.sort) : '') +
						(data.startDate ? ('&startDate=' + data.startDate) : '') +
						(data.endDate 	? ('&endDate=' + data.endDate) : '') +
						(data.page	 	? ('&page=' + data.page) : '') +
						(data.pageSize 	? ('&pageSize=' + data.pageSize) : '');
		params = params ? params.replace('&', '?') : '';

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	getAllProjectItems(data: any = {}) {
		const id = this.usersService.getLocalStorage()?.current.user.id;
		const url = this.env.urlCa + 'elementocatalogo/getProyectos/' + id;

		let params 	  = (data.order 	? ('&order=' + data.order) : '') +
						(data.sort 		? ('&sort=' + data.sort) : '') +
						(data.startDate ? ('&startDate=' + data.startDate) : '') +
						(data.endDate 	? ('&endDate=' + data.endDate) : '') +
						(data.page	 	? ('&page=' + data.page) : '') +
						(data.pageSize 	? ('&pageSize=' + data.pageSize) : '');
		params = params ? params.replace('&', '?') : '';

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	getTipoelemento(data: any = {}) {
		const id = this.usersService.getLocalStorage()?.current.user.id;
		const url = this.env.urlCa + 'tipoelemento/getAll/' + id;

		let params 	  = (data.order 	? ('&order=' + data.order) : '') +
						(data.sort 		? ('&sort=' + data.sort) : '') +
						(data.startDate ? ('&startDate=' + data.startDate) : '') +
						(data.endDate 	? ('&endDate=' + data.endDate) : '') +
						(data.page	 	? ('&page=' + data.page) : '') +
						(data.pageSize 	? ('&pageSize=' + data.pageSize) : '');
		params = params ? params.replace('&', '?') : '';

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	getElementosPromo(data: any = {}) {
		const id = this.usersService.getLocalStorage()?.current.user.id;
		const url = this.env.urlCa + 'elementocatalogo/getFreeElementsPromo/' + id;

		return this.httpClient.get(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	getFreeAplicaciones(data: any = {}) {
		const id = this.usersService.getLocalStorage()?.current.user.id;
		const url = this.env.urlCa + 'elementocatalogo/getFreeAplicaciones/' + id;

		return this.httpClient.get(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	getElementById(data: any) {		
		const url = this.env.urlCa + 'elementocatalogo/getById/' + data;

		return this.httpClient.get(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	getFreeElementsPromoAndAgrup(data: any = {}) {
		const id = this.usersService.getLocalStorage()?.current.user.id;
		const url = this.env.urlCa + 'elementocatalogo/getFreeElementsPromoAndAgrup/' + id;

		return this.httpClient.get(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	getFreeAgrupAndAplicaciones(data: any = {}) {
		const id = this.usersService.getLocalStorage()?.current.user.id;
		const url = this.env.urlCa + 'elementocatalogo/getFreeAplicOAgrupFunc/' + id;

		return this.httpClient.get(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	getAllDeliveries(data: any = {}) {
		const id = this.usersService.getLocalStorage()?.current.user.id;
		const url = this.env.urlCa + 'entrega/getAll/' + id;
		const params = data;

		return this.httpClient.get(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve el detalle de un navegador.
	 * @param data Datos con el identificador del navegador.
	 * @returns Respuesta del proceso.
	 */
	getItem(data: any) {
		const url = this.env.urlCa + 'elementocatalogo/getById/' + data.id;
		let params = '';

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que crea un navegador.
	 * @param data Datos con la información para crear un navegador.
	 * @returns Respuesta del proceso.
	 */
	createItem(data: any) {
		const url = this.env.urlCa + 'elementocatalogo/create';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que modifica un navegador.
	 * @param data Datos con la información para modificar el navegador.
	 * @returns Respuesta del proceso.
	 */
	 updateItem(data: any) {
		const url = this.env.urlCa + 'elementocatalogo/update';
		const params = data;

		return this.httpClient.put(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que modifica un navegador.
	 * @param data Datos con la información para modificar el navegador.
	 * @returns Respuesta del proceso.
	 */
	deleteItem(data: any) {
		const url = this.env.urlCa + 'elementocatalogo/delete/' + data.id;
		const params = data;

		return this.httpClient.delete(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que crea un navegador.
	 * @param data Datos con la información para crear un navegador.
	 * @returns Respuesta del proceso.
	 */
	 createDelivery(data: any) {
		const url = this.env.urlCa + 'entrega/create';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que crea un navegador.
	 * @param data Datos con la información para crear un navegador.
	 * @returns Respuesta del proceso.
	 */
	 updateDelivery(data: any) {
		const url = this.env.urlCa + 'entrega/update';
		const params = data;

		return this.httpClient.put(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que modifica un navegador.
	 * @param data Datos con la información para modificar el navegador.
	 * @returns Respuesta del proceso.
	 */
	deleteDelivery(data: any) {
		const url = this.env.urlCa + 'entrega/delete/' + data.id;
		const params = data;

		return this.httpClient.delete(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	getAxisAtribute(data: any = {}) {
		const url = this.env.urlCa + 'atributoeje/getByTypeOfIdElementOfcatalogue/' + (data ? data.id : 1);

		return this.httpClient.get(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	elementocatalogoGetById(data: any = {}) {
		const url = this.env.urlCa + 'elementocatalogo/getById/' + (data ? data.id : 1);

		return this.httpClient.get(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	getByTypeOfIdElementAndDelivery(data: any = {}) {
		const url = this.env.urlCa + 'atributoeje/getByIdElementAndDelivery/' + (data ? data.id : 1);

		return this.httpClient.get(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	 getAllByIdOfElement(data: any = {}) {
		const url = this.env.urlCa + 'entrega/getAllByIdOfElement/' + data.id;

		return this.httpClient.get(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	getTipoElementoGetAll(data: any = {}) {
		const url = this.env.urlCa + 'tipoelemento/getAll';

		return this.httpClient.get(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	getAtributoEjeTratamientoInformatico(data: any = {}) {
		const url = this.env.urlCa + 'atributoeje/getById/40';

		return this.httpClient.get(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	getAtributoEjeGrupo(data: any = {}) {
		const url = this.env.urlCa + 'atributoeje/getById/41';

		return this.httpClient.get(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve un listado de navegadores filtrado, ordenado y paginado.
	 * @param data Datos con los filtros, paginación y ordenación.
	 * @returns Respuesta del proceso.
	 */
	getAtributoEjeSituacion(data: any = {}) {
		const url = this.env.urlCa + 'atributoeje/getById/55';

		return this.httpClient.get(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que busca.
	 * @param data Datos con la información.
	 * @returns Respuesta del proceso.
	 */
	getElementocatalogoSearch(data: any) {
		const url = this.env.urlCa + 'elementocatalogo/search';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}
}