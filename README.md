# dinoql
[![Build Status](https://travis-ci.org/victorvoid/dinoql.svg?branch=master)](https://travis-ci.org/victorvoid/dinoql)

A query language for JavaScript Objects using GraphQL syntax.

## Installation

`dinoql` is available from `npm`.

```
$ npm install dinoql -S
```

## Documentation

### ql

You can keep the structure of the object.

```javascript
import { ql } from "dinoql"

const data = {
  api: {
    users: [
      { name: 'Victor Igor', age: 20, status: true }, 
      { name: 'Matheus', age: 25, status: false }
    ],
    company: true,
    features: [],
    feedback: []
  }
}

const users = ql(data)`
  api {
  	users(orderBy: age) {
    	name
    }
  }
`

console.log(users)
//{ api: { users: [{ name: 'Victor Igor' }, { name: 'Matheus' }] } }
```

### qlGet

You can only get the value.

```javascript
const { qlGet } = require('dinoql')

const data = {
  api: {
    link: {
      data: {
        user: {
          name: 'Dino saur',
          age: 1000000,
          status: true
        }
      }
    },
    link2: {
      data: {
        user: {
          name: 'Victor Igor',
          age: 20,
          status: true
        }
      }
    }
  }
}

const value = qlGet(data)`
  api {
    link {
      data {
        user {
          name
        }
      }
    }
  }
`
 
 console.log(value)
 //Dino saur
```

License
-------

The code is available under the [MIT License](LICENSE.md).
