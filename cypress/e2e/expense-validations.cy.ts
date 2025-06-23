describe('Validaciones del formulario de gastos', () => {
  const user = {
    id: 'mock-user-1',
    name: 'Test Cypress',
    email: 'test@mail.com',
  };

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'mocked-token' },
    }).as('login');

    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: user,
    }).as('authMe');

    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [
        { id: user.id, name: user.name },
        { id: 'mock-user-2', name: 'Compañero' },
      ],
    }).as('getUsers');

    cy.intercept('POST', '/api/expenses', {
      statusCode: 200,
      body: { message: 'Creado con éxito' },
    }).as('createExpense');

    cy.visit('/auth/login');
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('valida suma incorrecta en modo porcentaje', () => {
    cy.visit('/expenses/new');

    cy.get('input[placeholder="Descripción"]').type('Reparto porcentaje');
    cy.get('input[placeholder="Importe total"]').type('100');
    cy.get('input[type="date"]').type('2025-06-23');
    cy.get('select[name="paidBy"]').select('Test Cypress');
    cy.get('select').eq(1).select('Por porcentaje');

    cy.contains('+ Añadir participante').click();
    cy.get('select').eq(2).select('Test Cypress');
    cy.get('input[placeholder="% de participación"]').eq(0).type('70');

    cy.contains('+ Añadir participante').click();
    cy.get('select').eq(3).select('Compañero');
    cy.get('input[placeholder="% de participación"]').eq(1).type('50');

    cy.contains('Crear gasto').click();
    cy.get('input[placeholder="% de participación"]')
      .eq(1)
      .parent()
      .contains('La suma de los porcentajes no puede superar el 100%');
  });

  it('valida suma incorrecta en modo personalizado', () => {
    cy.visit('/expenses/new');

    cy.get('input[placeholder="Descripción"]').type('Reparto manual');
    cy.get('input[placeholder="Importe total"]').type('100');
    cy.get('input[type="date"]').type('2025-06-23');
    cy.get('select[name="paidBy"]').select('Test Cypress');
    cy.get('select').eq(1).select('Cantidad personalizada');

    cy.contains('+ Añadir participante').click();
    cy.get('select').eq(2).select('Test Cypress');
    cy.get('input[placeholder="Cantidad €"]').eq(0).type('40');

    cy.contains('+ Añadir participante').click();
    cy.get('select').eq(3).select('Compañero');
    cy.get('input[placeholder="Cantidad €"]').eq(1).type('30');

    cy.contains('Crear gasto').click();
    cy.contains('La suma personalizada debe ser igual al importe total.').should('exist');
  });
});
