const { dql, dqlGet } = require('../src');

const data = {
    users: {
        test: {
            jorge: {
                nome: {
                    caixa: 10,
                    box: true
                },
                idade: 10
            },
            mateus: {
                nome: 'mateus',
                idade: 10
            }
        }
    },

    peoples: 2
}

const u = dqlGet(data)`
  users(orderBy: age) {
    test {
        jorge {
            nome {
                box
            }
        }
    }
  }
`

// const res = u.users[0].cards[0];
const res = u;

console.log('from example: ', res)
