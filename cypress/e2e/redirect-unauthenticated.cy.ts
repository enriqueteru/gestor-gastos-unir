describe('Redirección de usuarios no autenticados', () => {
  it('redirige a /auth/login si no hay token en localStorage', () => {
    cy.clearLocalStorage();
    cy.visit('/dashboard');

    cy.url().should('include', '/auth/login');
  });
});
