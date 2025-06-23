describe('Flujo completo: registro, creación de gasto y mock en dashboard', () => {
  const timestamp = Date.now();
  const user = {
    name: 'Test Cypress',
    email: `test-${timestamp}@mail.com`,
    password: '12345678',
  };

  it('registra, crea gasto y muestra el gasto en el dashboard', () => {
    // Interceptar usuarios
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [
        { id: 'user-1', name: user.name },
        { id: 'user-2', name: 'Compañero' },
      ],
    }).as('getUsers');

    // Registro
    cy.visit('/auth/register');
    cy.get('input[name="name"]').type(user.name);
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.contains('button', 'Registrarse').click();

    cy.location('pathname', { timeout: 10000 }).should('eq', '/dashboard');
    cy.contains('Saldo').should('exist');

    // Ir a nuevo gasto
    cy.contains('+ Nuevo gasto').click();
    cy.location('pathname').should('include', '/expenses/new');

    // Mock: participantes ya están interceptados
    cy.wait('@getUsers');

    // Rellenar formulario
    cy.get('input[placeholder="Descripción"]').type('Cena de equipo');
    cy.get('input[type="number"]').first().clear().type('100');
    cy.get('input[type="date"]').type(new Date().toISOString().split('T')[0]);

    cy.get('select').eq(0).select(user.name); // pagado por
    cy.get('select').eq(1).select('A partes iguales');

    cy.contains('+ Añadir participante').click();
    cy.get('select').eq(2).select(user.name);

    cy.contains('+ Añadir participante').click();
    cy.get('select').eq(3).select('Compañero');
    cy.intercept('POST', '/api/expenses', {
      statusCode: 200,
      body: { id: 'exp-1' },
    }).as('mockCreateExpense');
    cy.contains('button', 'Crear gasto').click();

    // Mockear dashboard con ese gasto
    cy.intercept('GET', '/api/users/user-1/summary', {
      statusCode: 200,
      body: {
        history: [
          {
            id: 'exp-1',
            description: 'Cena de equipo',
            amount: 100,
            date: new Date().toISOString(),
            paidBy: { id: 'user-1', name: user.name },
            divisions: [
              { user: { id: 'user-2' }, paid: false, amountOwed: 50 },
              { user: { id: 'user-1' }, paid: true, amountOwed: 50 },
            ],
          },
        ],
      },
    }).as('mockSummary');

    cy.intercept('GET', '/api/users/user-1/balance', {
      statusCode: 200,
      body: {
        saldo: 50,
        totalPagado: 100,
        totalConsumido: 50,
      },
    }).as('mockBalance');

    // Ya estamos redirigidos al dashboard por el propio componente
    cy.location('pathname', { timeout: 10000 }).should('eq', '/dashboard');

    // Esperar a que los datos estén cargados
    cy.wait(['@mockSummary', '@mockBalance']);

    // Validar que el gasto aparece
    cy.contains('Creados por mí').parent().contains('Cena de equipo');
  });
});
