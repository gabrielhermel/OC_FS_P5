describe('Guards and Error Pages spec', () => {
  it('should display not found page for invalid routes', () => {
    cy.visit('/nowhere', { failOnStatusCode: false });

    cy.contains('Page not found !').should('be.visible');
  });

  it('should redirect to login when accessing protected route while logged out', () => {
    // Try to access a protected route (sessions) without logging in
    cy.visit('/sessions');

    // Should be redirected to login
    cy.url().should('include', '/login');
  });

  // NOTE: UnauthGuard coverage limitation
  // The UnauthGuard.canActivate() method's redirect branch (when isLogged === true)
  // cannot be fully tested in E2E without code modification. The guard redirects to
  // '/rentals' which doesn't exist in this application. Additionally, cy.visit()
  // causes full page reloads that clear SessionService's in-memory state, and pushState
  // bypasses Angular's routing guards entirely.
});
