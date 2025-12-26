import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { AuthService } from './auth.service';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  // Shared mock information
  const mockRegisterRequest: RegisterRequest = {
    email: 'jdoe@mail.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'password',
  };

  const mockLoginRequest: LoginRequest = {
    email: 'jdoe@mail.com',
    password: 'password',
  };

  const mockSessionInfo: SessionInformation = {
    id: 1,
    username: 'jdoe',
    firstName: 'John',
    lastName: 'Doe',
    admin: true,
    token: 'abc123',
    type: 'Bearer',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Verify register() sends POST to /api/auth/register with correct payload
  it('should send a POST request to register a user', () => {
    service.register(mockRegisterRequest).subscribe((res) => {
      expect(res).toBeUndefined();
    });

    const req = httpMock.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterRequest);
    req.flush(null); // Simulate empty response for void endpoint
  });

  // Verify login() sends POST to /api/auth/login with correct payload
  // and returns session info
  it('should send a POST request to log in a user', () => {
    service.login(mockLoginRequest).subscribe((res) => {
      expect(res).toEqual(mockSessionInfo);
    });

    const req = httpMock.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoginRequest);

    req.flush(mockSessionInfo);
  });
});
