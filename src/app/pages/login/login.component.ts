import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UsersService } from 'src/app/core/services/users.services';

declare var global: any;
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html'
})

export class LoginComponent {
	public actionForm: FormGroup;
	public submitLoading: boolean = false;
	public showPassword: boolean = false;
	public sessionData: any;

	constructor(
		private _fb: FormBuilder,
		private _snackBar: MatSnackBar,
		private router: Router,
		private usersService: UsersService
	) {
		this.sessionData = this.usersService.getLocalStorage()?.current;
		
		if (this.sessionData) {
			this.router.navigate(['home']);
		}

		// Form
		this.actionForm = this._fb.group({
			email: ['', [Validators.required]],
			password: ['', [Validators.required]]
		});
	}

	submit(ev: Event) {
		const form = this.actionForm.value;
		this.submitLoading = true;

		if (form.email.trim().length > 0 && form.password.trim().length > 0) {
			setTimeout(() => {
				let params = {
					name: form.email.trim(),
					password: form.password.trim()
				};

				this.usersService.login(params)
					.subscribe(
						res => {
							this.router.navigate(['home']);
						},
						error => {
							this.submitLoading = false;

							this._snackBar.open('Ha ocurrido un error, intentelo de nuevo', 'Cerrar', {
								horizontalPosition: 'center',
								verticalPosition: 'top',
								duration: 1200
							});
						}
					);
			}, 600);
		} else {
			this.submitLoading = false;

			this._snackBar.open('Rellena los campos', 'Cerrar', {
				horizontalPosition: 'center',
				verticalPosition: 'top',
				duration: 1200
			});
		}
	}
}
