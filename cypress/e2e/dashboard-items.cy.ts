describe('Dashboard: resumen y pagos pendientes (sin cookies, con localStorage)', () => {
    const user = {
      id: 'mock-user-1',
      name: 'Test Cypress',
      email: 'test@mail.com',
    };
  
    beforeEach(() => {
      // Interceptar login
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: { token: 'mocked-token' },
      }).as('login');
  
      // Interceptar /api/auth/me para simular sesión activa
      cy.intercept('GET', '/api/auth/me', {
        statusCode: 200,
        body: user,
      }).as('authMe');
  
      // Interceptar usuarios
      cy.intercept('GET', '/api/users', {
        statusCode: 200,
        body: [
          { id: user.id, name: user.name },
          { id: 'mock-user-2', name: 'Compañero' },
        ],
      }).as('getUsers');
  
      // Interceptar balance
      cy.intercept('GET', `/api/users/${user.id}/balance`, {
        statusCode: 200,
        body: {
          saldo: 50,
          totalPagado: 100,
          totalConsumido: 50,
        },
      }).as('mockBalance');
  
      // Interceptar summary
      cy.intercept('GET', `/api/users/${user.id}/summary`, {
        statusCode: 200,
        body: {
          history: [
            {
              id: 'exp-1',
              description: 'Cena de equipo',
              amount: 100,
              date: '2024-06-24',
              paidBy: { id: user.id, name: user.name },
              divisions: [
                { user: { id: 'mock-user-2', name: 'Compañero' }, paid: false, amountOwed: 50 },
                { user: { id: user.id, name: user.name }, paid: true, amountOwed: 50 },
              ],
            },
            {
              id: 'exp-2',
              description: 'Compra supermercado',
              amount: 60,
              date: '2024-06-20',
              paidBy: { id: 'mock-user-2', name: 'Compañero' },
              divisions: [
                { user: { id: user.id, name: user.name }, paid: false, amountOwed: 30 },
                { user: { id: 'mock-user-2', name: 'Compañero' }, paid: true, amountOwed: 30 },
              ],
            },
          ],
        },
      }).as('mockSummary');
    });
  
    it('simula login, guarda token en localStorage y muestra el dashboard', () => {
      // Visitar login
      cy.visit('/auth/login');
  
      // Rellenar y enviar login
      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type('12345678');
      cy.contains('Entrar').click();
  
      // Esperar login
      cy.wait('@login');

  
      // Redirigir al dashboard manualmente (porque Next router.push() no lo haría en test)
      cy.visit('/dashboard');
  
      // Esperar todos los mocks necesarios
  
      // Validar info del dashboard
      cy.contains('Creados por mí').parent().should('contain', 'Cena de equipo');
      cy.contains('Saldo').parent().should('contain', '50');
    });
  });
  