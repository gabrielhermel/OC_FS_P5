describe('Me (User Profile) spec', () => {
  // Shared mock data
  const mockUserLoginInfo = {
    id: 1,
    username: 'johnDoe',
    firstName: 'John',
    lastName: 'Doe',
    admin: false,
  };

  const mockUser = {
    ...mockUserLoginInfo,
    email: 'jdoe@mail.com',
    password: 'password',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-06-01T00:00:00.000Z',
  };

  const mockAdminLoginInfo = {
    id: 2,
    username: 'adminUser',
    firstName: 'Admin',
    lastName: 'User',
    admin: true,
  };

  const mockAdminUser = {
    ...mockAdminLoginInfo,
    email: 'admin@test.com',
    password: 'password',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-06-01T00:00:00.000Z',
  };

  // Helper function to log in as regular user and navigate to /me page
  const loginAndNavigateToMePage = () => {
    // Set up intercepts
    cy.intercept('POST', '/api/auth/login', {
      body: mockUserLoginInfo,
    }).as('login');
    cy.intercept('GET', '/api/session', []).as('sessions');
    cy.intercept('GET', `/api/user/${mockUser.id}`, mockUser).as('userDetail');

    // Login
    cy.visit('/login');
    cy.get('input[formControlName=email]').type(mockUser.email);
    cy.get('input[formControlName=password]').type(mockUser.password);
    cy.get('button[type=submit]').click();

    cy.wait('@login');
    cy.wait('@sessions');

    // Navigate to me page using pushState
    cy.window().then((win) => {
      win.history.pushState({}, '', '/me');
      win.dispatchEvent(new PopStateEvent('popstate'));
    });

    cy.wait('@userDetail');
  };

  it('should display user information for regular user', () => {
    loginAndNavigateToMePage();

    // Verify user information is displayed
    cy.contains('h1', 'User information').should('be.visible');
    cy.contains(
      `${mockUser.firstName} ${mockUser.lastName.toUpperCase()}`
    ).should('be.visible');
    cy.contains(mockUser.email).should('be.visible');

    // Verify delete button is visible for non-admin
    cy.contains('button', 'Detail').should('be.visible'); // Note: template has typo "Detail" instead of "Delete"

    // Verify admin message is not visible
    cy.contains('You are admin').should('not.exist');
  });

  it('should display admin message for admin user', () => {
    // Set up intercepts
    cy.intercept('POST', '/api/auth/login', {
      body: mockAdminLoginInfo,
    }).as('login');
    cy.intercept('GET', '/api/session', []).as('sessions');
    cy.intercept('GET', `/api/user/${mockAdminUser.id}`, mockAdminUser).as(
      'userDetail'
    );

    // Login as admin
    cy.visit('/login');
    cy.get('input[formControlName=email]').type(mockAdminUser.email);
    cy.get('input[formControlName=password]').type(mockAdminUser.password);
    cy.get('button[type=submit]').click();

    cy.wait('@login');
    cy.wait('@sessions');

    // Navigate to me page using pushState
    cy.window().then((win) => {
      win.history.pushState({}, '', '/me');
      win.dispatchEvent(new PopStateEvent('popstate'));
    });

    cy.wait('@userDetail');

    // Verify admin message is visible
    cy.contains('You are admin').should('be.visible');

    // Verify delete button is not visible for admin
    cy.contains('button', 'Detail').should('not.exist'); // Note: template has typo "Detail" instead of "Delete"
  });

  it('should navigate back when back button is clicked', () => {
    loginAndNavigateToMePage();

    // Click back button
    cy.get('button[mat-icon-button]').contains('arrow_back').parent().click();

    // Verify navigation back to sessions
    cy.url().should('include', '/sessions');
  });

  it('should delete account and navigate to home when delete button is clicked', () => {
    // Mock the delete API call
    cy.intercept('DELETE', `/api/user/${mockUser.id}`, {
      statusCode: 200,
      body: {},
    }).as('deleteUser');

    loginAndNavigateToMePage();

    // Click delete button
    cy.contains('button', 'Detail').click();

    // Wait for delete API call
    cy.wait('@deleteUser');

    // Verify snackbar message
    cy.contains('Your account has been deleted !').should('be.visible');

    // Verify navigation to home page
    cy.url().should('eq', Cypress.config().baseUrl);
  });
});
