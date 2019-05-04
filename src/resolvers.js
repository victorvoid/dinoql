const R = require('ramda');

function orderBy(value = [], prop) {
  return value.sort((a, b) => parseFloat(a[prop]) - parseFloat(b[prop]));
};

const filterKey = (argName) => (data, value) => {
  return data.filter(item => R.prop(argName, item) == value);
};

const first = (value = []) => R.prop(0, value);

const last = (value = []) => R.last(value);

const defaultValue = (value, prop) => {
  const number = Number(prop);
  const valueChanged = number ? number : prop;
  return R.isNil(value) ? valueChanged : value;
};

module.exports = {
  filterKey,
  orderBy,
  first,
  last,
  defaultValue
};