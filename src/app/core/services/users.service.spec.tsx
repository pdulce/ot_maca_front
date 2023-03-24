import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpRequest, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from './users.services';
import { HeadersService } from '../headers/headers.service';

describe(`UsersService`, () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        UsersService,
        HeadersService
      ]
    });
  });
});

it(`should emit 'true' for 200 Ok`, async(inject([UsersService, HttpTestingController],
  (service: UsersService, backend: HttpTestingController) => {
    service.deleteRole({}).subscribe((next) => {
      expect(next).toBeTruthy();
    });
})));