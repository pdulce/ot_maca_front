import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpRequest, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CatalogService } from './catalog.service';
import { HeadersService } from '../headers/headers.service';

describe(`CatalogService`, () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        CatalogService,
        HeadersService
      ]
    });
  });

  it(`should emit 'true' for 200 Ok`, async(inject([CatalogService, HttpTestingController],
    (service: CatalogService, backend: HttpTestingController) => {
      service.getData({}).subscribe((next) => {
        expect(next).toBeTruthy();
      });
  })));

  it(`should emit 'true' for 200 Ok`, async(inject([CatalogService, HttpTestingController],
    (service: CatalogService, backend: HttpTestingController) => {
      service.getItem({}).subscribe((next) => {
        expect(next).toBeTruthy();
      });
  })));

  it(`should emit 'true' for 200 Ok`, async(inject([CatalogService, HttpTestingController],
    (service: CatalogService, backend: HttpTestingController) => {
      service.createItem({}).subscribe((next) => {
        expect(next).toBeTruthy();
      });
  })));

  it(`should emit 'true' for 200 Ok`, async(inject([CatalogService, HttpTestingController],
    (service: CatalogService, backend: HttpTestingController) => {
      service.updateItem({}).subscribe((next) => {
        expect(next).toBeTruthy();
      });
  })));

});