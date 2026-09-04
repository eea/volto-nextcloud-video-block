import { vi } from 'vitest';
import { VideoBlockSchema } from './schema';
import config from '@plone/volto/registry';

vi.mock('@plone/volto/registry', () => ({
  __esModule: true,
  default: {
    blocks: {
      blocksConfig: {
        nextCloudVideo: {
          subtitlesLanguages: [['en', 'English']],
        },
      },
    },
  },
}));

const intl = {
  formatMessage: ({ defaultMessage, id }) => defaultMessage || id,
};

describe('VideoBlockSchema', () => {
  afterEach(() => {
    config.blocks.blocksConfig.nextCloudVideo = {
      subtitlesLanguages: [['en', 'English']],
    };
  });

  it('builds the schema using configured subtitle languages', () => {
    const schema = VideoBlockSchema({ intl });

    expect(schema.title).toBe('Video');
    expect(schema.block).toBe('Video');
    expect(schema.properties.url.widget).toBe('url');
    expect(schema.properties.preview_image.widget).toBe('attachedimage');
    expect(schema.properties.subtitles.widget).toBe('object_list');
    expect(
      schema.properties.subtitles.schema.properties.language.choices,
    ).toEqual([['en', 'English']]);
  });

  it('falls back to an empty language list when no config exists', () => {
    config.blocks.blocksConfig.nextCloudVideo = {};

    const schema = VideoBlockSchema({ intl });

    expect(
      schema.properties.subtitles.schema.properties.language.choices,
    ).toEqual([]);
  });
});
