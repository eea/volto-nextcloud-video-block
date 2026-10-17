import { vi } from 'vitest';
import applyConfig from './index';
import LayoutSchema from './NextCloud/LayoutSchema';
import NextCloudVideoEdit from './NextCloud/NextCloudVideoEdit';
import NextCloudVideoView from './NextCloud/NextCloudVideoView';
import videoSVG from '@plone/volto/icons/videocamera.svg';

vi.mock('./NextCloud/NextCloudVideoEdit', () => ({
  default: 'NextCloudVideoEdit',
}));
vi.mock('./NextCloud/NextCloudVideoView', () => ({
  default: 'NextCloudVideoView',
}));
vi.mock('./NextCloud/LayoutSchema', () => ({
  default: vi.fn(() => ({ title: 'Layout' })),
}));
vi.mock('@plone/volto/icons/videocamera.svg', () => ({
  default: 'video-svg',
}));

describe('applyConfig', () => {
  it('registers the nextcloud video block configuration', () => {
    const config = {
      blocks: {
        blocksConfig: {
          nextCloudVideo: {
            existing: true,
          },
        },
      },
    };

    const result = applyConfig(config);

    expect(result).toBe(config);
    expect(LayoutSchema).toHaveBeenCalledTimes(1);
    expect(result.blocks.blocksConfig.nextCloudVideo).toMatchObject({
      existing: true,
      id: 'nextCloudVideo',
      title: 'Video (NextCloud)',
      icon: videoSVG,
      group: 'media',
      view: NextCloudVideoView,
      edit: NextCloudVideoEdit,
      schema: { title: 'Layout' },
      subtitlesLanguages: [['en', 'English']],
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
    });
  });
});
