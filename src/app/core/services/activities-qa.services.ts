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
export class ActivitiesQAService {

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
	
	
	/**
	 * Método que devuelve el listado.
	 * @param data Datos con el identificador.
	 * @returns Respuesta del proceso.
	 */
	getStagesQA(data: any = {}) {
		const url = this.env.urlIt + 'QAStages/getAll';
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
	createStageQA(data: any) {
		const url = this.env.urlIt + 'QAStages/create';
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
	updateStageQA(data: any) {
		const url = this.env.urlIt + 'QAStages/update';
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
	deleteStageQA(data: any) {
		const url = this.env.urlIt + 'QAStages/delete/' + data.id;
		const params = data;

		return this.httpClient.delete(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}


	/**
	 * Método que devuelve el listado.
	 * @param data Datos con el identificador.
	 * @returns Respuesta del proceso.
	 */
	getNamesOfCatLevels(data: any = {}) {
		const url = this.env.urlCa + 'tipoelemento/getNamesOrderedById';
		let params = '';

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve el listado.
	 * @param data Datos con el identificador.
	 * @returns Respuesta del proceso.
	 */
	getAxisNames(data: any = {}) {
		const url = this.env.urlCa + 'ejes/getNamesOrderedById';
		let params = '';

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve el listado.
	 * @param data Datos con el identificador.
	 * @returns Respuesta del proceso.
	 */
	getDomainValuesNames(data: any = {}) {
		const url = this.env.urlCa + 'valordominio/getNamesOfValoresDominio';
		let params = '';

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	

	


	/**
	 * Método que devuelve el listado.
	 * @param data Datos con el identificador.
	 * @returns Respuesta del proceso.
	 */
	 getActivitiesQA(data: any = {}) {
		const url = this.env.urlIt + 'QAactivities/getAll';
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
	createActivityQA(data: any) {
		const url = this.env.urlIt + 'QAactivities/create';
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
	updateActivityQA(data: any) {
		const url = this.env.urlIt + 'QAactivities/update';
		const params = data;

		return this.httpClient.put(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}
	
	/**
	 * Método que modifica.
	 * @param data Datos con la información para modificar.
	 * @returns Respuesta del proceso.
	 */
	updatePesosQA(data: any) {
		const url = this.env.urlIt + 'QAactivities/updateWeights';
		const params = data;

		return this.httpClient.put(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que modifica.
	 * @param data Datos con la información para modificar.
	 * @returns Respuesta del proceso.
	 */
	updateUmbralesQA(data: any) {
		const url = this.env.urlIt + 'QAactivities/updateThresholds';
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
	deleteActivityQA(data: any) {
		const url = this.env.urlIt + 'QAactivities/delete/' + data.id;
		const params = data;

		return this.httpClient.delete(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	
}