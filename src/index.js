const R = require('ramda')
const resolvers = require('./resolvers')
const parser = require('./parser')

function getData(ast, data) {
  console.log('ast:', ast)
  console.log('data:', data);
  const nodeName = R.path(['name', 'value'], ast);
  const nodeValue = R.prop(nodeName, data);
  console.log('name:', nodeName);
  console.log('value:', nodeValue);

  const selections = R.pathOr([], ['selectionSet', 'selections'], ast);
  let result = {};
  selections.forEach((sel) => {
    const name = R.path(['name', 'value'], sel);
    const value = R.prop(name, nodeValue);
    let selectionChild = R.path(['selectionSet', 'selections'], sel);
    if(selectionChild && Array.isArray(value)) {
      const props = R.map(R.path(['name', 'value']), selectionChild);
      // console.log('entrou', value)
      const filtered = R.project(props, value);
      // console.log('filtered', filtered)
      result[name] = filtered;
      // console.log('result:', result)
      selectionChild.forEach((item, index) => {
        filtered.forEach(filItem => {
          getData(item, filItem)
        })
      })
    }
  })

  return result;
}

function dinoql(data) {
  return (query) => {
    const ast = parser(R.prop(0, query));
    const body = R.path(['definitions', 0], ast);
    getData(body, data)
  }
}

module.exports = dinoql;
