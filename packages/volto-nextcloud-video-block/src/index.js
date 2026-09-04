import NextCloudVideoEdit from './NextCloud/NextCloudVideoEdit';
import NextCloudVideoView from './NextCloud/NextCloudVideoView';
import LayoutSchema from './NextCloud/LayoutSchema';
import videoSVG from '@plone/volto/icons/videocamera.svg';

import { defineMessages, createIntlCache, createIntl } from 'react-intl';

const messages = defineMessages({
  NextCloudVideoTitle: {
    id: 'NextCloudVideo',
    defaultMessage: 'NextCloudVideo',
  },
});

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'en',
    messages: messages,
  },
  cache,
);

const applyConfig = (config) => {
  config.blocks.blocksConfig.nextCloudVideo = {
    ...config.blocks.blocksConfig.nextCloudVideo,
    id: 'nextCloudVideo',
    title: 'Video (NextCloud)',
    icon: videoSVG,
    group: 'media',
    view: NextCloudVideoView,
    subtitlesLanguages: [['en', 'English']],
    edit: NextCloudVideoEdit,
    schema: LayoutSchema(intl),
    restricted: false,
    mostUsed: false,
    blockHasOwnFocusManagement: false,
    sidebarTab: 1,
    whiteList: [
      'https://cmshare.eea.europa.eu',
      'https://shareit.eea.europa.eu',
    ],
    security: {
      addPermission: [],
      view: [],
    },
    autoAdd: false,
  };

  return config;
};

export default applyConfig;
