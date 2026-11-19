import LayoutSchema from './LayoutSchema';

const intl = {
  formatMessage: ({ defaultMessage, id }) => defaultMessage || id,
};

describe('LayoutSchema', () => {
  it('builds the block layout settings schema', () => {
    const schema = LayoutSchema(intl);

    expect(schema.title).toBe('NextCloudVideo block settings');
    expect(schema.fieldsets[0].fields).toEqual([
      'placeholder',
      'required',
      'fixed',
      'fixedLayout',
      'disableNewBlocks',
      'disableInnerButtons',
      'readOnlyTitles',
      'readOnlySettings',
      'readOnly',
    ]);
    expect(schema.properties.placeholder.description).toBe(
      'A short hint that describes the expected value within this block',
    );
    expect(schema.properties.disableInnerButtons.type).toBe('boolean');
  });
});
