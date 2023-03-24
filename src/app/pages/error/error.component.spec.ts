import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        ErrorComponent
      ],
    }).compileComponents();
  });

  it('should create the error', () => {
    const fixture = TestBed.createComponent(ErrorComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
  it(`should have as title 'error'`, () => {
    const fixture = TestBed.createComponent(ErrorComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('error');
  });
});
