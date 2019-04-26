const R = require('ramda');
const parser = require('./parser');

function getData(ast, data = {}) {
  // console.log('data:', data);
  // console.log('ast:', ast);
  // console.log('data', data);
  const nodeName = R.path(['name', 'value'], ast);
  const nodeValue = R.prop(nodeName, data);
  const selections = R.pathOr([], ['selectionSet', 'selections'], ast);

  let result = {};
  const props = R.map(R.path(['name', 'value']), selections);

  if(Array.isArray(data)) {
    const result = data.reduce((acc, item) => {
      if(typeof(item) === 'object') {
        const obj = R.prop(nodeName, item);
        return [...acc, R.project(props, obj)];
      }

      return acc;
    }, [])

    return result;
  }

  let filtered = data;
  if(nodeValue) {
     filtered =  R.ifElse(
      Array.isArray,
      R.project(props),
      R.pick(props)
    )(nodeValue)
  }

  selections.forEach((sel) => {
    getData(sel, filtered)
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
