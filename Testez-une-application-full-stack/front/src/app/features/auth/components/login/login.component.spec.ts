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
import { throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Verify email and password are required fields
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
      password: '123456'
    });

    expect(component.form.valid).toBe(true);
  });

  // Verify that error flag is set when authentication fails
  it('should set onError to true when login fails', () => {
    const authService = TestBed.inject(AuthService);

    jest.spyOn(authService, 'login').mockReturnValue(
      throwError(() => new Error('Invalid credentials'))
    );

    component.form.setValue({
      email: 'test@example.com',
      password: '123456'
    });

    component.submit();

    expect(component.onError).toBe(true);
  });

  // Verify that AuthService.login is called with the correct credentials
  it('should call authService.login with form credentials when form is valid', () => {
    const authService = TestBed.inject(AuthService);
    const loginSpy = jest.spyOn(authService, 'login').mockReturnValue({
      subscribe: () => {}
    } as any);

    component.form.setValue({
      email: 'user@example.com',
      password: '123456'
    });

    component.submit();

    expect(loginSpy).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: '123456'
    });
  });
});
