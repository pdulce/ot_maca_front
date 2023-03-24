import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { HeadersService } from '../headers/headers.service';

/**
 * Servicio para la gestión de los endpoints de los usuarios.
 */
@Injectable()
export class UsersService {

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
	 * Método que loga al usuario.
	 * @returns Respuesta del proceso.
	 */
	login(data: any) {
		const url = this.env.urlCa + 'usuario/login';

		return this.httpClient.post(url, data, this.headersService.getHeaders())
			.pipe(map(res => {
				this.setSessionData(res);
				return res;
			}));
	}

	/**
	 * Método que hace el logout del usuario.
	 */
	logout() {
		this.window.localStorage.removeItem('userData');
	}

	/**
	 * Método que añade al local storage los datos de login.
	 * @param name Nombre.
	 * @param data Datos.
	 */
	setLocalStorage(name: any, data: any) {
		this.window.localStorage.setItem(name, JSON.stringify(data));
	}

	/**
	 * Método que devuelve los datos de login almacenados en el local storage.
	 * @param name Nombre.
	 * @returns Datos.
	 */
	getLocalStorage(name: any = 'userData') {
		if (this.window.localStorage) {
			const data = this.window.localStorage.getItem(name);
			return JSON.parse(data);
		} else {
			return null;
		}
	}

	/**
	 * Método que setea la sesión.
	 * @param data Datos.
	 */
	setSessionData(data: any) {
		let menuAccess: any = [];
		/* for (const i of data.role.roleActions) {
			menuAccess.push(i.name);
		} */
		let dataSession = { user: data, menuAccess: menuAccess };

		const storageLoginData: any = {
			name: 'O',
			current: dataSession,
			sessions: []
		};

		storageLoginData.sessions.push(dataSession);

		this.window.localStorage.setItem('userData', JSON.stringify(storageLoginData));
		this.setSession(storageLoginData);
	}

	/**
	 * Método que devuelve los datos de sesión.
	 * @returns Datos de sesión.
	 */
	getSessionData() {
		const data = this.window.localStorage.getItem('userData');
		return JSON.parse(data);
	}

	/**
	 * Método que setea la sesión.
	 * @param data Datos.
	 */
	setSession(data: any) {
		this.subjectSession.next(data);
	}

	/**
	 * Método que devuelve la sesión.
	 * @returns Sesión.
	 */
	getSession(): Observable<any> {
		return this.subjectSession.asObservable();
	}

	
	// USERS

	/**
	 * Método que devuelve el listado.
	 * @param data Datos con el identificador.
	 * @returns Respuesta del proceso.
	 */
	 getUsers(data: any) {
		const url = this.env.urlCa + 'usuario/getAll';
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
	createUser(data: any) {
		const url = this.env.urlCa + 'usuario/create';
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
	updateUser(data: any) {
		const url = this.env.urlCa + 'usuario/update';
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
	deleteUser(data: any) {
		const url = this.env.urlCa + 'usuario/delete/' + data.id;
		const params = data;

		return this.httpClient.delete(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	// GROUPS

	/**
	 * Método que devuelve el listado.
	 * @param data Datos con el identificador.
	 * @returns Respuesta del proceso.
	 */
	getGroups(data: any = {}) {
		const url = this.env.urlCa + 'grupos/getAll';
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
	createGroup(data: any) {
		const url = this.env.urlCa + 'grupos/create';
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
	updateGroup(data: any) {
		const url = this.env.urlCa + 'grupos/update';
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
	deleteGroup(data: any) {
		const url = this.env.urlCa + 'grupos/delete/' + data.id;
		const params = data;

		return this.httpClient.delete(url, this.headersService.getHeaders())
			.pipe(map(res => {
				return res;
			}));
	}

	// ROLES

	/**
	 * Método que devuelve el listado.
	 * @param data Datos con el identificador.
	 * @returns Respuesta del proceso.
	 */
	getRoles(data: any = {}) {
		const url = this.env.urlCa + 'roles/getAll';
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
	 getRolePrivileges(data: any = {}) {
		const url = this.env.urlCa + 'roles/getAllPrivileges';
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
	createRole(data: any) {
		const url = this.env.urlCa + 'roles/create';
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
	updateRole(data: any) {
		const url = this.env.urlCa + 'roles/update';
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
	deleteRole(data: any) {
		const url = this.env.urlCa + 'roles/delete/' + data.id;
		const params = data;
		//try{
			return this.httpClient.delete(url, this.headersService.getHeaders())
				.pipe(map(res => {
					return res;
				}));
			//} catch (error) {
				//	console.log("Error ");// + error);
				//throw error;
				//}
	}
}