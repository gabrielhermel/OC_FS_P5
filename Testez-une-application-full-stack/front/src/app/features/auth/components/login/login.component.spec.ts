import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    // Prevent Angular router from trying to navigate during tests
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Verify that both email and password fields are required
  it('should invalidate the form when email and password are empty', () => {
    const form = component.form;
    const emailControl = form.get('email');
    const passwordControl = form.get('password');

    expect(form.valid).toBeFalsy();
    expect(emailControl?.hasError('required')).toBeTruthy();
    expect(passwordControl?.hasError('required')).toBeTruthy();
  });

  // Verify that form validation passes with valid credentials
  it('should validate the form when email and password are correct', () => {
    component.form.setValue({
      email: 'test@example.com',
      password: '123456',
    });

    expect(component.form.valid).toBe(true);
  });

  // Verify that error flag is set when authentication fails
  it('should set onError to true when login fails', () => {
    const authService = TestBed.inject(AuthService);

    jest
      .spyOn(authService, 'login')
      .mockReturnValue(throwError(() => new Error('Invalid credentials')));

    component.form.setValue({
      email: 'test@example.com',
      password: '123456',
    });

    component.submit();

    expect(component.onError).toBe(true);
  });

  // Verify that AuthService.login is called with the correct credentials
  it('should call authService.login with form credentials when form is valid', () => {
    const authService = TestBed.inject(AuthService);
    const loginSpy = jest
      .spyOn(authService, 'login')
      .mockReturnValue(of({} as any));

    component.form.setValue({
      email: 'user@example.com',
      password: '123456',
    });

    component.submit();

    expect(loginSpy).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: '123456',
    });
  });

  // Verify successful login creates session and navigates to sessions page
  it('should log in and navigate on successful authentication', () => {
    const mockResponse = {
      token: 'mock-token',
      type: 'Bearer',
      id: 1,
      username: 'jdoe',
      firstName: 'John',
      lastName: 'Doe',
      admin: false,
    };

    const authService = TestBed.inject(AuthService);
    const sessionService = TestBed.inject(SessionService);
    const router = TestBed.inject(Router);

    // Mock successful authentication
    const loginSpy = jest
      .spyOn(authService, 'login')
      .mockReturnValue(of(mockResponse));

    const sessionSpy = jest.spyOn(sessionService, 'logIn');
    const routerSpy = jest.spyOn(router, 'navigate');

    component.form.setValue({
      email: 'test@example.com',
      password: '123456',
    });

    component.submit();

    // Verify the complete login flow
    expect(loginSpy).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: '123456',
    });
    expect(sessionSpy).toHaveBeenCalledWith(mockResponse);
    expect(routerSpy).toHaveBeenCalledWith(['/sessions']);
  });
});
