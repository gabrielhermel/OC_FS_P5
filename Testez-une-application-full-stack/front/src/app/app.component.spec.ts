import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';


describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // Verify $isLogged delegates to SessionService
  it('should expose isLogged observable from SessionService', (done) => {
    const sessionService = TestBed.inject(SessionService);

    jest.spyOn(sessionService, '$isLogged').mockReturnValue(of(true));

    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    component.$isLogged().subscribe((value) => {
      expect(value).toBe(true);
      done();
    });
  });

  // Verify user logout
  it('should log out the user and navigate to home', () => {
    const sessionService = TestBed.inject(SessionService);
    const router = TestBed.inject(Router);

    const logoutSpy = jest.spyOn(sessionService, 'logOut');
    const routerSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true as any);

    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    component.logout();

    expect(logoutSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['']);
  });
});
