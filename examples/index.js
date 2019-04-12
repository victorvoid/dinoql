const dinoql = require('../src');

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
    age,
    active
  }
`