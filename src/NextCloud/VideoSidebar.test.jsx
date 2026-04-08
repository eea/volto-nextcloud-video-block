import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VideoSidebar from './VideoSidebar';
import { VideoBlockSchema } from './schema';
import { getFieldURL } from '@plone/volto/helpers/Url/Url';

const mockIntl = {
  formatMessage: ({ defaultMessage, id }) => defaultMessage || id,
};

const mockSchema = {
  title: 'Schema',
  fieldsets: [],
  properties: {},
};

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: () => mockIntl,
  };
});

jest.mock('./schema', () => ({
  VideoBlockSchema: jest.fn(() => mockSchema),
}));

jest.mock('@plone/volto/helpers/Url/Url', () => ({
  getFieldURL: jest.fn(),
}));

jest.mock('@plone/volto/components/theme/Icon/Icon', () => () => (
  <span data-testid="icon" />
));

jest.mock(
  '@plone/volto/components/manage/Form/BlockDataForm',
  () =>
    ({ onChangeField, title }) => (
      <div data-testid="block-data-form">
        <div>{title}</div>
        <button type="button" onClick={() => onChangeField('url', '')}>
          clear url
        </button>
        <button
          type="button"
          onClick={() => onChangeField('title', 'Updated title')}
        >
          change title
        </button>
      </div>
    ),
);

const makeProps = (overrides = {}) => ({
  data: {},
  block: 'block-1',
  intl: mockIntl,
  onChangeBlock: jest.fn(),
  resetSubmitUrl: jest.fn(),
  ...overrides,
});

describe('VideoSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a placeholder message when there is no selected video URL', () => {
    getFieldURL.mockReturnValue('');

    render(<VideoSidebar {...makeProps()} />);

    expect(screen.getByText('No Video selected')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.queryByTestId('block-data-form')).not.toBeInTheDocument();
  });

  it('renders the block form and forwards field changes', () => {
    getFieldURL.mockReturnValue('https://cmshare.eea.europa.eu/video');

    const props = makeProps({
      data: {
        url: 'https://cmshare.eea.europa.eu/video',
        title: 'Original title',
      },
    });

    render(<VideoSidebar {...props} />);

    expect(VideoBlockSchema).toHaveBeenCalledWith(
      expect.objectContaining({
        block: 'block-1',
        intl: mockIntl,
      }),
    );
    expect(screen.getByTestId('block-data-form')).toBeInTheDocument();
    expect(screen.getByText('Video')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'change title' }));
    expect(props.onChangeBlock).toHaveBeenCalledWith('block-1', {
      ...props.data,
      title: 'Updated title',
    });

    fireEvent.click(screen.getByRole('button', { name: 'clear url' }));
    expect(props.resetSubmitUrl).toHaveBeenCalled();
    expect(props.onChangeBlock).toHaveBeenCalledWith('block-1', {
      ...props.data,
      url: '',
    });
  });
});
