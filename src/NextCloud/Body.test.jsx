import React from 'react';
import renderer from 'react-test-renderer';
import Body from './Body';
import { isInternalURL } from '@plone/volto/helpers';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-intl-redux';
import { getFieldURL } from '@eeacms/volto-nextcloud-video-block/helpers';

jest.mock('@eeacms/volto-nextcloud-video-block/helpers', () => ({
  getFieldURL: jest.fn(),
  getImageScaleParams: jest.fn((image) => image),
}));
const mockStore = configureStore();
let history = createMemoryHistory();
jest.mock('@plone/volto/helpers', () => ({
  isInternalURL: jest.fn(),
  flattenToAppURL: jest.fn(),
  withBlockExtensions: jest.fn((Component) => Component),
}));

jest.mock('./players', () => ({
  nextCloud: jest.fn(() => <div>NextCloud Player</div>),
}));

describe('Body', () => {
  it('renders correctly', () => {
    const props = {
      data: {
        url: 'nextCloud',
        align: 'full',
        preview_image: '/path/to/image',
      },
    };
    const block = '123';
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
        subrequests: {
          [block]: {
            data: {
              image: {
                '@id': 'some/url',
              },
            },
          },
        },
      },
    });

    const component = renderer.create(
      <Provider store={store}>
        <Router history={history}>
          <Body {...props} />
        </Router>
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  it('renders the correct player based on the url', () => {
    const block = '123';
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
        subrequests: {
          [block]: {
            data: {
              image: {
                '@id': 'some/url',
              },
            },
          },
        },
      },
    });
    const props = {
      data: {
        url: 'nextCloud',
        align: 'full',
        preview_image: '/path/to/image',
      },
      className: {},
    };

    isInternalURL.mockReturnValue(true);
    getFieldURL.mockReturnValue('/path/to/video');

    const component = renderer.create(
      <Provider store={store}>
        <Router history={history}>
          <Body {...props} />
        </Router>
      </Provider>,
    );
    expect(component.toJSON().props.className).toContain('video-inner');
  });

  it('renders the correct player based on the url', () => {
    const block = '123';
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
        subrequests: {
          [block]: {
            data: {
              image: {
                '@id': 'some/url',
              },
            },
          },
        },
      },
    });
    const props = {
      data: {
        url: 'nextCloud',
        align: 'full',
        preview_image: '/path/to/image',
      },
    };

    isInternalURL.mockReturnValue(false);
    getFieldURL.mockReturnValue('nextCloud');

    const component = renderer.create(
      <Provider store={store}>
        <Router history={history}>
          <Body {...props} />
        </Router>
      </Provider>,
    );

    expect(component.toJSON().props.className).toContain('video-inner');
  });
});
