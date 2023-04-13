import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder }  from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeadersService } from 'src/app/core/headers/headers.service';
import { ActivitiesQAComponent, ActivitiesQAAddnewDialog, ActivitiesQAEditDialog } from './activities-qa.component';
import { ActivitiesQAService } from 'src/app/core/services/activities-qa.services';
import { UsersService } from 'src/app/core/services/users.services';

describe('AttributesComponent', () => {
  let component: ActivitiesQAComponent;
  let fixture: ComponentFixture<ActivitiesQAComponent>;

  let componentAddnew: ActivitiesQAAddnewDialog;
  let fixtureAddnew: ComponentFixture<ActivitiesQAAddnewDialog>;
  
  let componentEdit: ActivitiesQAEditDialog;
  let fixtureEdit: ComponentFixture<ActivitiesQAEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitiesQAComponent, ActivitiesQAAddnewDialog, ActivitiesQAEditDialog ],
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule ],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
        FormBuilder,
        ActivitiesQAService,
        UsersService,
        HeadersService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesQAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    fixtureAddnew = TestBed.createComponent(ActivitiesQAAddnewDialog);
    componentAddnew = fixtureAddnew.componentInstance;
    componentAddnew.ngOnInit();

    fixtureEdit = TestBed.createComponent(ActivitiesQAEditDialog);
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
