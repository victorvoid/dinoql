const { parse } = require('graphql/language/parser');

/**
 * @param {string} code - The code to parse
 * @returns {object} Returns an ast from code
 */
function parser(code) {
  const ql = ` 
    query MyQuery {
      ${code}
    }
  `;

  return parse(ql);
}

module.exports = parser;