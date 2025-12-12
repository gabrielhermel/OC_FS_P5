import { HttpClientModule } from '@angular/common/http';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from '@angular/core/testing';
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
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  // Shared mock information
  const mockSessionId = 1;
  const mockSessionName = 'Yoga Session';
  const mockSessionDesc = 'A yoga session';
  const mockSessionDate = new Date('2025-01-01');
  const mockUsersArray = [1, 2];
  const mockSession: Session = {
    id: mockSessionId,
    name: mockSessionName,
    description: mockSessionDesc,
    date: mockSessionDate,
    teacher_id: 1,
    users: mockUsersArray,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const mockTeacherFirstName = 'Jane';
  const mockTeacherLastName = 'Doe';
  const mockTeacher: Teacher = {
    id: 1,
    firstName: mockTeacherFirstName,
    lastName: mockTeacherLastName,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Use consistent locale for date formatting tests
  const localeString = 'en-US';

  // Helper to recreate component with a given admin status
  const setupComponentWithAdminStatus = (isAdmin: boolean) => {
    TestBed.overrideProvider(SessionService, {
      useValue: {
        sessionInformation: {
          admin: isAdmin,
          id: 1,
        },
      },
    });

    // Create component after mocking
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      declarations: [DetailComponent],
      providers: [
        // Mock ActivatedRoute to provide session ID
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => mockSessionId.toString(),
              },
            },
          },
        },
        // Mock SessionApiService to return mock session
        {
          provide: SessionApiService,
          useValue: {
            detail: () => of(mockSession),
            delete: () => of({}),
          },
        },
        {
          provide: TeacherService,
          useValue: { detail: () => of(mockTeacher) },
        },
        { provide: LOCALE_ID, useValue: localeString }, // For date formatting
      ],
    }).compileComponents();
  });

  it('should create', () => {
    setupComponentWithAdminStatus(true);
    expect(component).toBeTruthy();
  });

  // Verify that session details are rendered correctly
  it('should display session information correctly', () => {
    setupComponentWithAdminStatus(true);

    const native = fixture.nativeElement;

    expect(native.textContent).toContain(mockSessionName);
    expect(native.textContent).toContain(mockSessionDesc);
    expect(native.textContent).toContain(mockUsersArray.length + ' attendees');
    // Uppercase last name in template
    expect(native.textContent).toContain(
      `${mockTeacherFirstName} ${mockTeacherLastName.toUpperCase()}`
    );
    // Matches Angular date pipe formatting for locale
    expect(native.textContent).toContain(
      mockSessionDate.toLocaleDateString(localeString, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  });

  // Verify Delete button visibility based on admin status
  it('should display the Delete button when user is admin', () => {
    setupComponentWithAdminStatus(true);

    const deleteButton = Array.from(
      fixture.nativeElement.querySelectorAll('button')
    ).find((button: any) => button.textContent.includes('Delete'));

    expect(deleteButton).toBeTruthy();
  });

  it('should not display the Delete button when user is not admin', () => {
    setupComponentWithAdminStatus(false);

    const deleteButton = Array.from(
      fixture.nativeElement.querySelectorAll('button')
    ).find((button: any) => button.textContent.includes('Delete'));

    expect(deleteButton).toBeFalsy();
  });

  // Verify session deletion and navigation on delete
  it('should delete the session and navigate to /sessions', fakeAsync(() => {
    setupComponentWithAdminStatus(true);

    const sessionApi = TestBed.inject(SessionApiService);
    const router = TestBed.inject(Router);

    const deleteSpy = jest.spyOn(sessionApi, 'delete').mockReturnValue(of({}));

    const routerSpy = jest
      .spyOn(router, 'navigate')
      .mockResolvedValue(true as any);

    component.delete();

    // Flush all pending async tasks (delete observable, snackbar timer, navigation)
    flush();

    expect(deleteSpy).toHaveBeenCalledWith(mockSessionId.toString());
    expect(routerSpy).toHaveBeenCalledWith(['sessions']);
  }));
});
