describe('Me (User Profile) spec', () => {
  // Shared mock data
  const mockUser = {
    id: 1,
    username: 'johnDoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'jdoe@mail.com',
    admin: false,
    password: 'password',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-06-01T00:00:00.000Z',
  };

  const mockUserLoginInfo = {
    id: 1,
    username: 'johnDoe',
    firstName: 'John',
    lastName: 'Doe',
    admin: false,
  };

  it('should display user information for regular user', () => {
    // Set up intercepts
    cy.intercept('POST', '/api/auth/login', {
      body: mockUserLoginInfo,
    }).as('login');
    cy.intercept('GET', '/api/session', []).as('sessions');
    cy.intercept('GET', `/api/user/${mockUser.id}`, mockUser).as('userDetail');

    // Login
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('john.doe@test.com');
    cy.get('input[formControlName=password]').type('password');
    cy.get('button[type=submit]').click();

    cy.wait('@login');
    cy.wait('@sessions');

    // Navigate to me page using pushState
    cy.window().then((win) => {
      win.history.pushState({}, '', '/me');
      win.dispatchEvent(new PopStateEvent('popstate'));
    });

    cy.wait('@userDetail');

    // Verify user information is displayed
    cy.contains('h1', 'User information').should('be.visible');
    cy.contains(
      `${mockUser.firstName} ${mockUser.lastName.toUpperCase()}`
    ).should('be.visible');
    cy.contains(mockUser.email).should('be.visible');

    // Verify delete button is visible for non-admin
    cy.contains('button', 'Detail').should('be.visible'); // Note: template has typo "Detail" instead of "Delete"

    // Verify admin message is NOT visible
    cy.contains('You are admin').should('not.exist');
  });
});
