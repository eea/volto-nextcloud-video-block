import { defineMessages } from 'react-intl';
import config from '@plone/volto/registry';

const messages = defineMessages({
  Title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  Video: {
    id: 'Video',
    defaultMessage: 'Video',
  },
  VideoURL: {
    id: 'Video URL',
    defaultMessage: 'Video URL',
  },
  Preview_image: {
    id: 'Preview Image URL',
    defaultMessage: 'Preview Image URL',
  },
  Alignment: {
    id: 'Alignment',
    defaultMessage: 'Alignment',
  },
  autoPlay: {
    id: 'Video Autoplay',
    defaultMessage: 'Video Autoplay',
  },
  loop: {
    id: 'Video Loop',
    defaultMessage: 'Video Loop',
  },
  language: {
    id: 'Language',
    defaultMessage: 'Language',
  },
  file: {
    id: 'File',
    defaultMessage: 'File',
  },
});

export const VideoBlockSchema = (props) => {
  const subtitlesSchema = {
    title: 'Subtitles',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['language', 'file'],
      },
    ],
    properties: {
      language: {
        title: props.intl.formatMessage(messages.language),
        choices:
          config?.blocks?.blocksConfig?.nextCloudVideo?.subtitlesLanguages ||
          [],
      },
      file: {
        title: props.intl.formatMessage(messages.file),
        widget: 'attachedfile',
      },
    },
    required: [],
  };
  return {
    title: props.intl.formatMessage(messages.Video),
    block: 'Video',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'title',
          'url',
          'preview_image',
          'align',
          'autoPlay',
          'loop',
          'subtitles',
        ],
      },
    ],

    properties: {
      title: {
        title: props.intl.formatMessage(messages.Title),
      },
      url: {
        title: props.intl.formatMessage(messages.VideoURL),
        widget: 'url',
      },
      preview_image: {
        title: props.intl.formatMessage(messages.Preview_image),
        widget: 'attachedimage',
      },
      align: {
        title: props.intl.formatMessage(messages.Alignment),
        widget: 'align',
      },
      autoPlay: {
        title: props.intl.formatMessage(messages.autoPlay),
        type: 'boolean',
      },
      loop: {
        title: props.intl.formatMessage(messages.loop),
        type: 'boolean',
      },
      subtitles: {
        title: 'Subtitles',
        widget: 'object_list',
        schema: subtitlesSchema,
      },
    },
    required: [],
  };
};

export default VideoBlockSchema;
