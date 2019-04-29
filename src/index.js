const R = require('ramda');
const parser = require('./parser');
const transform = require('./transform');

function dinoql(data, options = {}) {
  const newData = { MyQuery: data };

  return (query) => {
    const ast = parser(R.prop(0, query));
    const body = R.path(['definitions', 0], ast);
    const result = transform.getQueryResolved(body, newData, options);

    if(options.get) {
      return R.compose(R.prop(0), R.values)(result);
    }

    return result.MyQuery;
  }
}

module.exports = {
  dql: dinoql,
  dqlGet: (data) => dinoql(data, { get: true })
};
