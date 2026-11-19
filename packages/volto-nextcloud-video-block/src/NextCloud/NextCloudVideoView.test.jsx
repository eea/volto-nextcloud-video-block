import { vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-intl-redux';
import '@testing-library/jest-dom';
import View from './NextCloudVideoView';

vi.mock('@plone/volto/helpers/Extensions', () => ({
  withBlockExtensions: vi.fn((Component) => Component),
}));
const mockStore = configureStore();
const history = createMemoryHistory();

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
    const data = {
      align: 'center',
      preview_image: [{ '@id': '/foo/bar', image_field: 'image' }],
    };
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
