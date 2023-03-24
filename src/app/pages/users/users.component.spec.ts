import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent, UsersAddnewDialog, UsersEditDialog } from './users.component';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeadersService } from 'src/app/core/headers/headers.service';

import { UsersService } from 'src/app/core/services/users.services';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  let componentAddnew: UsersAddnewDialog;
  let fixtureAddnew: ComponentFixture<UsersAddnewDialog>;
  
  let componentEdit: UsersEditDialog;
  let fixtureEdit: ComponentFixture<UsersEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersComponent, UsersAddnewDialog, UsersEditDialog ],
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule ],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
        FormBuilder,
        UsersService,
        UsersService,
        HeadersService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    fixtureAddnew = TestBed.createComponent(UsersAddnewDialog);
    componentAddnew = fixtureAddnew.componentInstance;
    componentAddnew.ngOnInit();

    fixtureEdit = TestBed.createComponent(UsersEditDialog);
    componentEdit = fixtureEdit.componentInstance;
    componentEdit.ngOnInit();
  });

  it('validate form', () => {
    expect(component.actionForm.valid).toBeFalsy();
  });

  it('validate form addnew', () => {
    expect(componentAddnew.actionForm.valid).toBeFalsy();
  });

  it('validate form edit', () => {
    expect(componentEdit.actionForm.valid).toBeFalsy();
  });
});
