const resolvers = require('./resolvers');
const _ = require('./utils');
const { renameProp } = require('./utils');

function Transform(options) {
  let _objToGet = {};
  const getResolved = ({ data, nodeName }) => args => {
    const arr = _.prop(nodeName, data);
    const result = args.reduce((acc, arg) => {
      const name = _.path(['name', 'value'], arg);
      const value = _.path(['value', 'value'], arg);
      const resolver = _.propOr(resolvers.filterKey(name), name, resolvers);
      return resolver(arr, value);
    }, arr);

    return _.assoc(nodeName, result, data)
  };

  const getItemsResolved = ({ nodeName, props, data }) => {
    return data.reduce((acc, item) => {
      if(typeof(item) === 'object') {
        const obj = _.propOr([], nodeName, item);
        const getFiltered = _.ifElse(
          Array.isArray,
          _.project(props),
          _.identity
        );

        const value = { ...item, [nodeName]: getFiltered(obj) };

        return [...acc, value];
      }

      return acc;
    }, []);
  };

  const getChildreansResolved = ({ nodeValue, nodeName, selections, data, props }) => {
    const getFiltered = _.ifElse(
      Array.isArray,
      _.project(props),
      _.pick(props)
    );

    const filtered = getFiltered(nodeValue || []);

    const result = selections.reduce((acc, sel) => {
      const value = getQueryResolved(sel, filtered);

      if(options.keep) {
        return  _.assoc(nodeName, value, acc)
      }

      const oldName = _.path(['name', 'value'], sel);
      const aliasName = _.path(['alias', 'value'], sel);
      const name = aliasName || oldName;
      if(!sel.selectionSet) {
        _objToGet[name] = _.prop(name, value);
      } else if(sel.arguments.length && sel.selectionSet) {
        _objToGet[name] = _.prop(name, filtered);
      }

      return _objToGet
    }, data);

    return result;
  };

  function getQueryResolved(ast, data = {}) {
    const nodeAlias = _.path(['alias', 'value'], ast);
    const oldNodeName = _.path(['name', 'value'], ast);
    const nodeName = nodeAlias ? nodeAlias : oldNodeName;
    const dataWithAlias = nodeAlias ? renameProp(oldNodeName, nodeAlias, data) : data;
    const selections = _.pathOr([], ['selectionSet', 'selections'], ast);
    const props = _.map(_.path(['name', 'value']), selections);
    const astArgs = _.propOr([], 'arguments', ast);
    const dataResolved = _.ifElse(
      _.isEmpty,
      _.always(dataWithAlias),
      getResolved({ data: dataWithAlias, nodeName })
    )(astArgs);

    const nodeValue = _.prop(nodeName, dataResolved);

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
