describe('RulesPage Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/');
    });
  
    it('displays the correct title and game rules content', () => {
        cy.contains('View Rules').click();
        cy.url().should('include', '/game-rules');
      });
    
      it('navigates back to the home page correctly', () => {
        cy.contains('View Rules').click();
        cy.contains('h1', 'Game Rules').should('be.visible');
        cy.contains('Back to Home').click();
        cy.url().should('include', 'http://localhost:5173/');
    });
  });
  