import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  // Shared mock information
  const mockSessionInfo: SessionInformation = {
    id: 1,
    admin: true,
    token: 'abc123',
    type: 'Bearer',
    username: 'jdoe',
    firstName: 'John',
    lastName: 'Doe',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Verify that logging in sets session info and emits logged-in state
  it('should log in the user and emit true', (done) => {
    const sub = service.$isLogged().subscribe((value) => {
      if (value === true) {
        expect(service.sessionInformation).toEqual(mockSessionInfo);
        expect(service.isLogged).toBe(true);
        sub.unsubscribe();
        done();
      }
    });

    service.logIn(mockSessionInfo);
  });
});
