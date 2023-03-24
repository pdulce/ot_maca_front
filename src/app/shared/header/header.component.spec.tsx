import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UsersService } from 'src/app/core/services/users.services';
import { HeaderComponent } from './header.component';
import { HeadersService } from 'src/app/core/headers/headers.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [
        RouterTestingModule, HttpClientTestingModule
      ],
      providers: [
        UsersService,
        HeadersService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
    component.ngOnDestroy();
    component.openMenu();
  });

  it('should create the Header', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const Header = fixture.componentInstance;
    expect(Header).toBeTruthy();
  });

  it(`should have as title 'mad'`, () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const Header = fixture.componentInstance;
    expect(Header.title).toEqual('header');
  });
});
