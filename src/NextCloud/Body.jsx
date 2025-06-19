/**
 * Body video block.
 * @module components/manage/Blocks/Video/Body
 */

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import { getFieldURL } from '@plone/volto/helpers';
import { getImageScaleParams } from '@eeacms/volto-object-widget/helpers';
import players from './players';

/**
 * Body video block class.
 * @class Body
 * @extends Component
 */
const Body = (props) => {
  const { data, block } = props;
  const image = useSelector(
    (state) => state.content.subrequests?.[block]?.data,
  );

  const previewImage = getImageScaleParams(image, 'large');

  const url = getFieldURL(data.url);
  let placeholder = previewImage?.download ?? data.preview_image;

  const ref = React.useRef();
  const onKeyDown = (e) => {
    if (e.nativeEvent.keyCode === 13) {
      ref.current.handleClick();
    }
  };

  const embedSettings = {
    placeholder,
    icon: 'play',
    defaultActive: false,
    autoplay: false,
    aspectRatio: '16:9',
    tabIndex: 0,
    onKeyPress: onKeyDown,
    ref: ref,
  };
  // for future there can be more embed players
  const allowedPlayersList = ['nextCloud'];
  // only use allowed embed players from all that exist
  const allowedPlayers = allowedPlayersList.reduce((acc, playerName) => {
    const player = players[playerName];
    return {
      ...acc,
      [playerName]: player,
    };
  }, {});
  // select the appropriate embed player or default nextCloud, based on provided url
  const SelectedPlayerComponent = allowedPlayersList.reduce(
    (acc, currentPlayerName) => {
      // eslint-disable-next-line no-unused-expressions
      const result = url?.match(currentPlayerName)
        ? allowedPlayers[currentPlayerName]
        : acc;
      return result;
    },
    allowedPlayers.nextCloud,
  );

  return (
    <>
      {url && (
        <figure
          className={cx('video-inner', {
            'full-width': data.align === 'full',
          })}
        >
          <SelectedPlayerComponent {...{ data, embedSettings }} />
          {data.title && <figcaption>{data.title}</figcaption>}
        </figure>
      )}
    </>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Body.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Body;
