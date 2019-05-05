const _ = require('./utils');
const parser = require('./parser');
const transform = require('./transform');

/**
 * @param {object} data - The data to filter
 * @param {object} options - The custom options
 * @returns {object} Returns data filtered according to the query
 */
function dinoql(data, options = { keep: false }) {
  const newData = { MyQuery: data };
  return (query) => {
    const ast = parser(_.prop(0, query));
    const body = _.path(['definitions', 0], ast);
    const { getQueryResolved } = transform(options);

    const result = getQueryResolved(body, newData);

    if(options.keep) {
      return result.MyQuery;
    }

    return result;
  }
}

module.exports = dinoql;
