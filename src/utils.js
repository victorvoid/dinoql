const renameProp = (oldProp, newProp, { [oldProp]: old, ...others }) => ({
  [newProp]: old,
  ...others,
});

const R = {
  prop: require('ramda/src/prop'),
  propOr: require('ramda/src/propOr'),
  path: require('ramda/src/path'),
  pathOr: require('ramda/src/pathOr'),
  last: require('ramda/src/last'),
  isNil: require('ramda/src/isNil'),
  pick: require('ramda/src/pick'),
  project: require('ramda/src/project'),
  ifElse: require('ramda/src/ifElse'),
  map: require('ramda/src/map'),
  always: require('ramda/src/always'),
  isEmpty: require('ramda/src/isEmpty'),
  assoc: require('ramda/src/assoc'),
  identity: require('ramda/src/identity')
};

const ast = {
  getValue: R.path(['value', 'value']),
  getAlias: R.path(['alias', 'value']),
  getName: R.path(['name', 'value'])
}

module.exports = {
  ...R,
  ast,
  renameProp
};
