const resolvers = require('./resolvers');
const R = require('ramda');
const { renameProp } = require('./utils');

function Transform(options) {
  let _objToGet = {};
  const getResolved = ({ data, nodeName }) => args => {
    const arr = R.prop(nodeName, data);
    const result = args.reduce((acc, arg) => {
      const name = R.path(['name', 'value'], arg);
      const value = R.path(['value', 'value'], arg);
      const resolver = R.propOr(resolvers.filterKey(name), name, resolvers);
      return resolver(arr, value);
    }, arr);

    return R.assoc(nodeName, result, data)
  };

  const getItemsResolved = ({ nodeName, props, data }) => {
    return data.reduce((acc, item) => {
      if(typeof(item) === 'object') {
        const obj = R.propOr([], nodeName, item);
        const getFiltered = R.ifElse(
          Array.isArray,
          R.project(props),
          R.identity
        );

        const value = { ...item, [nodeName]: getFiltered(obj) };

        return [...acc, value];
      }

      return acc;
    }, []);
  };

  const getChildreansResolved = ({ nodeValue, nodeName, selections, data, props }) => {
    const getFiltered = R.ifElse(
      Array.isArray,
      R.project(props),
      R.pick(props)
    );

    const filtered = getFiltered(nodeValue || []);

    const result = selections.reduce((acc, sel) => {
      const value = getQueryResolved(sel, filtered);

      if(options.keep) {
        return  R.assoc(nodeName, value, acc)
      }

      const oldName = R.path(['name', 'value'], sel);
      const aliasName = R.path(['alias', 'value'], sel);
      const name = aliasName || oldName;
      if(!sel.selectionSet) {
        _objToGet[name] = R.prop(name, value);
      } else if(sel.arguments.length && sel.selectionSet) {
        _objToGet[name] = R.prop(name, filtered);
      }

      return _objToGet
    }, data);

    return result;
  };

  function getQueryResolved(ast, data = {}) {
    const nodeAlias = R.path(['alias', 'value'], ast);
    const oldNodeName = R.path(['name', 'value'], ast);
    const nodeName = nodeAlias ? nodeAlias : oldNodeName;
    const dataWithAlias = nodeAlias ? renameProp(oldNodeName, nodeAlias, data) : data;
    const selections = R.pathOr([], ['selectionSet', 'selections'], ast);
    const props = R.map(R.path(['name', 'value']), selections);
    const astArgs = R.propOr([], 'arguments', ast);
    const dataResolved = R.ifElse(
      R.isEmpty,
      R.always(dataWithAlias),
      getResolved({ data: dataWithAlias, nodeName })
    )(astArgs);

    const nodeValue = R.prop(nodeName, dataResolved);

    if(Array.isArray(data)) {
      return getItemsResolved({ nodeName, props, data: dataResolved })
    }

    return getChildreansResolved({
      data: dataResolved,
      selections,
      nodeValue,
      nodeName,
      props,
    })
  }

  return {
    getQueryResolved
  };
}

module.exports = Transform;
