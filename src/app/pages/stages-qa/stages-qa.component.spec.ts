import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder }  from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeadersService } from 'src/app/core/headers/headers.service';
import { StagesQAComponent, StagesQAAddnewDialog, StagesQAEditDialog } from './stages-qa.component';
import { ActivitiesQAService } from 'src/app/core/services/activities-qa.services';
import { UsersService } from 'src/app/core/services/users.services';

describe('StagesQAComponent', () => {
  let component: StagesQAComponent;
  let fixture: ComponentFixture<StagesQAComponent>;

  let componentAddnew: StagesQAAddnewDialog;
  let fixtureAddnew: ComponentFixture<StagesQAAddnewDialog>;
  
  let componentEdit: StagesQAEditDialog;
  let fixtureEdit: ComponentFixture<StagesQAEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StagesQAComponent, StagesQAAddnewDialog, StagesQAEditDialog ],
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
    fixture = TestBed.createComponent(StagesQAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    fixtureAddnew = TestBed.createComponent(StagesQAAddnewDialog);
    componentAddnew = fixtureAddnew.componentInstance;
    componentAddnew.ngOnInit();

    fixtureEdit = TestBed.createComponent(StagesQAEditDialog);
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
