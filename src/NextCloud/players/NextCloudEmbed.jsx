/* eslint-disable jsx-a11y/media-has-caption */
/**
 * NextCloudEmbed video block.
 * @module components/manage/Blocks/Video/NextCloudEmbed
 */
import React from 'react';
import PropTypes from 'prop-types';
import { isInternalURL, flattenToAppURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
/**
 * NextCloudEmbed video block class.
 * @class NextCloudEmbed
 * @extends Component
 */
const NextCloudEmbed = ({ data, embedSettings }) => {
  // Ticket:293889
  if (data.autoPlay && data.controls === undefined) {
    data.controls = true;
  }
  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      src={
        isInternalURL(data.url)
          ? data.url.includes('@@download')
            ? flattenToAppURL(data.url)
            : `${flattenToAppURL(data.url)}/@@download/file`
          : `${data.url}/download`
      }
      controls={data.controls}
      autoPlay={data.autoPlay}
      muted={data.muted}
      loop={data.loop}
      poster={embedSettings.placeholder}
      type="video/mp4"
    >
      {data?.subtitles?.length > 0 &&
        data?.subtitles?.map((subtitle, index) => {
          if (subtitle?.file !== null && subtitle?.file !== undefined)
            return (
              <track
                key={index}
                label={
                  config?.blocks?.blocksConfig?.nextCloudVideo?.subtitlesLanguages.find(
                    (lang) => subtitle?.language === lang?.[0],
                  )?.[1]
                }
                kind="subtitles"
                srcLang={subtitle?.language}
                src={
                  typeof subtitle?.file === 'string' &&
                  isInternalURL(subtitle?.file)
                    ? flattenToAppURL(subtitle?.file) + '/@@download/file'
                    : `data:${subtitle?.file['content-type']};${subtitle?.file?.encoding},${subtitle?.file?.data}`
                }
              />
            );
          else return <div key={index}></div>;
        })}
    </video>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
NextCloudEmbed.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  embedSettings: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default NextCloudEmbed;
