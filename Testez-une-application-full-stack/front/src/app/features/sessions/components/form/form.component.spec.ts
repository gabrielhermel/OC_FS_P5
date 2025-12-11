import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TeacherService } from 'src/app/services/teacher.service';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  // Shared mock form values
  const mockSessionName = 'New Yoga Session';
  const mockSessionDate = '2025-01-01';
  const mockTeacherId = 1;
  const mockDescription = 'A new yoga session';

  // Helper to recreate component with a given admin status
  const setupComponentWithAdminStatus = (isAdmin: boolean) => {
    TestBed.overrideProvider(SessionService, {
      useValue: {
        sessionInformation: {
          admin: isAdmin,
        },
      },
    });

    // Create component after mocking
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: TeacherService,
          useValue: { all: () => of([]) },
        },
        SessionApiService,
      ],
      declarations: [FormComponent],
    }).compileComponents();
  });

  it('should create', () => {
    setupComponentWithAdminStatus(true);
    expect(component).toBeTruthy();
  });

  // Verify session creation and navigation on submit
  it('should create a session and navigate to /sessions on submit', () => {
    setupComponentWithAdminStatus(true);

    const sessionApi = TestBed.inject(SessionApiService);
    const router = TestBed.inject(Router);

    // Mock successful session creation
    const createSpy = jest
      .spyOn(sessionApi, 'create')
      .mockReturnValue(of({ id: 1 } as any));

    const routerSpy = jest
      .spyOn(router, 'navigate')
      .mockResolvedValue(true as any);

    // Provide valid form values
    component.sessionForm?.setValue({
      name: mockSessionName,
      date: mockSessionDate,
      teacher_id: mockTeacherId,
      description: mockDescription,
    });

    component.submit();

    // Verify full creation flow
    expect(createSpy).toHaveBeenCalledWith({
      name: mockSessionName,
      date: mockSessionDate,
      teacher_id: mockTeacherId,
      description: mockDescription,
    });

    expect(routerSpy).toHaveBeenCalledWith(['sessions']);
  });
});
