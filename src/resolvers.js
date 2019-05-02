const R = require('ramda');

function orderBy(value = [], prop) {
  return value.sort((a, b) => parseFloat(a[prop]) - parseFloat(b[prop]));
}

const filterKey = (argName) => (data, value) => {
  return data.filter(item => R.prop(argName, item) == value);
}

module.exports = {
  orderBy,
  filterKey
}