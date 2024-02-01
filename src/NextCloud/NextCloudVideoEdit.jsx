/**
 * Edit video block.
 * @module components/manage/Blocks/Title/Edit
 */

import React, { Component } from 'react';
import { compose } from 'redux';
import { isEqual } from 'lodash';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { Button, Input, Message } from 'semantic-ui-react';

import config from '@plone/volto/registry';
import { Icon, SidebarPortal } from '@plone/volto/components';
import { withBlockExtensions, isInternalURL } from '@plone/volto/helpers';
import { getFieldURL } from '@eeacms/volto-nextcloud-video-block/helpers';
import VideoSidebar from './VideoSidebar';
import Body from './Body';

import aheadSVG from '@plone/volto/icons/ahead.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import videoBlockSVG from '@plone/volto/components/manage/Blocks/Video/block-video.svg';

const messages = defineMessages({
  VideoFormDescription: {
    id: 'Specify a NextCloud video or playlist url',
    defaultMessage: 'Specify a NextCloud video or playlist url',
  },
  VideoBlockInputPlaceholder: {
    id: 'Video URL (NextCloud)',
    defaultMessage: 'Video URL (NextCloud)',
  },
  VideoBlockInputError: {
    id: 'Please enter a valid video URL, starting with: ',
    defaultMessage: 'Please enter a valid video URL, starting with: ',
  },
});

/**
 * Edit video block class.
 * @class Edit
 * @extends Component
 */
class Edit extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    block: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    onChangeBlock: PropTypes.func.isRequired,
    onSelectBlock: PropTypes.func.isRequired,
    onDeleteBlock: PropTypes.func.isRequired,
    onFocusPreviousBlock: PropTypes.func.isRequired,
    onFocusNextBlock: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);

    this.allowedDomainList = [
      config.settings.publicURL,
      ...(config?.blocks?.blocksConfig?.nextCloudVideo?.whiteList || []),
    ];
    this.state = {
      url: getFieldURL(props.data?.url) || '',
      valid: true,
    };
  }

  isValidUrl = (url) => {
    const internalVideoUrl = isInternalURL(url);
    const isAllowed = this.allowedDomainList.some((domain) =>
      url?.match(domain),
    );

    return internalVideoUrl || isAllowed;
  };

  /**
   * Change url handler
   * @method onChangeUrl
   * @param {Object} target Target object
   * @returns {undefined}
   */
  onChangeUrl = ({ target }) => {
    this.setState({
      url: target.value,
    });
  };

  /**
   * @param {*} nextProps
   * @returns {boolean}
   * @memberof Edit
   */
  shouldComponentUpdate(nextProps) {
    return (
      this.props.selected ||
      nextProps.selected ||
      !isEqual(this.props.data, nextProps.data)
    );
  }

  /**
   * Submit url handler
   * @method onSubmitUrl
   * @returns {undefined}
   */
  onSubmitUrl = () => {
    if (this.isValidUrl(this.state.url)) {
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        url: this.state.url,
      });
      this.setState({
        valid: true,
      });
    } else {
      this.setState({
        valid: false,
      });
    }
  };

  resetSubmitUrl = () => {
    this.setState({
      url: '',
      valid: true,
    });
  };

  /**
   * Keydown handler on Variant Menu Form
   * This is required since the ENTER key is already mapped to a onKeyDown
   * event and needs to be overriden with a child onKeyDown.
   * @method onKeyDownVariantMenuForm
   * @param {Object} e Event object
   * @returns {undefined}
   */
  onKeyDownVariantMenuForm = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      this.onSubmitUrl();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this.resetSubmitUrl();
    }
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { data } = this.props;
    const placeholder =
      data.placeholder ||
      this.props.intl.formatMessage(messages.VideoBlockInputPlaceholder);

    return (
      <div
        className={cx(
          'block video align',
          {
            selected: this.props.selected,
            center: !Boolean(data.align),
          },
          data.align,
        )}
      >
        {getFieldURL(data.url) && this.state.valid ? (
          <Body isEditMode={true} {...this.props} />
        ) : (
          <center>
            <img src={videoBlockSVG} alt="" />
            <div className="toolbar-inner">
              <Input
                onKeyDown={this.onKeyDownVariantMenuForm}
                onChange={this.onChangeUrl}
                placeholder={placeholder}
                value={this.state.url}
                onClick={(e) => {
                  e.target.focus();
                }}
                onFocus={(e) => {
                  this.props.onSelectBlock(this.props.id);
                }}
                error={!!this.state.url && !this.state.valid}
              />
              {this.state.url && (
                <Button.Group>
                  <Button
                    basic
                    className="cancel"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.resetSubmitUrl();
                    }}
                  >
                    <Icon name={clearSVG} size="30px" />
                  </Button>
                </Button.Group>
              )}
              <Button.Group>
                <Button
                  basic
                  primary
                  disabled={!this.state.url}
                  onClick={(e) => {
                    e.stopPropagation();
                    this.onSubmitUrl();
                  }}
                >
                  <Icon name={aheadSVG} size="30px" />
                </Button>
              </Button.Group>
            </div>
            {this.state.url && !this.state.valid && (
              <Message
                error
                content={`${this.props.intl.formatMessage(
                  messages.VideoBlockInputError,
                )} ${this.allowedDomainList.join(', ')}`}
              />
            )}
          </center>
        )}
        <SidebarPortal selected={this.props.selected}>
          <VideoSidebar {...this.props} resetSubmitUrl={this.resetSubmitUrl} />
        </SidebarPortal>
      </div>
    );
  }
}

export default compose(injectIntl, withBlockExtensions)(Edit);
