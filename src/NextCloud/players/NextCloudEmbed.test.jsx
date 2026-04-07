import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import NextCloudEmbed from './NextCloudEmbed';
import { isInternalURL, flattenToAppURL } from '@plone/volto/helpers/Url/Url';

jest.mock('@plone/volto/helpers', () => ({
  isInternalURL: jest.fn(),
  flattenToAppURL: jest.fn(),
}));

describe('NextCloudEmbed', () => {
  beforeEach(() => {
    isInternalURL.mockClear();
    flattenToAppURL.mockClear();
  });

  it('renders without crashing', () => {
    const embedSettings = {
      placeholder: 'Placeholder',
    };
    const data = {
      url: 'some/url',
      autoPlay: false,
      loop: false,
    };
    const { container } = render(
      <NextCloudEmbed data={data} embedSettings={embedSettings} />,
    );
    expect(container.querySelector('video')).toBeInTheDocument();
  });

  it('should apply the correct src for internal url', () => {
    const embedSettings = {
      placeholder: 'Placeholder',
    };
    const data = {
      url: 'internal/url',
      autoPlay: false,
      loop: false,
    };

    isInternalURL.mockReturnValueOnce(true);
    flattenToAppURL.mockReturnValueOnce('flattened/url');

    const { container } = render(
      <NextCloudEmbed data={data} embedSettings={embedSettings} />,
    );
    expect(container.querySelector('video')).toHaveAttribute(
      'src',
      'flattened/url/@@download/file',
    );
  });

  it('should apply the correct src for internal url with @@download', () => {
    const embedSettings = {
      placeholder: 'Placeholder',
    };
    const data = {
      url: 'internal/url/@@download',
      autoPlay: false,
      loop: false,
    };

    isInternalURL.mockReturnValueOnce(true);
    flattenToAppURL.mockReturnValueOnce('flattened/url');

    const { container } = render(
      <NextCloudEmbed data={data} embedSettings={embedSettings} />,
    );
    expect(container.querySelector('video')).toHaveAttribute(
      'src',
      'flattened/url',
    );
  });

  it('should apply the correct src for external url and no file path for subtitles', () => {
    const data = {
      url: 'external/url',
      autoPlay: false,
      loop: false,
      subtitles: [{ file: undefined, language: 'en' }],
    };
    const embedSettings = {
      placeholder: 'Placeholder',
    };

    isInternalURL.mockReturnValueOnce(false);

    const { container } = render(
      <NextCloudEmbed data={data} embedSettings={embedSettings} />,
    );
    expect(container.querySelector('video')).toBeInTheDocument();
    expect(container.querySelector('video')).toHaveAttribute(
      'src',
      'external/url/download',
    );
  });

  it('should apply the correct src for external url and subtitles and the file url is external', () => {
    const data = {
      url: 'external/url',
      autoPlay: false,
      loop: false,
      subtitles: [{ file: 'external/url/subtitle', language: 'en' }],
    };
    const embedSettings = {
      placeholder: 'Placeholder',
    };

    isInternalURL.mockReturnValueOnce(false);

    const { container } = render(
      <NextCloudEmbed data={data} embedSettings={embedSettings} />,
    );

    expect(container.querySelector('video')).toBeInTheDocument();
    expect(container.querySelector('video')).toHaveAttribute(
      'src',
      'external/url/download',
    );
  });

  it('should apply the correct src for external url and subtitles and the file url is internal', () => {
    const data = {
      url: 'external/url',
      autoPlay: false,
      loop: false,
      subtitles: [{ file: 'internal/url/subtitle', language: 'en' }],
    };
    const embedSettings = {
      placeholder: 'Placeholder',
    };

    isInternalURL.mockReturnValueOnce(true);
    flattenToAppURL.mockReturnValueOnce('flattened/url');

    const { container } = render(
      <NextCloudEmbed data={data} embedSettings={embedSettings} />,
    );
    expect(container.querySelector('video')).toBeInTheDocument();
    expect(container.querySelector('video')).toHaveAttribute(
      'src',
      'flattened/url/@@download/file',
    );
  });
});
