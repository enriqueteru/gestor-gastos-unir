describe('Registro, dashboard y creación de gasto', () => {
  const timestamp = Date.now();
  const user = {
    name: 'Test User',
    email: `test-${timestamp}@mail.com`,
    password: '12345678',
  };

  it('registra, loguea, añade saldo y accede a nuevo gasto', () => {
    cy.visit('/auth/register');

    cy.get('input[name="name"]').type(user.name);
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.contains('button', 'Registrarse').click();

    // Esperar a que el dashboard cargue completamente
    cy.location('pathname', { timeout: 10000 }).should('eq', '/dashboard');
    cy.get('[data-testid="saldo"]', { timeout: 10000 }).should('exist');

    // Añadir saldo
    cy.get('input[type="number"]').clear().type('50');
    cy.contains('button', 'Añadir').click();

    // Comprobar que el nuevo saldo se ha actualizado
    cy.get('[data-testid="saldo"]', { timeout: 10000 }).should(($el) => {
      const text = $el.text().replace(',', '.').replace(/[^\d.]/g, '');
      const value = parseFloat(text);
      expect(value).to.be.gte(50);
    });

    // Acceder a nueva vista de gasto
    cy.contains('+ Nuevo gasto').click();
    cy.location('pathname', { timeout: 5000 }).should('include', '/expenses/new');
  });
});
