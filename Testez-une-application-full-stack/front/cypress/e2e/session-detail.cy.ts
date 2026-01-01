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

  const mockAdminUser = {
    id: 2,
    username: 'adminUser',
    firstName: 'Admin',
    lastName: 'User',
    admin: true,
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

  // Helper function to log in and navigate to session detail page
  const loginAndNavigateToDetail = (admin: boolean, session = mockSession) => {
    const user = admin ? mockAdminUser : mockUser;

    // Set up intercepts
    cy.intercept('POST', '/api/auth/login', {
      body: user,
    }).as('login');
    cy.intercept('GET', '/api/session', [mockSession]).as('sessions');
    cy.intercept('GET', `/api/session/${mockSession.id}`, session).as(
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
  };

  it('should display session details for a regular user', () => {
    loginAndNavigateToDetail(false);

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

  it('should navigate back to sessions list when back button is clicked', () => {
    loginAndNavigateToDetail(false);

    // Click the back button
    cy.get('button[mat-icon-button]').contains('arrow_back').parent().click();

    // Verify navigation back to sessions list
    cy.url().should('include', '/sessions');
    cy.url().should('not.include', '/detail');
  });

  it('should delete session and navigate to sessions list when admin clicks delete', () => {
    // Mock the delete API call
    cy.intercept('DELETE', `/api/session/${mockSession.id}`, {
      statusCode: 200,
      body: {},
    }).as('deleteSession');

    loginAndNavigateToDetail(true); // Login as admin

    // Verify Delete button is visible for admin
    cy.contains('button', 'Delete').should('be.visible');

    // Click the Delete button
    cy.contains('button', 'Delete').click();

    // Wait for delete API call
    cy.wait('@deleteSession');

    // Verify navigation back to sessions list
    cy.url().should('include', '/sessions');
    cy.url().should('not.include', '/detail');

    // Verify snackbar message is displayed
    cy.contains('Session deleted !').should('be.visible');
  });

  it('should allow user to participate in session', () => {
    loginAndNavigateToDetail(false);

    // Verify Participate button is visible
    cy.contains('button', 'Participate').should('be.visible');

    // Update intercepts for after participation
    const updatedSession = {
      ...mockSession,
      users: [...mockSessionParticipantArr, mockUser.id],
    };

    cy.intercept(
      'POST',
      `/api/session/${mockSession.id}/participate/${mockUser.id}`,
      {
        statusCode: 200,
        body: null,
      }
    ).as('participate');

    cy.intercept('GET', `/api/session/${mockSession.id}`, updatedSession).as(
      'sessionDetailRefresh'
    );

    cy.intercept('GET', `/api/teacher/${mockTeacher.id}`, mockTeacher).as(
      'teacherDetailRefresh'
    );

    // Click Participate button
    cy.contains('button', 'Participate').click();

    // Wait for API calls
    cy.wait('@participate');
    cy.wait('@sessionDetailRefresh');

    // Verify button changed to "Do not participate"
    cy.contains('button', 'Do not participate').should('be.visible');
    cy.contains('button', 'Participate').should('not.exist');
  });

  it('should allow user to unparticipate from session', () => {
    // Mock session where user is participating
    const sessionWithUserParticipating = {
      ...mockSession,
      users: [...mockSessionParticipantArr, mockUser.id],
    };

    loginAndNavigateToDetail(false, sessionWithUserParticipating);

    // Verify "Do not participate" button is visible
    cy.contains('button', 'Do not participate').should('be.visible');

    // Update intercepts for after unparticipation
    const updatedSession = {
      ...mockSession,
      users: mockSessionParticipantArr,
    };

    cy.intercept(
      'DELETE',
      `/api/session/${mockSession.id}/participate/${mockUser.id}`,
      {
        statusCode: 200,
        body: null,
      }
    ).as('unparticipate');

    cy.intercept('GET', `/api/session/${mockSession.id}`, updatedSession).as(
      'sessionDetailRefresh'
    );

    cy.intercept('GET', `/api/teacher/${mockTeacher.id}`, mockTeacher).as(
      'teacherDetailRefresh'
    );

    // Click "Do not participate" button
    cy.contains('button', 'Do not participate').click();

    // Wait for API calls
    cy.wait('@unparticipate');
    cy.wait('@sessionDetailRefresh');

    // Verify button changed to "Participate"
    cy.contains('button', 'Participate').should('be.visible');
    cy.contains('button', 'Do not participate').should('not.exist');
  });
});
