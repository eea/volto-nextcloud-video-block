import { vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Body from './Body';
import {
  getFieldURL,
  isInternalURL,
  flattenToAppURL,
} from '@plone/volto/helpers/Url/Url';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-intl-redux';
import '@testing-library/jest-dom';

const mockStore = configureStore();
let history = createMemoryHistory();
vi.mock('@plone/volto/helpers/Url/Url', () => ({
  isInternalURL: vi.fn(),
  flattenToAppURL: vi.fn((url) => url),
  getFieldURL: vi.fn(),
}));

vi.mock('./players', () => ({
  default: {
    nextCloud: vi.fn(() => <div>NextCloud Player</div>),
  },
  nextCloud: vi.fn(() => <div>NextCloud Player</div>),
}));

describe('Body component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isInternalURL.mockReturnValue(false);
    flattenToAppURL.mockImplementation((url) => url);
    getFieldURL.mockImplementation((url) => url);
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
