const dinoql = require('../src');

const data = {
  MyQuery: {
    users: [
      { name: 'Jorge', age: 3, active: true, cards: [{ toggle: 'top', test: [{ abra: true }] }] },
      { name: 'Maria', age: 1, active: true, cards: [{ toggle: 'top', test: [{ abra: true }] }] }
    ],

    peoples: 2
  }
}

const u = dinoql(data)`
  users(orderBy: age) {
    cards {
      toggle,
    }
  },
  
  peoples
`

console.log(u);