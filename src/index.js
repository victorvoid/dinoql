const R = require('ramda');
const parser = require('./parser');

function getData(ast, data = {}) {
  const nodeName = R.path(['name', 'value'], ast);
  const nodeValue = R.prop(nodeName, data);
  const selections = R.pathOr([], ['selectionSet', 'selections'], ast);
  const props = R.map(R.path(['name', 'value']), selections);
  if(Array.isArray(data)) {
    const result = data.reduce((acc, item) => {
      if(typeof(item) === 'object') {
        const obj = R.prop(nodeName, item);
        const value = R.project(props, obj);
        return [...acc, ...value];
      }

      return acc;
    }, []);

    return result;
  }

  let selected = data;
  if(nodeValue) {
     selected =  R.ifElse(
      Array.isArray,
      R.project(props),
      R.pick(props)
    )(nodeValue)
  }

  const filtered = selections.reduce((acc, sel) => {
    return R.assoc(nodeName, getData(sel, selected), acc)
  }, data)

  return filtered;
}

function dinoql(data) {
  const newData = { MyQuery: data };
  return (query) => {
    const ast = parser(R.prop(0, query));
    const body = R.path(['definitions', 0], ast);
    const result = getData(body, newData);
    return result.MyQuery;
  }
}

module.exports = dinoql;
