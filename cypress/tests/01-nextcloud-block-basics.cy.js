import { slateAfterEach } from '../support/e2e';

const API_PATH = Cypress.env('API_PATH') || 'http://localhost:8080/Plone';
const AUTH = {
  user: 'admin',
  pass: 'admin',
};

const setVideoBlocks = ({ subtitles = [] } = {}) =>
  cy.request({
    method: 'PATCH',
    url: `${API_PATH}/cypress/my-page`,
    headers: {
      Accept: 'application/json',
    },
    auth: AUTH,
    body: {
      title: 'Volto NextCloud Video Demo',
      blocks: {
        title: {
          '@type': 'title',
        },
        video: {
          '@type': 'nextCloudVideo',
          url: 'https://cmshare.eea.europa.eu',
          title: 'test cmshare',
          subtitles,
        },
      },
      blocks_layout: {
        items: ['title', 'video'],
      },
    },
  });

const visitPageView = () => {
  cy.visit('/cypress/my-page');
  cy.waitForResourceToLoad('my-page');
};

describe('Blocks Tests', () => {
  beforeEach(() => {
    cy.autologin();
    cy.createContent({
      contentType: 'Document',
      contentId: 'cypress',
      contentTitle: 'Cypress',
    });
    cy.createContent({
      contentType: 'Document',
      contentId: 'my-page',
      contentTitle: 'My Page',
      path: 'cypress',
    });
    cy.createContent({
      contentType: 'File',
      contentId: 'captions',
      contentTitle: 'captions',
      path: 'cypress',
    });
  });
  afterEach(slateAfterEach);

  it('renders a nextcloud video block from a whitelisted URL', () => {
    setVideoBlocks();
    visitPageView();

    cy.contains('Volto NextCloud Video Demo');
    cy.get('.block.video video')
      .should('be.visible')
      .and('have.attr', 'src', 'https://cmshare.eea.europa.eu/download');
    cy.contains('test cmshare');
  });

  it('renders subtitles tracks for a saved nextcloud video block', () => {
    setVideoBlocks({
      subtitles: [
        {
          language: 'en',
          file: '/cypress/captions',
        },
      ],
    });
    visitPageView();

    cy.get('.block.video video track')
      .should('have.attr', 'kind', 'subtitles')
      .and('have.attr', 'src', '/cypress/captions/@@download/file')
      .and('have.attr', 'srcLang', 'en');
  });
});
