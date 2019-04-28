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
const { ql } = require('dinoql')

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

const value = ql(data)`
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
 
 /*
 { api: {
    link: {
      data: {
        user: {
          name: 'Dino saur'
        }
      }
    }
  } }
 */
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

## Arrays Support


```javascript
const { ql } = require('dinoql')

const data = {
  api: {
    link: {
      data: {
        users: [{
          name: 'Dino saur',
          age: 1000000,
          status: true
        }]
      }
    },
    link2: {
      data: {
        users: [{
          name: 'Victor Igor',
          age: 20,
          status: true
        }]
      }
    }
  }
}

const value = ql(data)`
  api {
    link {
      data {
        users {
          name
        }
      }
    }
  }
`
 
 console.log(value)
 
 /*
 { api: {
    link: {
      data: {
        users: [{
          name: 'Dino saur'
        }]
      }
    }
  } }
 */
```


