import { HeadersService } from './headers.service';

describe('HeadersService', () => {
  let service: HeadersService;
  beforeEach(() => { service = new HeadersService(); });

  it('#getHeaders should return real value', () => {
    expect(service.getHeaders()).toBeTruthy();
  });
});
