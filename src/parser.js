const { parse } = require('graphql/language/parser');

function parser(code) {
  const ql = ` 
    query MyQuery {
      ${code}
    }
  `;

  return parse(ql);
}

module.exports = parser;