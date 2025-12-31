import { toTitleCase } from './helpers';

describe('Session Detail spec', () => {
  // Shared mock data
  const mockTeacher = {
    id: 1,
    firstName: 'Jane',
    lastName: 'Doe',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
  };

  const mockUser = {
    id: 1,
    username: 'johnDoe',
    firstName: 'John',
    lastName: 'Doe',
    admin: false,
  };

  const mockSessionParticipantArr = [2, 3]; // mockUser is not participating

  const mockSession = {
    id: 1,
    name: 'Yoga Session',
    description: 'A yoga session',
    date: '2025-01-01T00:00:00.000Z',
    teacher_id: mockTeacher.id,
    users: mockSessionParticipantArr,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  };

  it('should display session details for a regular user', () => {
    // Set up intercepts
    cy.intercept('POST', '/api/auth/login', {
      body: mockUser,
    }).as('login');

    cy.intercept('GET', '/api/session', [mockSession]).as('sessions');

    cy.intercept('GET', `/api/session/${mockSession.id}`, mockSession).as(
      'sessionDetail'
    );

    cy.intercept('GET', `/api/teacher/${mockTeacher.id}`, mockTeacher).as(
      'teacherDetail'
    );

    // Login
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('test@example.com');
    cy.get('input[formControlName=password]').type('password');
    cy.get('button[type=submit]').click();

    // Wait for login and redirect to sessions
    cy.wait('@login');
    cy.wait('@sessions');
    cy.url().should('include', '/sessions');

    // Navigate using Angular's router via pushState, otherwise page reloads
    // and in-memory state of SessionService is lost.
    cy.window().then((win) => {
      win.history.pushState({}, '', `/sessions/detail/${mockSession.id}`);
      win.dispatchEvent(new PopStateEvent('popstate'));
    });

    // Wait for detail page API calls
    cy.wait('@sessionDetail');
    cy.wait('@teacherDetail');

    // Verify session details display correctly
    cy.contains(toTitleCase(mockSession.name)).should('be.visible');
    cy.contains(
      `${mockTeacher.firstName} ${mockTeacher.lastName.toUpperCase()}`
    ).should('be.visible');
    cy.contains(`${mockSessionParticipantArr.length} attendees`).should(
      'be.visible'
    );
    cy.contains(mockSession.description).should('be.visible');

    // Verify Participate button is visible
    cy.contains('button', 'Participate').should('be.visible');

    // Verify Delete button is not visible
    cy.contains('button', 'Delete').should('not.exist');
  });
});
