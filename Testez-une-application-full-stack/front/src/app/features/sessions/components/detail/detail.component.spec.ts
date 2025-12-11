import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { LOCALE_ID } from '@angular/core';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { of } from 'rxjs';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  // Shared mock information
  const mockSessionId = 1;
  const mockSessionName = 'Yoga Session';
  const mockSessionDesc = 'A yoga session';
  const mockUsersArray = [1, 2];
  const mockSession: Session = {
    id: mockSessionId,
    name: mockSessionName,
    description: mockSessionDesc,
    date: new Date('2025-01-01'),
    teacher_id: 1,
    users: mockUsersArray,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-02'),
  };
  const mockTeacher: Teacher = {
    id: 1,
    firstName: 'Jane',
    lastName: 'Doe',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-02'),
  };
  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        {
          provide: SessionApiService,
          useValue: { detail: () => of(mockSession) },
        },
        {
          provide: TeacherService,
          useValue: { detail: () => of(mockTeacher) },
        },
        { provide: LOCALE_ID, useValue: 'en-US' }, // For date formatting
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Verify that session details are rendered correctly
  it('should display session information correctly', () => {
    const native = fixture.nativeElement;

    expect(native.textContent).toContain(mockSessionName);
    expect(native.textContent).toContain(mockSessionDesc);
    expect(native.textContent).toContain(mockUsersArray.length + ' attendees');
    expect(native.textContent).toContain('Jane DOE'); // Uppercase last name in template
    expect(native.textContent).toContain('January 1, 2025'); // Date formatting
  });
});
