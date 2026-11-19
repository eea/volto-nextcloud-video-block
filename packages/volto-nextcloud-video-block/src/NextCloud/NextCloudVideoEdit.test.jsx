import { vi } from 'vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Edit, { Edit as EditComponent } from './NextCloudVideoEdit';
import { isInternalURL, getFieldURL } from '@plone/volto/helpers/Url/Url';

const mockIntl = {
  formatMessage: ({ defaultMessage, id }) => defaultMessage || id,
};

vi.mock('react-intl', async () => {
  const actual = await vi.importActual('react-intl');
  return {
    ...actual,
    injectIntl: (Component) => (props) => (
      <Component {...props} intl={mockIntl} />
    ),
  };
});

vi.mock('@plone/volto/registry', () => ({
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

vi.mock('@plone/volto/components/theme/Icon/Icon', () => ({
  default: () => <span data-testid="icon" />,
}));

vi.mock('@plone/volto/components/theme/Image/Image', () => ({
  default: (props) => <img data-testid="block-image" alt={props.alt} />,
}));

vi.mock('@plone/volto/components/manage/Sidebar/SidebarPortal', () => ({
  default: ({ children, selected }) =>
    selected ? <div data-testid="sidebar-portal">{children}</div> : null,
}));

vi.mock('@plone/volto/helpers/Extensions', () => ({
  withBlockExtensions: (Component) => Component,
}));

vi.mock('@plone/volto/helpers/Url/Url', () => ({
  isInternalURL: vi.fn(),
  getFieldURL: vi.fn(),
}));

vi.mock('./Body', () => ({
  default: () => <div data-testid="video-body" />,
}));
vi.mock('./VideoSidebar', () => ({
  default: () => <div data-testid="video-sidebar" />,
}));

const makeProps = (overrides = {}) => ({
  selected: true,
  block: 'block-1',
  id: 'block-1',
  index: 0,
  data: {},
  onChangeBlock: vi.fn(),
  onSelectBlock: vi.fn(),
  onDeleteBlock: vi.fn(),
  onFocusPreviousBlock: vi.fn(),
  onFocusNextBlock: vi.fn(),
  handleKeyDown: vi.fn(),
  ...overrides,
});

describe('NextCloudVideoEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    });

    expect(props.onChangeBlock).toHaveBeenCalledWith('block-1', {
      url: 'https://cmshare.eea.europa.eu/video',
    });

    fireEvent.change(input, {
      target: { value: 'https://cmshare.eea.europa.eu/temporary' },
    });
    fireEvent.keyDown(input, {
      key: 'Escape',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
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
