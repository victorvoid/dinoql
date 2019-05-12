const { visit } = require('graphql/language/visitor');
const _ = require('./utils');

function mergeFragments(ast) {
 const definitions = _.prop('definitions', ast);
 let editedAst = null;
 visit(ast, {
  FragmentSpread(node, key, parent, ancestor){
   const { nodeName } = _.ast.getAllProps(node);
   const fragment = _.find(_.pathEq(['name', 'value'], nodeName), definitions);
   const selections = _.path(['selectionSet', 'selections'], fragment);
   const pathInit = _.init(ancestor);
   const selectionSet = _.path(pathInit, (editedAst || ast));
   const selectsMerged = _.concat(selectionSet, selections);
   editedAst = _.assocPath(pathInit, selectsMerged, ast);
   return null;
  }
 });

 return editedAst || ast
}

module.exports = {
 mergeFragments
};