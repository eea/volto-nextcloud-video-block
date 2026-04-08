import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Edit, { Edit as EditComponent } from './NextCloudVideoEdit';
import { isInternalURL, getFieldURL } from '@plone/volto/helpers/Url/Url';

const mockIntl = {
  formatMessage: ({ defaultMessage, id }) => defaultMessage || id,
};

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    injectIntl: (Component) => (props) => (
      <Component {...props} intl={mockIntl} />
    ),
  };
});

jest.mock('@plone/volto/registry', () => ({
  __esModule: true,
  default: {
    settings: {
      publicURL: 'http://localhost:3000',
    },
    blocks: {
      blocksConfig: {
        nextCloudVideo: {
          whiteList: ['https://cmshare.eea.europa.eu'],
        },
      },
    },
  },
}));

jest.mock('@plone/volto/components/theme/Icon/Icon', () => () => (
  <span data-testid="icon" />
));

jest.mock('@plone/volto/components/theme/Image/Image', () => (props) => (
  <img data-testid="block-image" alt={props.alt} />
));

jest.mock(
  '@plone/volto/components/manage/Sidebar/SidebarPortal',
  () =>
    ({ children, selected }) =>
      selected ? <div data-testid="sidebar-portal">{children}</div> : null,
);

jest.mock('@plone/volto/helpers/Extensions', () => ({
  withBlockExtensions: (Component) => Component,
}));

jest.mock('@plone/volto/helpers/Url/Url', () => ({
  isInternalURL: jest.fn(),
  getFieldURL: jest.fn(),
}));

jest.mock('./Body', () => () => <div data-testid="video-body" />);
jest.mock('./VideoSidebar', () => () => <div data-testid="video-sidebar" />);

const makeProps = (overrides = {}) => ({
  selected: true,
  block: 'block-1',
  id: 'block-1',
  index: 0,
  data: {},
  onChangeBlock: jest.fn(),
  onSelectBlock: jest.fn(),
  onDeleteBlock: jest.fn(),
  onFocusPreviousBlock: jest.fn(),
  onFocusNextBlock: jest.fn(),
  handleKeyDown: jest.fn(),
  ...overrides,
});

describe('NextCloudVideoEdit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isInternalURL.mockReturnValue(false);
    getFieldURL.mockImplementation((value) => value);
  });

  it('submits a valid whitelisted URL and can reset the field with Escape', () => {
    const props = makeProps();
    render(<Edit {...props} />);

    const input = screen.getByPlaceholderText('Video URL (NextCloud)');

    fireEvent.focus(input);
    expect(props.onSelectBlock).toHaveBeenCalledWith('block-1');

    fireEvent.change(input, {
      target: { value: 'https://cmshare.eea.europa.eu/video' },
    });
    fireEvent.keyDown(input, {
      key: 'Enter',
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    });

    expect(props.onChangeBlock).toHaveBeenCalledWith('block-1', {
      url: 'https://cmshare.eea.europa.eu/video',
    });

    fireEvent.change(input, {
      target: { value: 'https://cmshare.eea.europa.eu/temporary' },
    });
    fireEvent.keyDown(input, {
      key: 'Escape',
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    });

    expect(input).toHaveValue('');
  });

  it('shows an error for an invalid URL and supports the cancel button reset', () => {
    const props = makeProps();
    const { container } = render(<Edit {...props} />);

    const input = screen.getByPlaceholderText('Video URL (NextCloud)');
    fireEvent.change(input, {
      target: { value: 'https://example.com/video' },
    });

    fireEvent.click(container.querySelector('button.ui.primary.button'));

    expect(props.onChangeBlock).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Please enter a valid video URL, starting with:/),
    ).toHaveTextContent('http://localhost:3000');

    fireEvent.click(container.querySelector('button.cancel'));
    expect(input).toHaveValue('');
  });

  it('renders the body when a stored URL is already available', () => {
    const props = makeProps({
      data: {
        url: 'https://cmshare.eea.europa.eu/video',
        title: 'Stored Video',
      },
    });

    render(<Edit {...props} />);

    expect(screen.getByTestId('video-body')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-portal')).toBeInTheDocument();
    expect(screen.getByTestId('video-sidebar')).toBeInTheDocument();
  });

  it('covers validation and update guards', () => {
    const props = makeProps({
      selected: false,
      data: {},
      intl: mockIntl,
    });

    const instance = new EditComponent(props);
    instance.props = props;

    expect(
      instance.shouldComponentUpdate({
        ...props,
        selected: false,
        data: {},
      }),
    ).toBe(false);
    expect(
      instance.shouldComponentUpdate({
        ...props,
        selected: true,
        data: {},
      }),
    ).toBe(true);
    expect(
      instance.shouldComponentUpdate({
        ...props,
        selected: false,
        data: { url: 'changed' },
      }),
    ).toBe(true);

    isInternalURL.mockReturnValue(true);
    expect(instance.isValidUrl('/internal-video')).toBe(true);

    isInternalURL.mockReturnValue(false);
    expect(instance.isValidUrl('https://cmshare.eea.europa.eu/video')).toBe(
      true,
    );
    expect(instance.isValidUrl('https://example.com/video')).toBe(false);
  });
});
