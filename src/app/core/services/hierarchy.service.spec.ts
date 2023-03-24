import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpRequest, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HierarchyService } from './hierarchy.service';
import { HeadersService } from '../headers/headers.service';

describe(`HierarchyService`, () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        HierarchyService,
        HeadersService
      ]
    });
  });

  it(`should emit 'true' for 200 Ok`, async(inject([HierarchyService, HttpTestingController],
    (service: HierarchyService, backend: HttpTestingController) => {
      service.generateHierarchy({}).subscribe((next) => {
        expect(next).toBeTruthy();
      });
  })));
});