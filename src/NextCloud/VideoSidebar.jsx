import React from 'react';
import { VideoBlockSchema } from './schema';
import { BlockDataForm, Icon } from '@plone/volto/components';
import { Segment } from 'semantic-ui-react';
import { defineMessages, useIntl } from 'react-intl';
import videoSVG from '@plone/volto/icons/videocamera.svg';
import { getFieldURL } from '@plone/volto/helpers';

const messages = defineMessages({
  Video: {
    id: 'Video',
    defaultMessage: 'Video',
  },
  NoVideo: {
    id: 'No Video selected',
    defaultMessage: 'No Video selected',
  },
});

const VideoSidebar = (props) => {
  const { data, block, onChangeBlock, resetSubmitUrl } = props;
  const url = getFieldURL(data.url);
  const intl = useIntl();
  const schema = VideoBlockSchema({ ...props, intl });

  return (
    <>
      {!url ? (
        <Segment className="sidebar-metadata-container" secondary>
          {props.intl.formatMessage(messages.NoVideo)}
          <Icon name={videoSVG} size="100px" color="#b8c6c8" />
        </Segment>
      ) : (
        <BlockDataForm
          schema={schema}
          title={intl.formatMessage(messages.Video)}
          onChangeField={(id, value) => {
            if (id === 'url' && !value) {
              resetSubmitUrl();
            }
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          onChangeBlock={onChangeBlock}
          formData={data}
          block={block}
        />
      )}
    </>
  );
};

export default VideoSidebar;
