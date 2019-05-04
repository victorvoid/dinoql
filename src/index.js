const R = require('ramda');
const parser = require('./parser');
const transform = require('./transform');

function dinoql(data, options = { keep: false }) {
  const newData = { MyQuery: data };
  return (query) => {
    const ast = parser(R.prop(0, query));
    const body = R.path(['definitions', 0], ast);
    const { getQueryResolved } = transform(options);

    const result = getQueryResolved(body, newData);

    if(options.keep) {
      return result.MyQuery;
    }

    return result;
  }
}

module.exports = dinoql;
