const dinoql = require('../src');

const data = {
    users: [
      { name: 'Jorge', age: 3, active: true, cards: [{ toggle: 'top', test: [{ abra: {name: 'Jorge', idade: 10}, mat: true }] }] },
      { name: 'Maria', age: 1, active: true, cards: [{ toggle: 'top', test: [{ abra: true , mat: true}] }] }
    ],

    peoples: 2
}

const u = dinoql(data)`
  users(orderBy: age) {
    cards {
      toggle,
      test {
        abra {
          name
        }
      }
    }
  }
`

console.log(u);