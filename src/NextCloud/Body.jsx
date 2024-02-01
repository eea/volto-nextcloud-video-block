/**
 * Body video block.
 * @module components/manage/Blocks/Video/Body
 */

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { getContent } from '@plone/volto/actions';
import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import {
  getFieldURL,
  getImageScaleParams,
} from '@eeacms/volto-nextcloud-video-block/helpers';
import players from './players';

/**
 * Body video block class.
 * @class Body
 * @extends Component
 */
const Body = (props) => {
  const { data, block } = props;
  const dispatch = useDispatch();
  const image = useSelector(
    (state) => state.content.subrequests?.[block]?.data,
  );

  React.useEffect(() => {
    if (isInternalURL(data.preview_image)) {
      dispatch(getContent(flattenToAppURL(data.preview_image), null, block));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.preview_image]);

  const previewImage = getImageScaleParams(image, 'preview');
  const url = getFieldURL(data.url);
  let placeholder = previewImage?.download ?? data.preview_image;

  const ref = React.createRef();
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
