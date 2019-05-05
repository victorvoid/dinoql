# dinoql
[![Build Status](https://travis-ci.org/victorvoid/dinoql.svg?branch=master)](https://travis-ci.org/victorvoid/dinoql)

A query language for JavaScript Objects using GraphQL syntax.

**Table of Contents**

- [Installation](#installation)
- [Why ?](#why-)
- [Documentation](#documentation)
  - [Getting only name from users](#getting-only-name-from-users)
  - [Get user by id](#get-user-by-id)
  - [Aliases - Renaming keys](#aliases---renaming-keys)
  - [Resolvers](#resolvers)
    - [Order by](#order-by)
    - [Default value](#default-value)
    - [Parse to Number](#parse-to-number)
    - [First](#first)
    - [Last](#last)
  - [Custom options](#custom-options)
    - [Keep structure](#keep-structure)

## Installation

`dinoql` is available from `npm`.

```
$ npm install dinoql -S
```

## Why ?

The main objective is to use the same idea of [GraphQL](https://graphql.org/), however instead of being for API, it will be for javascript objects.

- ♥️  GraphQL syntax.
- 🔫 Safe access (no runtime errors to keys that does not exist).
- ⚡️  Aliases support (You can rename your keys in the query).
- 🌟 Many resolvers implemented by default.
- 🎒 Filter values according to the value like: `users(id: 10)`.
- 🔥 Customizable.

## Documentation

All examples are using it data:

```js
const data = {
  requests: {
    products: [],
    
    users: [{
      name: 'Victor Igor',
      id: "100",
      age: 40
    }, {
      name: 'Kant Jonas',
      id: "200",
      age: 35
    }],
    
    friends: [{
      name: 'Kátia',
      id: "300",
      age: 10
    }]
  }
}
```

### Getting only name from users**

```js
import dinoql from 'dinoql'

const users = dinoql(data)`
  requests {
    users {
      name
    }
  }
`

console.log(users) //{ users: [{ name: 'Victor Igor' }, { name: 'Kant Jonas' }] }
```

### Get user by id

```js
import dinoql from 'dinoql'

const users = dinoql(data)`
  requests {
    users(id: "200") {
      name
    }
  }
`

console.log(users) //{ users: [{ name: 'Kant Jonas' }] }
```

### Aliases - Renaming keys 

```js
import dinoql from 'dinoql'

const users = dinoql(data)`
  requests {
    changeUsers: users(id: "200") {
      name
    }
  }
`

console.log(users) //{ changeUsers: [{ name: 'Kant Jonas' }] }
```

### Resolvers

Resolvers provide the instructions for turning a dinoQL operation into data.

#### Order by

```js
import dinoql from 'dinoql'

const users = dinoql(data)`
  requests {
    users(orderBy: age) {
      name,
      age
    }
  }
`

console.log(users) 

//{ users: [{ name: 'Kant Jonas', age: 35 }, { name: 'Victor Igor', age: 40 }] }
```

#### Default value

```js
import dinoql from 'dinoql'

const users = dinoql(data)`
  requests {
    notfound(defaultValue: "Hello")
  }
`

console.log(users) 

// {notfound: "Hello"}
```

#### Parse to Number

```js
import dinoql from 'dinoql'

const users = dinoql(data)`
  requests {
    users {
      id(toNumber: 1)
    }
  }
`

console.log(users)  //{ users: [{ id: 100 }, { id: 200 }] }
```

#### First

```js
import dinoql from 'dinoql'

const users = dinoql(data)`
  requests {
    users(first: 1) {
      name
    }
  }
`

console.log(users)  //{ users: { name: 'Victor Igor' } }
```

#### Last

```js
import dinoql from 'dinoql'

const users = dinoql(data)`
  requests {
    users(last: 1) {
      name
    }
  }
`

console.log(users)  //{ users: { name: 'Kant Jonas' } }
```

### Custom options

#### Keep structure

```js
import dinoql from 'dinoql'

const users = dinoql(data, { keep: true })`
  requests {
    users(id: "200") {
      name
    }
  }
`

console.log(users)
/*
{ 
 requests: { 
   users: [{ name: 'Kant Jonas' }] 
 }
} 
*/
```

License
-------

The code is available under the [MIT License](LICENSE.md).
