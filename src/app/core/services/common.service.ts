import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { HeadersService } from '../headers/headers.service';

/**
 * Servicio para la gestión de los endpoints genéricos.
 */
@Injectable()
export class CommonService {

	/** Entorno. */
	public env: any = environment;

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
	 * Método que devuelve el listado de estados.
	 * @param data Datos vacíos.
	 * @returns Respuesta del proceso.
	 */
	getStatuses(data: any = {}) {
		const url = this.env.urlCa + 'common/statuses';
		let params = '';

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve el listado de ejecutores.
	 * @param data Datos vacíos.
	 * @returns Respuesta del proceso.
	 */
	getEngines(data: any = {}) {
		const url = this.env.urlCa + 'common/engines';
		let params = '';

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve el listado de pantallas.
	 * @param data Datos vacíos.
	 * @returns Respuesta del proceso.
	 */
	getScreens(data: any = {}) {
		const url = this.env.urlCa + 'common/screens';
		let params = '';

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve el listado de tipos de gráficos.
	 * @param data Datos vacíos.
	 * @returns Respuesta del proceso.
	 */
	getChartTypes(data: any = {}) {
		const url = this.env.urlCa + 'common/charttypes';
		let params = '';

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve el listado de tipos de dashboards.
	 * @param data Datos vacíos.
	 * @returns Respuesta del proceso.
	 */
	getDashboardTypes(data: any = {}) {
		const url = this.env.urlCa + 'common/dashboardtypes';
		let params = '';

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	/**
	 * Método que devuelve el listado de rangos de fechas.
	 * @param data Datos vacíos.
	 * @returns Respuesta del proceso.
	 */
	getDateRanges(data: any = {}) {
		const url = this.env.urlCa + 'common/dateranges';
		let params = '';

		return this.httpClient.get(url + params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}
}