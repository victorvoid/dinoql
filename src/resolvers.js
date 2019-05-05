const _ = require('./utils');

function orderBy(value = [], prop) {
  return value.sort((a, b) => parseFloat(a[prop]) - parseFloat(b[prop]));
};

const filterKey = (argName) => (data, value) => {
  return data.filter(item => _.prop(argName, item) == value);
};

const first = (value = []) => _.prop(0, value);

const last = (value = []) => _.last(value);

const defaultValue = (value, prop) => {
  const number = Number(prop);
  const valueChanged = number ? number : prop;
  return _.isNil(value) ? valueChanged : value;
};

module.exports = {
  filterKey,
  orderBy,
  first,
  last,
  defaultValue
};