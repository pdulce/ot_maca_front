import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TableManagerComponent } from './table-manager.component';

describe('TableManagerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        TableManagerComponent
      ],
    }).compileComponents();
  });

  it('should create the error', () => {
    const fixture = TestBed.createComponent(TableManagerComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
  it(`should have as title 'error'`, () => {
    const fixture = TestBed.createComponent(TableManagerComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('error');
  });
});
