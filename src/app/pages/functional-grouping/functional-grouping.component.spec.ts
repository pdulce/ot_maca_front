import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionalGroupingComponent, FunctionalGroupingAddnewDialog, FunctionalGroupingEditDialog } from './functional-grouping.component';

import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { FormBuilder } from '@angular/forms';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HeadersService } from 'src/app/core/headers/headers.service';

import { UsersService } from 'src/app/core/services/users.services';
import { CatalogService } from 'src/app/core/services/catalog.service';
import { CommonService } from 'src/app/core/services/common.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('FunctionalGroupingComponent', () => {
  let component: FunctionalGroupingComponent;
  let fixture: ComponentFixture<FunctionalGroupingComponent>;

  let componentAddnew: FunctionalGroupingAddnewDialog;
  let fixtureAddnew: ComponentFixture<FunctionalGroupingAddnewDialog>;
  
  let componentEdit: FunctionalGroupingEditDialog;
  let fixtureEdit: ComponentFixture<FunctionalGroupingEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunctionalGroupingComponent, FunctionalGroupingAddnewDialog, FunctionalGroupingEditDialog ],
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
    fixture = TestBed.createComponent(FunctionalGroupingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
    component.ngAfterViewInit();
    component.selects();
    component.filter('e', {});
    //component.addNew();
    //component.itemActions('e', {});

    fixtureAddnew = TestBed.createComponent(FunctionalGroupingAddnewDialog);
    componentAddnew = fixtureAddnew.componentInstance;
    componentAddnew.ngOnInit();
    //componentAddnew.submit('e');

    fixtureEdit = TestBed.createComponent(FunctionalGroupingEditDialog);
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
  it('validate array statuses', () => {
    expect(componentEdit.statuses.length).toEqual(0);
  });
});
