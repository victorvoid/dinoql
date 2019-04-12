const R = require('ramda')
const resolvers = require('./resolvers')
const parser = require('./parser')

function getAllPropsFromQuery(context) {
  const selections = R.path(['selectionSet', 'selections'], context);
  return selections.reduce((acc, item) => {
    return acc.concat(R.path(['name', 'value'], item))
  }, [])
}

function useResolvers(context, keySelected, valueSelected, data) {
  const params = R.prop('arguments', context)

  return params.reduce((acc, param) => {
    const argName = R.path(['name', 'value'], param)
    const argValue = R.path(['value', 'value'], param)
    const getResult = R.prop(argName, resolvers)
    const result = getResult(valueSelected, argValue)

    return R.assoc(keySelected, result, acc)
  }, data)
}

function dinoql(data) {
  return (query) => {
    const parsed = parser(R.prop(0, query))
    const selections = R.path(['definitions', 0, 'selectionSet', 'selections', 0], parsed)
    const keySelected = R.path(['name', 'value'], selections)
    const valueSelected = R.prop(keySelected, data)
    const newData = useResolvers(selections, keySelected, valueSelected, data);
    const propsToGet = getAllPropsFromQuery(selections);
    const valueFiltered = R.prop(keySelected, newData)
    const dataFiltered = R.project(propsToGet, valueFiltered);
    return dataFiltered
  }
}

module.exports = dinoql;
