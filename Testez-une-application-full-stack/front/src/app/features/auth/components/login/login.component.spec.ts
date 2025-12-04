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

  // Form becomes valid with a proper email and password
  it('should validate the form when email and password are correct', () => {
    component.form.setValue({
      email: 'test@example.com',
      password: '123456'
    });

    expect(component.form.valid).toBe(true);
  });

  // Shows an error when login fails
  it('should set onError to true when login fails', () => {
    // Mock AuthService.login to return an observable error
    const authService = TestBed.inject(AuthService);
    jest.spyOn(authService, 'login').mockReturnValue({
      subscribe: ({ error }: any) => error('Invalid credentials')
    } as any);

    component.form.setValue({
      email: 'test@example.com',
      password: '123456'
    });

    component.submit();

    expect(component.onError).toBe(true);
  });
});
