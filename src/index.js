const _ = require('./utils');
const parser = require('./parser');
const transform = require('./transform');
let memo = {};
/**
 * @param {object} data - The data to filter
 * @param {object} options - The custom options
 * @returns {object} Returns data filtered according to the query
 */
function dinoql(data, options = { keep: false }) {
  return (query) => {
    const dataIndex = JSON.stringify({ data, query });
    if(dataIndex in memo) {
      return memo[dataIndex];
    }

    const ast = parser(query);
    const body = _.path(['definitions', 0], ast);
    const bodyName = _.ast.getName(body);

    const { getQueryResolved } = transform(options);

    const result = getQueryResolved(body, { [bodyName]: data });

    if(options.keep) {
      const keyName = _.prop(0, Object.keys(result));
      return _.prop(keyName, result);
    }

    memo[dataIndex] = result;
    return result;
  }
}

module.exports = dinoql;
