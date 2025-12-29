import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Session } from '../interfaces/session.interface';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  // Shared mock information
  const mockSessionId = 1;
  const mockSession: Session = {
    id: mockSessionId,
    name: 'Yoga Session',
    description: 'A yoga session',
    date: new Date('2025-01-01'),
    teacher_id: 1,
    users: [],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-02'),
  };
  const mockSessions: Session[] = [mockSession];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Verify sessions list is fetched
  it('should fetch all sessions', () => {
    service.all().subscribe((sessions) => {
      expect(sessions).toEqual(mockSessions);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');

    req.flush(mockSessions);
  });

  // Verify session detail is fetched by id
  it('should fetch a session by id', () => {
    service.detail(mockSessionId.toString()).subscribe((session) => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne(`api/session/${mockSessionId}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockSession);
  });

  // Verify session deletion
  it('should delete a session', () => {
    service.delete(mockSessionId.toString()).subscribe((res) => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne(`api/session/${mockSessionId}`);
    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });

  // Verify session creation
  it('should create a new session', () => {
    service.create(mockSession).subscribe((session) => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSession);

    req.flush(mockSession);
  });
});
