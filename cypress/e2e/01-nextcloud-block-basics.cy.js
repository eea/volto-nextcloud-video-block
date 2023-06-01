import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Add Block: Video link', () => {
    // Intercept cmshare request
    cy.intercept('GET', 'https://cmshare.eea.europa.eu//download').as(
      'cmshare',
    );

    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Volto NextCloud Video Demo');
    cy.get('.documentFirstHeading').contains('Volto NextCloud Video Demo');
    cy.getSlate().click();

    // Add block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get(".blocks-chooser .ui.form .field.searchbox input[type='text']").type(
      'video (NextCloud)',
    );
    cy.get('.nextCloudVideo').click();

    // Check if error message is not displayed
    cy.get('.ui.error.message').should('not.exist');

    // Add youtube video link and check if it is valid
    cy.get('.block.video .toolbar-inner .ui.input').type(
      'https://www.youtube.com/',
    );
    cy.get('.block.video .toolbar-inner .ui.buttons .ui.basic.primary').click();
    cy.get('.ui.error.message').should('exist');

    // Delete the link and check if the error message is not displayed
    cy.get('.block.video .toolbar-inner .ui.buttons .ui.basic.cancel').click();
    cy.get('.ui.error.message').should('not.exist');

    // Add cmshare video link and check if it is valid
    cy.get('.block.video .toolbar-inner .ui.input').type(
      'https://cmshare.eea.europa.eu/',
    );
    cy.get('.block.video .toolbar-inner .ui.buttons .ui.basic.primary').click();
    cy.get('.ui.error.message').should('not.exist');

    // Wait for cmshare request
    cy.wait('@cmshare');

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // The page view should contain our changes
    cy.contains('Volto NextCloud Video Demo');
    cy.get('.block.video');
  });
});