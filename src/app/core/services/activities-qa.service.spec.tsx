import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpRequest, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivitiesQAService } from './activities-qa.services';
import { HeadersService } from '../headers/headers.service';

describe(`ActivitiesQAService`, () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        ActivitiesQAService,
        HeadersService
      ]
    });
  });
});