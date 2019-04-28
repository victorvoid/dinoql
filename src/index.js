const R = require('ramda');
const parser = require('./parser');

function getData(ast, data = {}, options) {
  const get = R.prop('get', options);
  const nodeName = R.path(['name', 'value'], ast);
  const nodeValue = R.prop(nodeName, data);
  const selections = R.pathOr([], ['selectionSet', 'selections'], ast);
  const props = R.map(R.path(['name', 'value']), selections);

  if(Array.isArray(data)) {
     return data.reduce((acc, item) => {
      if(typeof(item) === 'object') {
        const obj = R.propOr([], nodeName, item);
        const value = {[nodeName]: R.project(props, obj)};
        return [...acc, value];
      }

      return acc;
    }, []);
  }

  const getFiltered = R.ifElse(
      Array.isArray,
      R.project(props),
      R.pick(props)
  );

  const filtered = getFiltered(nodeValue || []);

  return selections.reduce((acc, sel) => {
    const value = getData(sel, filtered);
    return get ? value : R.assoc(nodeName, value, acc)
  }, data)
}

function dinoql(data, options = {}) {
  const newData = { MyQuery: data };

  return (query) => {
    const ast = parser(R.prop(0, query));
    const body = R.path(['definitions', 0], ast);
    const result = getData(body, newData, options);

    if(options.get) {
      return R.compose(R.prop(0), R.values)(result);
    }

    return result.MyQuery;
  }
}

module.exports = {
  dql: dinoql,
  dqlGet: (data) => dinoql(data, { get: true })
};
