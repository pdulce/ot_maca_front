import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsComponent, GroupsAddnewDialog, GroupsEditDialog } from './groups.component';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HeadersService } from 'src/app/core/headers/headers.service';

import { UsersService } from 'src/app/core/services/users.services';
import { CommonService } from 'src/app/core/services/common.service';
import { SystemGroupsService } from 'src/app/core/services/system-groups.service';
import { EnvironmentsService } from 'src/app/core/services/environments.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('GroupsComponent', () => {
  let component: GroupsComponent;
  let fixture: ComponentFixture<GroupsComponent>;

  let componentAddnew: GroupsAddnewDialog;
  let fixtureAddnew: ComponentFixture<GroupsAddnewDialog>;
  
  let componentEdit: GroupsEditDialog;
  let fixtureEdit: ComponentFixture<GroupsEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupsComponent, GroupsAddnewDialog, GroupsEditDialog ],
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule ],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
        FormBuilder,
        UsersService,
        UsersService,
        CommonService,
        SystemGroupsService,
        EnvironmentsService,
        RolesService,
        HeadersService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    fixtureAddnew = TestBed.createComponent(GroupsAddnewDialog);
    componentAddnew = fixtureAddnew.componentInstance;
    componentAddnew.ngOnInit();

    fixtureEdit = TestBed.createComponent(GroupsEditDialog);
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
