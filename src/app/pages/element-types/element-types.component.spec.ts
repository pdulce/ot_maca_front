import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElemenTypesComponent, ElemenTypesAddnewDialog, ElemenTypesEditDialog } from './element-types.component';

import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { FormBuilder } from '@angular/forms';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HeadersService } from 'src/app/core/headers/headers.service';

import { UsersService } from 'src/app/core/services/users.services';
import { AttributesService } from 'src/app/core/services/attributes.service';
import { CommonService } from 'src/app/core/services/common.service';
import { SystemGroupsService } from 'src/app/core/services/system-groups.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ElemenTypesComponent', () => {
  let component: ElemenTypesComponent;
  let fixture: ComponentFixture<ElemenTypesComponent>;

  let componentAddnew: ElemenTypesAddnewDialog;
  let fixtureAddnew: ComponentFixture<ElemenTypesAddnewDialog>;
  
  let componentEdit:ElemenTypesEditDialog;
  let fixtureEdit: ComponentFixture<ElemenTypesEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElemenTypesComponent, ElemenTypesAddnewDialog, ElemenTypesEditDialog ],
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule ],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
        FormBuilder,
        UsersService,
        AttributesService,
        CommonService,
        SystemGroupsService,
        HeadersService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElemenTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    fixtureAddnew = TestBed.createComponent(ElemenTypesAddnewDialog);
    componentAddnew = fixtureAddnew.componentInstance;
    componentAddnew.ngOnInit();

    fixtureEdit = TestBed.createComponent(ElemenTypesEditDialog);
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
