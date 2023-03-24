import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { HeadersService } from '../headers/headers.service';

/**
 * Servicio para la gestión de los endpoints de los navegadores.
 */
@Injectable()
export class HierarchyService {

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
	
}