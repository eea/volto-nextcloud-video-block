import { defineMessages } from 'react-intl';

const messages = defineMessages({
  NextCloudVideoBlockSettings: {
    id: 'NextCloudVideo block settings',
    defaultMessage: 'NextCloudVideo block settings',
  },
  Default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  AllowOnlyFollowingBlocksTypes: {
    id: 'Allow only the following blocks types',
    defaultMessage: 'Allow only the following blocks types',
  },
  HelperText: {
    id: 'Helper text',
    defaultMessage: 'Helper text',
  },
  ShortHintThatDescribesExpectedValueWithinThisBlock: {
    id: 'A short hint that describes the expected value within this block',
    defaultMessage:
      'A short hint that describes the expected value within this block',
  },
  Instructions: {
    id: 'Instructions',
    defaultMessage: 'Instructions',
  },
  DetailedExpectedValueWithinThisBlock: {
    id: 'Detailed expected value within this block',
    defaultMessage: 'Detailed expected value within this block',
  },
  Required: {
    id: 'Required',
    defaultMessage: 'Required',
  },
  DontAllowDeletionOfThisBlock: {
    id: "Don't allow deletion of this block",
    defaultMessage: "Don't allow deletion of this block",
  },
  FixedPosition: {
    id: 'Fixed position',
    defaultMessage: 'Fixed position',
  },
  DisableDragDropOnThisBlock: {
    id: 'Disable drag & drop on this block',
    defaultMessage: 'Disable drag & drop on this block',
  },
  FixedLayout: {
    id: 'Fixed layout',
    defaultMessage: 'Fixed layout',
  },
  FixedlayoutNewPanesTabs: {
    id: 'Fixed layout, New panes (tabs) created by Editor within this block will be ignored',
    defaultMessage:
      'Fixed layout, New panes (tabs) created by Editor within this block will be ignored',
  },
  DisableNewBlocks: {
    id: 'Disable new blocks',
    defaultMessage: 'Disable new blocks',
  },
  DisableCreationNewBlocks: {
    id: 'Disable creation of new blocks after this block',
    defaultMessage: 'Disable creation of new blocks after this block',
  },
  ReadOnly: {
    id: 'Read-only',
    defaultMessage: 'Read-only',
  },
  DisableEditingBlock: {
    id: 'Disable editing on this block',
    defaultMessage: 'Disable editing on this block',
  },
  ReadOnlyTitles: {
    id: 'Read-only titles',
    defaultMessage: 'Read-only titles',
  },
  DisableEditingOnNextCloudVideoTitles: {
    id: 'Disable editing on NextCloudVideo titles',
    defaultMessage: 'Disable editing on NextCloudVideo titles',
  },
  ReadOnlySettings: {
    id: 'Read-only settings',
    defaultMessage: 'Read-only settings',
  },
  DisableEditingOnNextCloudVideoBlockSettings: {
    id: 'Disable editing on NextCloudVideo block settings',
    defaultMessage: 'Disable editing on NextCloudVideo block settings',
  },
  DisableInnerButtons: {
    id: 'Disable inner buttons',
    defaultMessage: 'Disable inner buttons',
  },
  HideAllBlockRelatedButtonsWithinThisBlock: {
    id: 'Hide all block related buttons within this block',
    defaultMessage: 'Hide all block related buttons within this block',
  },
});

const schema = (intl) => ({
  title: intl.formatMessage(messages.NextCloudVideoBlockSettings),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.Default),
      fields: [
        'placeholder',
        'required',
        'fixed',
        'fixedLayout',
        'disableNewBlocks',
        'disableInnerButtons',
        'readOnlyTitles',
        'readOnlySettings',
        'readOnly',
      ],
    },
  ],
  properties: {
    placeholder: {
      title: intl.formatMessage(messages.HelperText),
      description: intl.formatMessage(
        messages.ShortHintThatDescribesExpectedValueWithinThisBlock,
      ),
      type: 'string',
    },
    required: {
      title: intl.formatMessage(messages.Required),
      description: intl.formatMessage(messages.DontAllowDeletionOfThisBlock),
      type: 'boolean',
    },
    fixed: {
      title: intl.formatMessage(messages.FixedPosition),
      description: intl.formatMessage(messages.DisableDragDropOnThisBlock),
      type: 'boolean',
    },
    fixedLayout: {
      title: intl.formatMessage(messages.FixedLayout),
      description: intl.formatMessage(messages.FixedlayoutNewPanesTabs),
      type: 'boolean',
    },
    disableNewBlocks: {
      title: intl.formatMessage(messages.DisableNewBlocks),
      description: intl.formatMessage(messages.DisableCreationNewBlocks),
      type: 'boolean',
    },
    readOnly: {
      title: intl.formatMessage(messages.ReadOnly),
      description: intl.formatMessage(messages.DisableEditingBlock),
      type: 'boolean',
    },
    readOnlyTitles: {
      title: intl.formatMessage(messages.ReadOnlyTitles),
      description: intl.formatMessage(
        messages.DisableEditingOnNextCloudVideoTitles,
      ),
      type: 'boolean',
    },
    readOnlySettings: {
      title: intl.formatMessage(messages.ReadOnlySettings),
      description: intl.formatMessage(
        messages.DisableEditingOnNextCloudVideoBlockSettings,
      ),
      type: 'boolean',
    },
    disableInnerButtons: {
      title: intl.formatMessage(messages.DisableInnerButtons),
      description: intl.formatMessage(
        messages.HideAllBlockRelatedButtonsWithinThisBlock,
      ),
      type: 'boolean',
    },
  },
  required: [],
});

export default schema;
