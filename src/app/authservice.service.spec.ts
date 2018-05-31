import { TestBed, async, inject } from '@angular/core/testing';

import { AuthserviceService } from './authservice.service';

import { Router } from '@angular/router';

describe('AuthserviceService', () => {
  /*beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthserviceService]
    });
  });*/

    
    beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthserviceService,
        {
          provide: Router, useValue: { navigate: () => {} }
        }]
    });
  });
    
  it('should be created', inject([AuthserviceService], (service: AuthserviceService) => {
    expect(service).toBeTruthy();
  }));
});
