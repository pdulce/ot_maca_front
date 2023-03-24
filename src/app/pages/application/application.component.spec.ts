import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationComponent, ApplicationAddnewDialog, ApplicationEditDialog } from './application.component';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HeadersService } from 'src/app/core/headers/headers.service';

import { UsersService } from 'src/app/core/services/users.services';
import { CatalogService } from 'src/app/core/services/catalog.service';
import { CommonService } from 'src/app/core/services/common.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ApplicationComponent', () => {
  let component: ApplicationComponent;
  let fixture: ComponentFixture<ApplicationComponent>;

  let componentAddnew: ApplicationAddnewDialog;
  let fixtureAddnew: ComponentFixture<ApplicationAddnewDialog>;
  
  let componentEdit: ApplicationEditDialog;
  let fixtureEdit: ComponentFixture<ApplicationEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationComponent, ApplicationAddnewDialog, ApplicationEditDialog ],
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule ],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
        FormBuilder,
        UsersService,
        CatalogService,
        CommonService,
        HeadersService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
    component.ngAfterViewInit();
    component.selects();
    component.filter('e', {});
    //component.addNew();
    //component.itemActions('e', {});

    fixtureAddnew = TestBed.createComponent(ApplicationAddnewDialog);
    componentAddnew = fixtureAddnew.componentInstance;
    componentAddnew.ngOnInit();
    //componentAddnew.submit('e');

    fixtureEdit = TestBed.createComponent(ApplicationEditDialog);
    componentEdit = fixtureEdit.componentInstance;
    componentEdit.ngOnInit();
    //componentEdit.submit('e');
  });

  // main component
  it('validate form', () => {
    expect(component.actionForm.valid).toBeFalsy();
  });
  it('validate form', () => {
    expect(component.actionForm.invalid).toBeTruthy();
  });
  it('validate sessionData', () => {
    expect(component.sessionData).toBeFalsy();
  });
  it('validate dataSource', () => {
    expect(component.dataSource.data).toBeTruthy();
  });
  it('validate displayedColumns', () => {
    expect(component.displayedColumns.values).toBeTruthy();
  });
  it('validate pageParameters', () => {
    expect(component.pageParameters.page).toEqual(1);
  });

  // addnew component
  it('validate form addnew', () => {
    expect(componentAddnew.actionForm.valid).toBeFalsy();
  });
  it('validate submitLoading', () => {
    expect(componentAddnew.submitLoading).toEqual(false);
  });

  // edit component
  it('validate form edit', () => {
    expect(componentEdit.actionForm.valid).toBeFalsy();
  });
  it('validate submitLoading', () => {
    expect(componentEdit.submitLoading).toEqual(false);
  });
});
