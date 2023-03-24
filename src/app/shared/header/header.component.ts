import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

import { UsersService } from 'src/app/core/services/users.services';

/**
 * Componente de la cabecera.
 */
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
	title = 'header';

	/** Entorno. */
	public env: any = environment;

	/** Sesión. */
	public sessionData: any;

	/** Indica si el menú está abierto. */
	public menu: boolean = false;

	/** Indica si el navegador está activo. */
	public nav: boolean = false;

	/** Indica si el usuario tiene acceso al meni. */
	public menuAccess: any = [];

	/** Sesión activa. */
	public activeSession: any;

	constructor(
		private router: Router,
		private usersService: UsersService
	) {
		this.activeSession = this.usersService.getSession()
			.subscribe(data => {
				this.sessionData = data?.current;
				this.menuAccess = this.sessionData?.menuAccess;
			});
	}

	/**
	 * Método que se lanza cuando se completa la creación del componente.
	 */
	ngOnInit() {
		this.sessionData = this.usersService.getLocalStorage()?.current;
		this.menuAccess = this.sessionData.menuAccess;

		if (!this.sessionData) {
			this.router.navigate(['login']);
		}
	}

	/**
	 * Método que se ejecuta al destruir un componente.
	 */
	ngOnDestroy() {
		this.activeSession.unsubscribe();
	}

	/**
	 * Método que abre el menú.
	 */
	openMenu() {
		if (this.menu) {
			this.nav = false;

			setTimeout(() => {
				this.menu = false;
			}, 100);
		} else {
			this.menu = true;

			setTimeout(() => {
				this.nav = true;
			}, 100);
		}
	}

	/**
	 * Método que hace el logout.
	 */
	logout() {
		this.menu = false;
		this.usersService.logout();
		this.router.navigate(['login']);
	}
}
