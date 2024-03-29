describe('HomePage Tests', () => {
  beforeEach(() => {
    cy.visit('https://wordhunt-fff9a57fb464.herokuapp.com/'); 
  });


  it('navigates to find-player on "Find Game" button click', () => {
    cy.get('button').contains('Find Game').click();
    cy.url().should('include', '/find-player');
  });
});
