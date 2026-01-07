'use strict';

exports.Query = class Query {
  queryD() {
    return 'test';
  }
};

class DGrandParent {
  value() {
    return 'testGrandParent';
  }
  valueField = () => 'testGrandParent';

  parentOverride() {
    return 'testGrandParent';
  }
  parentOverrideField = () => 'testGrandParent';

  grandParentValue() {
    return 'testGrandParent';
  }
  grandParentValueField = () => 'testGrandParent';
}

class DParent extends DGrandParent {
  value() {
    return 'testParent';
  }
  valueField = () => 'testParent';

  parentOverride() {
    return 'testParent';
  }
  parentOverrideField = () => 'testParent';

  parentValue() {
    return 'testParent';
  }
  parentValueField = () => 'testParent';
}

// eslint-disable-next-line import/order
exports.DResolvers = class D extends DParent {
  #internalValue = 'test';

  value() {
    return this.valueField();
  }
  valueField = () => {
    return `${super.grandParentValue()}-${this.parentValueField()}-${this.#internalValue}`;
  };
};
