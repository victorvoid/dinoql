const _ = require('./utils');
const { parse } = require('graphql/language/parser');

/**
 * @param {string} code - The code to parse
 * @returns {object} Returns an ast from code
 */
function parser(code) {
  const query = _.prop(0, code);
  if(typeof(query) !== 'string') {
    return code
  }

  const ql = ` 
    query MyQuery {
      ${query}
    }
  `;

  return parse(ql);
}

module.exports = parser;