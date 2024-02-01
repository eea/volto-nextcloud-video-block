import React from 'react';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-intl-redux';
import '@testing-library/jest-dom/extend-expect';
import View from './NextCloudVideoView';

jest.mock('@plone/volto/helpers', () => ({
  withBlockExtensions: jest.fn((Component) => Component),
  isInternalURL: jest.fn((url) => true),
  flattenToAppURL: jest.fn((url) => url),
}));
const mockStore = configureStore();
let history = createMemoryHistory();

describe('View', () => {
  it('renders the video block', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
      router: {
        location: {
          pathname: '/',
        },
      },
      content: {
        subrequests: {},
      },
    });
    const data = { align: 'center', preview_image: [{}] };
    const { container } = render(
      <Provider store={store}>
        <Router history={history}>
          <View data={data} className="test-class" />{' '}
        </Router>
      </Provider>,
    );

    expect(container).toBeInTheDocument();
  });
});
