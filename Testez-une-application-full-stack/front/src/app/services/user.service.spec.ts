import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { User } from '../interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  // Shared mock information
  const mockUserId = '1';
  const mockUser: User = {
    id: 1,
    email: 'jdoe@mail.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: true,
    password: 'password',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-02'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Verify user is fetched by ID
  it('should get user by id', () => {
    service.getById(mockUserId).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`api/user/${mockUserId}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockUser);
  });

  // Verify user is deleted by ID
  it('should delete a user by id', () => {
    service.delete(mockUserId).subscribe((res) => {
      expect(res).toBeDefined();
    });

    const req = httpMock.expectOne(`api/user/${mockUserId}`);
    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });
});
