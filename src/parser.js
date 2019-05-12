const _ = require('./utils');
const { parse } = require('graphql/language/parser');
const fragments = require('./fragments');
const visitAST = require('./visit');
/**
 * @param {string} code - The code to parse
 * @returns {object} Returns an ast from code
 */
function parser(code, options) {
  const query = _.prop(0, code);
  if(!_.is(String, query)) {
    return visitAST(fragments.mergeFragments(code), options)
  }

  const ql = ` 
    query MyQuery {
      ${query}
    }
  `;

  return visitAST(parse(ql), options);
}

module.exports = parser;