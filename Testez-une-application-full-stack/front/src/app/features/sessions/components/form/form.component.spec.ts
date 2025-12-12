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
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TeacherService } from 'src/app/services/teacher.service';
import { Session } from '../../interfaces/session.interface';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  // Shared mock form values
  const mockSessionName = 'New Yoga Session';
  const mockSessionDate = '2025-01-01';
  const mockSessionDateObj = new Date(mockSessionDate);
  const mockTeacherId = 1;
  const mockDescription = 'A new yoga session';

  // Existing session used in update mode
  const mockExistingSession: Session = {
    id: 1,
    name: mockSessionName,
    date: mockSessionDateObj,
    teacher_id: mockTeacherId,
    description: mockDescription,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Mock services shared across tests
  const mockSessionService = {
    sessionInformation: { admin: true },
  };

  const mockSessionApiService = {
    create: jest.fn().mockReturnValue(of({ id: 1 })),
    detail: jest.fn().mockReturnValue(of(mockExistingSession)),
    update: jest.fn().mockReturnValue(of(mockExistingSession)),
  };

  const mockRouter = {
    navigate: jest.fn().mockResolvedValue(true),
    url: '/sessions/create', // default
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue(null), // default (create mode)
      },
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

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
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TeacherService, useValue: { all: () => of([]) } },
      ],
      declarations: [FormComponent],
    }).compileComponents();

    // Create component instance
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verify component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Verify session creation flow
  it('should create a session and navigate to /sessions on submit', () => {
    // Ensure create mode
    mockRouter.url = '/sessions/create';
    (mockActivatedRoute.snapshot.paramMap.get as jest.Mock).mockReturnValue(
      null
    );

    // Provide valid form values
    component.sessionForm?.setValue({
      name: mockSessionName,
      date: mockSessionDate,
      teacher_id: mockTeacherId,
      description: mockDescription,
    });

    component.submit();

    // Verify session creation call
    expect(mockSessionApiService.create).toHaveBeenCalledWith({
      name: mockSessionName,
      date: mockSessionDate,
      teacher_id: mockTeacherId,
      description: mockDescription,
    });

    // Verify navigation
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  // Verify disabled Save button when required fields are missing
  it('should disable the Save button when form is invalid', () => {
    component.sessionForm?.setValue({
      name: '',
      date: mockSessionDate,
      teacher_id: mockTeacherId,
      description: mockDescription,
    });

    fixture.detectChanges();

    const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );

    expect(component.sessionForm?.invalid).toBe(true);
    expect(saveButton.disabled).toBe(true);
  });

  // Verify session update flow
  it('should update a session and navigate to /sessions on submit', () => {
    // Enter update mode
    mockRouter.url = '/sessions/update/1';
    (mockActivatedRoute.snapshot.paramMap.get as jest.Mock).mockReturnValue(
      '1'
    );

    // Recreate component so ngOnInit runs with updated mocks
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Updated values
    const mockUpdatedSessionValues = {
      name: mockSessionName + ' updated',
      date: mockSessionDate,
      teacher_id: mockTeacherId,
      description: mockDescription + ' updated',
    };

    component.sessionForm?.setValue(mockUpdatedSessionValues);
    component.submit();

    // Verify update call
    expect(mockSessionApiService.update).toHaveBeenCalledWith(
      '1',
      mockUpdatedSessionValues
    );

    // Verify navigation
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });
});
