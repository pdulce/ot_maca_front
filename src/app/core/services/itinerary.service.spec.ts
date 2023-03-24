import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpRequest, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ItineraryService } from './itinerary.service';
import { HeadersService } from '../headers/headers.service';

describe(`ItineraryService`, () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        ItineraryService,
        HeadersService
      ]
    });
  });

  it(`should emit 'true' for 200 Ok`, async(inject([ItineraryService, HttpTestingController],
    (service: ItineraryService, backend: HttpTestingController) => {
      service.calculateItinerary({}).subscribe((next) => {
        expect(next).toBeTruthy();
      });
  })));
});