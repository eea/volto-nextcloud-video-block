import React from 'react';
import { render, screen } from '@testing-library/react';
import Body from './Body';
import { isInternalURL, getFieldURL } from '@plone/volto/helpers';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-intl-redux';
import '@testing-library/jest-dom/extend-expect';

const mockStore = configureStore();
let history = createMemoryHistory();
jest.mock('@plone/volto/helpers', () => ({
  isInternalURL: jest.fn(),
  flattenToAppURL: jest.fn((url) => url),
  getFieldURL: jest.fn(),
  withBlockExtensions: jest.fn((Component) => Component),
}));

jest.mock('./players', () => ({
  nextCloud: jest.fn(() => <div>NextCloud Player</div>),
}));

describe('Body component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the video component with the appropriate player based on URL', () => {
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
              '@id': 'http://localhost:3000/some-image',
              image_field: 'image',
              image_scales: {
                image: [
                  {
                    download: '@@images/image.png',
                    width: 400,
                    height: 400,
                    scales: {
                      preview: {
                        download: '@@images/image-400.png',
                        width: 400,
                        height: 400,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    });
    const data = {
      url: 'https://example.com/nextCloud/video.mp4',
      title: 'Sample Video',
      align: 'center',
      preview_image: 'https://example.com/preview.jpg',
    };
    getFieldURL.mockReturnValueOnce('https://example.com/nextCloud/video.mp4');
    isInternalURL.mockReturnValueOnce(false);
    isInternalURL.mockReturnValueOnce(true);

    render(
      <Provider store={store}>
        <Router history={history}>
          <Body data={data} block={block} />
        </Router>
      </Provider>,
    );

    expect(screen.getByRole('figure')).toBeInTheDocument();
    expect(screen.getByText('Sample Video')).toBeInTheDocument();
    expect(screen.getByRole('figure')).toHaveClass('video-inner');
    expect(screen.getByRole('figure')).not.toHaveClass('full-width');
  });

  it('renders the video component with full-width class when align is set to "full"', () => {
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
              '@id': 'http://localhost:3000/some-image',
              image_field: 'image',
              image_scales: {
                image: [
                  {
                    download: '@@images/image.png',
                    width: 400,
                    height: 400,
                    scales: {
                      preview: {
                        download: '@@images/image-400.png',
                        width: 400,
                        height: 400,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    });
    const data = {
      url: 'https://example.com/nextCloud/video.mp4',
      title: 'Sample Video',
      align: 'full',
      preview_image: 'https://example.com/preview.jpg',
      className: {},
    };
    getFieldURL.mockReturnValueOnce('https://example.com/nextCloud/video.mp4');
    isInternalURL.mockReturnValueOnce(false);
    isInternalURL.mockReturnValueOnce(true);

    render(
      <Provider store={store}>
        <Router history={history}>
          <Body data={data} block={block} />
        </Router>
      </Provider>,
    );

    expect(screen.getByRole('figure')).toHaveClass('full-width');
  });

  it('does not render the video component when URL is not provided', () => {
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
              '@id': 'http://localhost:3000/some-image',
              image_field: 'image',
              image_scales: {
                image: [
                  {
                    download: '@@images/image.png',
                    width: 400,
                    height: 400,
                    scales: {
                      preview: {
                        download: '@@images/image-400.png',
                        width: 400,
                        height: 400,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    });
    const data = {
      title: 'Sample Video',
      align: 'center',
      preview_image: 'https://example.com/preview.jpg',
      url: undefined, // Explicitly set url to undefined
    };

    // Mock getFieldURL to return undefined when called with undefined
    getFieldURL.mockReturnValueOnce(undefined);
    isInternalURL.mockReturnValueOnce(true); // for getImageScaleParams

    render(
      <Provider store={store}>
        <Router history={history}>
          <Body data={data} block={block} />
        </Router>
      </Provider>,
    );

    expect(screen.queryByRole('figure')).not.toBeInTheDocument();
  });
});
