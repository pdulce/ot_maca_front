import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginComponent } from './login.component';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HeadersService } from 'src/app/core/headers/headers.service';

import { UsersService } from 'src/app/core/services/users.services';
import { ExceptionsService } from 'src/app/core/services/exceptions.service';
import { CommonService } from 'src/app/core/services/common.service';
import { SystemGroupsService } from 'src/app/core/services/system-groups.service';
import { ExecutionsService } from 'src/app/core/services/executions.service';
import { EnvironmentsService } from 'src/app/core/services/environments.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LoginComponent
      ],
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule ],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
        FormBuilder,
        UsersService,
        ExceptionsService,
        CommonService,
        SystemGroupsService,
        ExecutionsService,
        EnvironmentsService,
        HeadersService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create the Login', () => {
    expect(component).toBeTruthy();
  });
  it(`should have as title 'Login'`, () => {
    expect(component.title).toEqual('login');
  });
  it('validate pageParameters', () => {
    expect(component.pageParameters.pageStatus).toEqual('loading');
  });
  it('validate array statuses', () => {
    expect(component.env).toBeTruthy();
  });
});
