import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { ListComponent } from './list.component';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  // Shared mock session
  const mockSessionId = 1;
  const mockSessionName = 'Yoga Session';
  const mockSession: Session = {
    id: mockSessionId,
    name: mockSessionName,
    description: 'A yoga session',
    date: new Date('2025-01-01'),
    teacher_id: 1,
    users: [],
  };

  // Helper to recreate component with a given admin status
  const setupComponentWithAdminStatus = (isAdmin: boolean) => {
    TestBed.overrideProvider(SessionService, {
      useValue: { sessionInformation: { admin: isAdmin } },
    });

    TestBed.overrideProvider(SessionApiService, {
      useValue: { all: () => of([mockSession]) },
    });

    // Create component after mocking
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        RouterTestingModule,
      ],
    }).compileComponents();
  });

  it('should create', () => {
    setupComponentWithAdminStatus(true);
    expect(component).toBeTruthy();
  });

  // Verify that the sessions list is displayed correctly
  it('should display a list of sessions', () => {
    setupComponentWithAdminStatus(true); // or false, doesn't matter for this test

    const cards = fixture.nativeElement.querySelectorAll('.item');

    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain(mockSessionName);
  });

  // Verify Create button visibility based on admin status
  it('should display the Create button when user is admin', () => {
    setupComponentWithAdminStatus(true);

    const createButton = fixture.nativeElement.querySelector(
      'button[routerLink="create"]'
    );
    expect(createButton).toBeTruthy();
  });

  it('should not display the Create button when user is not admin', () => {
    setupComponentWithAdminStatus(false);

    const createButton = fixture.nativeElement.querySelector(
      'button[routerLink="create"]'
    );
    expect(createButton).toBeNull();
  });

  // Verify Edit button visibility based on admin status
  it('should display the Edit button for each session when user is admin', () => {
    setupComponentWithAdminStatus(true);

    // Angular doesn't render routerLink as a normal HTML attribute in tests;
    // it exposes the value via ng-reflect-router-link
    const editButton = fixture.nativeElement.querySelector(
      `button[ng-reflect-router-link="update,${mockSessionId}"]`
    );

    expect(editButton).toBeTruthy();
  });

  it('should not display the Edit button when user is not admin', () => {
    setupComponentWithAdminStatus(false);

    // Angular doesn't render routerLink as a normal HTML attribute in tests;
    // it exposes the value via ng-reflect-router-link
    const editButton = fixture.nativeElement.querySelector(
      `button[ng-reflect-router-link="update,${mockSessionId}"]`
    );

    expect(editButton).toBeNull();
  });
});
