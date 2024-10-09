import { TestBed } from '@angular/core/testing';

import { WSService } from './web-socket-service.service';

describe('WebSocketServiceService', () => {
  let service: WSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
