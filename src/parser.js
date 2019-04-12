const { parse } = require('graphql')

function parser(code) {
  const ql = ` 
    query MyQuery {
      ${code}
    }
  `

  const parsed = parse(ql)

  return parsed;
}

module.exports = parser;