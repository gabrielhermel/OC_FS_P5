describe('Session Form spec', () => {
  // Shared mock data
  const mockAdminUser = {
    id: 1,
    username: 'adminUser',
    firstName: 'Admin',
    lastName: 'User',
    admin: true,
  };

  const mockTeacher = {
    id: 1,
    firstName: 'Jane',
    lastName: 'Doe',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
  };

  const mockSession = {
    id: 1,
    name: 'Yoga Session',
    description: 'A yoga session',
    date: '2025-02-15T00:00:00.000Z',
    teacher_id: 1,
    users: [],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
  };

  it('should create a new session', () => {
    // Set up intercepts
    cy.intercept('POST', '/api/auth/login', {
      body: mockAdminUser,
    }).as('login');

    cy.intercept('GET', '/api/session', []).as('sessions');

    cy.intercept('GET', '/api/teacher', [mockTeacher]).as('teachers');

    cy.intercept('POST', '/api/session', mockSession).as('createSession');

    // Login as admin
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('admin@test.com');
    cy.get('input[formControlName=password]').type('password');
    cy.get('button[type=submit]').click();

    cy.wait('@login');
    cy.wait('@sessions');

    // Navigate to create page using pushState
    cy.window().then((win) => {
      win.history.pushState({}, '', '/sessions/create');
      win.dispatchEvent(new PopStateEvent('popstate'));
    });

    cy.wait('@teachers');

    // Verify page title
    cy.contains('h1', 'Create session').should('be.visible');

    // Fill out form
    cy.get('input[formControlName=name]').type(mockSession.name);
    cy.get('input[formControlName=date]').type(mockSession.date.split('T')[0]);
    cy.get('mat-select[formControlName=teacher_id]').click();
    cy.get('mat-option').first().click();
    cy.get('textarea[formControlName=description]').type(
      mockSession.description
    );

    // Submit form
    cy.get('button[type=submit]').click();

    // Wait for create API call
    cy.wait('@createSession');

    // Verify snackbar and navigation
    cy.contains('Session created !').should('be.visible');
    cy.url().should('include', '/sessions');
  });

  it('should update an existing session', () => {
    const sessionId = '1';

    // Set up intercepts
    cy.intercept('POST', '/api/auth/login', {
      body: mockAdminUser,
    }).as('login');
    cy.intercept('GET', '/api/session', [mockSession]).as('sessions');
    cy.intercept('GET', '/api/teacher', [mockTeacher]).as('teachers');
    cy.intercept('GET', `/api/session/${sessionId}`, mockSession).as('sessionDetail');
    cy.intercept('PUT', `/api/session/${sessionId}`, {
      ...mockSession,
      name: 'Updated Yoga Session',
    }).as('updateSession');

    // Login as admin
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('admin@test.com');
    cy.get('input[formControlName=password]').type('password');
    cy.get('button[type=submit]').click();

    cy.wait('@login');
    cy.wait('@sessions');

    // Navigate to update page using pushState
    cy.window().then((win) => {
      win.history.pushState({}, '', `/sessions/update/${sessionId}`);
      win.dispatchEvent(new PopStateEvent('popstate'));
    });

    cy.wait('@sessionDetail');
    cy.wait('@teachers');

    // Verify page title
    cy.contains('h1', 'Update session').should('be.visible');

    // Verify form is pre-filled
    cy.get('input[formControlName=name]').should('have.value', mockSession.name);

    // Update the name
    cy.get('input[formControlName=name]').clear().type('Updated Yoga Session');

    // Submit form
    cy.get('button[type=submit]').click();

    // Wait for update API call
    cy.wait('@updateSession');

    // Verify snackbar and navigation
    cy.contains('Session updated !').should('be.visible');
    cy.url().should('include', '/sessions');
  });
});
