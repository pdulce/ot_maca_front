import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { HeadersService } from '../headers/headers.service';

/**
 * Servicio para la gestión de los endpoints de los navegadores.
 */
@Injectable()
export class ItineraryService {

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
	 * Método que crea un navegador.
	 * @param data Datos con la información para crear un navegador.
	 * @returns Respuesta del proceso.
	 */
	 calculateItinerary(data: any) {
		const url = this.env.urlIt + 'calculateItinerary';
		const params = data;

		return this.httpClient.post(url, params, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}
}