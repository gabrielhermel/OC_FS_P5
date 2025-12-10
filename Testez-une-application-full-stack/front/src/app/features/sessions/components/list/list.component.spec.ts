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

  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
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
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Verify that the sessions list is displayed
  it('should display a list of sessions', () => {
    const mockSessions: Session[] = [
      {
        id: 1,
        name: 'Yoga Session',
        description: 'A yoga session',
        date: new Date('2025-01-01'),
        teacher_id: 1,
        users: [],
      },
    ];

    const sessionApi = TestBed.inject(SessionApiService);
    jest.spyOn(sessionApi, 'all').mockReturnValue(of(mockSessions));

    // Recreate component after mocking so API is called with mocked data
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.item');

    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain('Yoga Session');
  });
});
