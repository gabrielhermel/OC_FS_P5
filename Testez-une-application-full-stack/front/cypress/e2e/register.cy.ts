describe('Register spec', () => {
  it('should register successfully', () => {
    cy.visit('/register');

    // Mock the registration API call
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: null, // Registration returns void
    }).as('registerRequest');

    // Fill out the registration form
    cy.get('input[formControlName=firstName]').type('John');
    cy.get('input[formControlName=lastName]').type('Doe');
    cy.get('input[formControlName=email]').type('john.doe@example.com');
    cy.get('input[formControlName=password]').type('password123');

    // Submit the form
    cy.get('button[type=submit]').click();

    // Wait for the API call and verify it was made
    cy.wait('@registerRequest').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });
    });

    // Verify navigation to login page
    cy.url().should('include', '/login');
  });
});