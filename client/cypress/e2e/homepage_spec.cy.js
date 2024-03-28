describe('HomePage Tests', () => {
  beforeEach(() => {
    cy.visit(' http://localhost:5173/'); 
  });


  it('navigates to find-player on "Find Game" button click', () => {
    cy.get('button').contains('Find Game').click();
    cy.url().should('include', '/find-player');
  });
});
