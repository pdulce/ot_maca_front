import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveriesComponent } from './deliveries.component';

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

describe('DeliveriesComponent', () => {
  let component: DeliveriesComponent;
  let fixture: ComponentFixture<DeliveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveriesComponent ],
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
    fixture = TestBed.createComponent(DeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
    component.ngAfterViewInit();
    component.filter('e', {});
    //component.addNew();
    //component.itemActions('e', {});
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
});
