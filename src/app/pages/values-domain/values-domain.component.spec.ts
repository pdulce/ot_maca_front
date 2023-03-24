import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder }  from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeadersService } from 'src/app/core/headers/headers.service';
import { ValuesDomainComponent, ValuesDomainAddnewDialog, ValuesDomainEditDialog } from './values-domain.component';
import { AttributesService } from 'src/app/core/services/attributes.services';
import { UsersService } from 'src/app/core/services/users.services';

describe('ValuesDomainComponent', () => {
  let component: ValuesDomainComponent;
  let fixture: ComponentFixture<ValuesDomainComponent>;

  let componentAddnew: ValuesDomainAddnewDialog;
  let fixtureAddnew: ComponentFixture<ValuesDomainAddnewDialog>;
  
  let componentEdit: ValuesDomainEditDialog;
  let fixtureEdit: ComponentFixture<ValuesDomainEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValuesDomainComponent, ValuesDomainAddnewDialog, ValuesDomainEditDialog ],
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule ],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
        FormBuilder,
        AttributesService,
        UsersService,
        HeadersService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuesDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    fixtureAddnew = TestBed.createComponent(ValuesDomainAddnewDialog);
    componentAddnew = fixtureAddnew.componentInstance;
    componentAddnew.ngOnInit();

    fixtureEdit = TestBed.createComponent(ValuesDomainEditDialog);
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
