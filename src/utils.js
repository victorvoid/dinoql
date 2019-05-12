/**
 * @param {string} oldProp - The prop to rename
 * @param {string} newProp - The prop to add
 * @param {object} data - The object to change
 * @returns {object} Returns object with `oldProp` renamed to `newProp`
 */
const renameProp = (oldProp, newProp, data) => {
  const { [oldProp]: old, ...others } = data;
  if(!newProp) {
    return data;
  };

  return ({
    [newProp]: old,
    ...others,
  });
}

const R = {
  prop: require('ramda/src/prop'),
  pathEq: require('ramda/src/pathEq'),
  propOr: require('ramda/src/propOr'),
  path: require('ramda/src/path'),
  pathOr: require('ramda/src/pathOr'),
  last: require('ramda/src/last'),
  isNil: require('ramda/src/isNil'),
  pick: require('ramda/src/pick'),
  project: require('ramda/src/project'),
  ifElse: require('ramda/src/ifElse'),
  cond: require('ramda/src/cond'),
  map: require('ramda/src/map'),
  always: require('ramda/src/always'),
  isEmpty: require('ramda/src/isEmpty'),
  assoc: require('ramda/src/assoc'),
  dissoc: require('ramda/src/dissoc'),
  identity: require('ramda/src/identity'),
  find: require('ramda/src/find'),
  assocPath: require('ramda/src/assocPath'),
  init: require('ramda/src/init'),
  concat: require('ramda/src/concat'),
  pipe: require('ramda/src/pipe'),
  toPairs: require('ramda/src/toPairs'),
  fromPairs: require('ramda/src/fromPairs'),
  equals: require('ramda/src/equals'),
  of: require('ramda/src/of'),
  is: require('ramda/src/is'),
  T: require('ramda/src/T')
};

const ast = {
  getValue: R.path(['value', 'value']),
  getAlias: R.path(['alias', 'value']),
  getName: R.path(['name', 'value']),
  getAllNames: (ast) => {
    const nodeAlias = R.path(['alias', 'value'], ast);
    const oldNodeName = R.path(['name', 'value'], ast);
    const nodeValue = R.path(['value', 'value'], ast);
    return {
      nodeValue,
      nodeAlias,
      oldNodeName,
      nodeName: nodeAlias || oldNodeName
    }
  }
};

module.exports = {
  ...R,
  ast,
  renameProp
};
