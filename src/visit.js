const { visit } = require('graphql/language/visitor');
const _ = require('./utils');

function visitAST(ast, options) {
  const variables = _.prop('variables', options);
  return visit(ast, {
    Variable(node) {
      const nodeName = _.ast.getName(node);
      const value = _.prop(nodeName, variables);
      return { value }
    }
  });
}

module.exports = visitAST;