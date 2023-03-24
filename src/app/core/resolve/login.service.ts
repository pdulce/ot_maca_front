import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.services';

/**
 * Servicio para el login.
 */
@Injectable()
export class LoginResolver implements Resolve<any> {

	/**
	 * Constructor de la clase.
	 * @param UsersService Servicio de usuarios.
	 */
	constructor(
		public usersService: UsersService
	) {}

	/**
	 * Método que devuelve la sesión.
	 * @returns Observable con la sesión.
	 */
	resolve(): Observable<any> {
		const sessionData = this.usersService.getSessionData();
		const result: any = sessionData ? false : true;

		return result;
	}
}