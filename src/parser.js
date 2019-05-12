const _ = require('./utils');
const { parse } = require('graphql/language/parser');
const fragments = require('./fragments');
/**
 * @param {string} code - The code to parse
 * @returns {object} Returns an ast from code
 */
function parser(code) {
  const query = _.prop(0, code);
  if(!_.is(String, query)) {
    return fragments.mergeFragments(code)
  }

  const ql = ` 
    query MyQuery {
      ${query}
    }
  `;

  return parse(ql);
}

module.exports = parser;