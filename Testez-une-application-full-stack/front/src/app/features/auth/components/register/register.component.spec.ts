import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    // Prevent Angular router from trying to navigate during tests
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Verify that form is invalid when required fields are empty
  it('should invalidate the form when fields are empty', () => {
    const form = component.form;

    expect(form.valid).toBe(false);

    expect(form.get('email')?.hasError('required')).toBe(true);
    expect(form.get('firstName')?.hasError('required')).toBe(true);
    expect(form.get('lastName')?.hasError('required')).toBe(true);
    expect(form.get('password')?.hasError('required')).toBe(true);
  });

  // Successful registration should navigate to /login
  it('should navigate to /login on successful registration', () => {
    const authService = TestBed.inject(AuthService);
    const router = TestBed.inject(Router);

    // mock successful API response
    jest.spyOn(authService, 'register').mockReturnValue(of(void 0));
    const routerSpy = jest.spyOn(router, 'navigate');

    // provide valid form data
    component.form.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: '123456',
    });

    component.submit();

    // confirm full success flow
    expect(authService.register).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: '123456',
    });

    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });

  // Verify that onError is set when registration fails
  it('should set onError to true when register fails', () => {
    const authService = TestBed.inject(AuthService);

    // Mock register() to emit an error
    jest
      .spyOn(authService, 'register')
      .mockReturnValue(throwError(() => new Error('Registration failed')));

    component.form.setValue({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: '123456',
    });

    component.submit();

    expect(component.onError).toBe(true);
  });

  // Submit button should be disabled when form is invalid
  it('should disable the submit button when the form is invalid', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );

    // Form starts invalid (all fields empty)
    expect(component.form.invalid).toBe(true);
    expect(button.disabled).toBe(true);
  });

  // Verify that submit button is enabled when the form is valid
  // NOTE:
  //   Component uses Validators.min/max on string fields, which only validate numeric values.
  //   This test currently verifies the actual UI behavior, not the correctness of the validation logic.
  it('should enable the submit button when the form is valid', () => {
    component.form.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password', // non-numeric to avoid .max validator coercion
    });
    fixture.detectChanges(); // Update the DOM

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );

    // Angular considers the form valid even though the validators are not correct for strings
    expect(component.form.valid).toBe(true);
    expect(button.disabled).toBe(false);
  });
});
