const R = require('ramda')
const resolvers = require('./resolvers')
const parser = require('./parser')

function dinoql(data) {
  return (query) => {
    const parsed = parser(R.prop(0, query))
    const selections = R.path(['definitions', 0, 'selectionSet', 'selections', 0], parsed)

    const arguments = R.prop('arguments', selections)
    const objKey = R.path(['name', 'value'], selections)

    const valueFromData = R.prop(objKey, data)

    return arguments.reduce((acc, arg) => {
      const name = R.path(['name', 'value'], arg)
      const value = R.path(['value', 'value'], arg)
      const fun = R.prop(name, resolvers)
      const result = fun(valueFromData, value)

      return R.assoc(objKey, result, acc)
    }, data)
  }
}

const data = {
  users: [
    { name: 'Jorge', age: 3, active: true },
    { name: 'Maria', age: 1, active: true }
  ],

  peoples: 2
}

const u = dinoql(data)`
  users(orderBy: age) {
    name,
    age
  }
`

console.log(u);
