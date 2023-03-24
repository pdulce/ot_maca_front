import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { environment } from '../../../environments/environment';

/**
 * Servicio de la cabecera.
 */
@Injectable()
export class HeadersService {

	/** Sujeto de la ventana. */
	public window: any = window;

	/** Entorno. */
	public env: any = environment;

	/**
	 * Constructor.
	 */
	constructor() {}

	/**
	 * Método que genera las cabeceras.
	 */
	getHeaders() {
		/* const httpOptions = {
			headers: new HttpHeaders({
				'Access-Control-Allow-Credentials': 'true',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT',
				'Access-Control-Allow-Headers': 'Content-Type'
			}),
			withCredentials: false
		}; */

		const httpOptions = {
			headers: new HttpHeaders()
		};

		return httpOptions;
	}
}