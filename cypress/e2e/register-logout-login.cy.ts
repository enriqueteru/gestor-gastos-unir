describe('Flujo de registro, logout y login', () => {
    const timestamp = Date.now();
    const user = {
      name: 'Test User',
      email: `test-${timestamp}@mail.com`,
      password: '12345678',
    };
  
    it('registra un nuevo usuario y accede al dashboard', () => {
      cy.visit('/auth/register');
  
      cy.get('input[name="name"]').type(user.name);
      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type(user.password);
  
      cy.contains('button', 'Registrarse').should('be.visible').click();
  
      // Esperar redirección al dashboard
      cy.location('pathname', { timeout: 10000 }).should('eq', '/dashboard');
  
      // Esperar que se muestre contenido del dashboard
      cy.contains('Mis gastos', { timeout: 10000 }).should('exist');
      cy.contains('Cerrar sesión').should('be.visible');
    });

    it('inicia sesión nuevamente con el mismo usuario', () => {
      cy.visit('/auth/login');
  
      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type(user.password);
  
      cy.contains('button', 'Entrar').should('be.visible').click();
  
      cy.location('pathname', { timeout: 10000 }).should('eq', '/dashboard');
      cy.contains('Mis gastos').should('exist');
      cy.contains(user.name).should('exist');
        
      cy.contains('Cerrar sesión', { timeout: 10000 }).should('be.visible').click();
  
      cy.location('pathname', { timeout: 10000 }).should('include', '/auth/login');
      cy.contains('Iniciar sesión').should('exist');
    });
  });
  