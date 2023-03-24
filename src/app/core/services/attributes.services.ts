import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { HeadersService } from '../headers/headers.service';

/**
 * Servicio para la gestión de los tipos de elementos, atributos y valores de dominio del catalogo.
 */
@Injectable()
export class AttributesService {

	/** Sujeto de la sesión. */
	private subjectSession = new Subject<any>();

	/** Entorno. */
	public env: any = environment;

	/** Ventana. */
	public window: any = window;

	/**
	 * Constructor de la clase.
	 * @param httpClient Cliente http.
	 * @param headersService Servicio de las cabeceras.
	 */
	constructor(
		private httpClient: HttpClient,
		private headersService: HeadersService
	) { }

	
	// Tipos de Elementos de catalogo

	/**
	 * Método que devuelve el listado.
	 * @param data Datos con el identificador.
	 * @returns Respuesta del proceso.
	 */
	 getElementTypes(data: any = {}) {
		const url = this.env.urlCa + 'tipoelemento/getAll';
		let params = '';

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que crea.
	 * @param data Datos con la información para crear.
	 * @returns Respuesta del proceso.
	 */
	createElementType(data: any) {
		const url = this.env.urlCa + 'tipoelemento/create';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que modifica.
	 * @param data Datos con la información para modificar.
	 * @returns Respuesta del proceso.
	 */
	updateElementType(data: any) {
		const url = this.env.urlCa + 'tipoelemento/update';
		const params = data;

		return this.httpClient.put(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que hace el borrado logico.
	 * @param data Datos con la información para borrar.
	 * @returns Respuesta del proceso.
	 */
	/*deleteElementType(data: any) {
		const url = this.env.urlCa + 'tipoelemento/delete/' + data.id;
		const params = data;

		return this.httpClient.delete(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}*/

	// Atributos

	/**
	 * Método que devuelve el listado.
	 * @param data Datos con el identificador.
	 * @returns Respuesta del proceso.
	 */
	getElementAttrs(ddata: any = {}) {
		const url = this.env.urlCa + 'atributoeje/getAll';
		let params = '';

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que crea.
	 * @param data Datos con la información para crear.
	 * @returns Respuesta del proceso.
	 */
	createElementAttr(data: any) {
		const url = this.env.urlCa + 'atributoeje/create';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que modifica.
	 * @param data Datos con la información para modificar.
	 * @returns Respuesta del proceso.
	 */
	updateElementAttr(data: any) {
		const url = this.env.urlCa + 'atributoeje/update';
		const params = data;

		return this.httpClient.put(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que hace el borrado logico.
	 * @param data Datos con la información para borrar.
	 * @returns Respuesta del proceso.
	 */
	deleteElementAttr(data: any) {
		const url = this.env.urlCa + 'atributoeje/delete/' + data.id;
		const params = data;

		return this.httpClient.delete(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	// Valores de Dominio

	/**
	 * Método que devuelve el listado.
	 * @param data Datos con el identificador.
	 * @returns Respuesta del proceso.
	 */
	getValuesAttributes(data: any = {}) {
		const url = this.env.urlCa + 'valordominio/getAll';
		let params = '';

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}


	/**
	 * Método que devuelve el listado de valores de dominio de un idAttr concreto
	 * @param data Datos con el identificador.
	 * @returns Respuesta del proceso.
	 */
	getValuesOfCollateralAttr(id: any) {			
		const url = this.env.urlCa + 'valordominio/getAllOfCollateralAttrId/';
		const params = id;

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}
	

	/**
	 * Método que crea.
	 * @param data Datos con la información para crear.
	 * @returns Respuesta del proceso.
	 */
	createValueAttribute(data: any) {
		const url = this.env.urlCa + 'valordominio/create';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que modifica.
	 * @param data Datos con la información para modificar.
	 * @returns Respuesta del proceso.
	 */
	updateValueAttribute(data: any) {
		const url = this.env.urlCa + 'valordominio/update';
		const params = data;

		return this.httpClient.put(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que hace el borrado logico.
	 * @param data Datos con la información para borrar.
	 * @returns Respuesta del proceso.
	 */
	deleteValueAttribute(data: any) {
		const url = this.env.urlCa + 'valordominio/delete/' + data.id;
		const params = data;

		return this.httpClient.delete(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}
}