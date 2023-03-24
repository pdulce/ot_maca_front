import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UsersService } from '../services/users.services';

/**
 * Servicio para la sesión.
 */
@Injectable()
export class SessionResolver implements Resolve<any> {

	/**
	 * Constructor de la clase.
	 * @param UsersService Servicio de usuarios.
	 */
	constructor(
		private usersService: UsersService
	) {}

	/**
	 * Método que devuelve la sesión del usuario logado.
	 * @returns Sesión del usuario logado.
	 */
	resolve() {
		return this.usersService.getSessionData();
	}
}