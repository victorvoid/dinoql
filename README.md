# dinoql

[![Build Status](https://travis-ci.org/victorvoid/dinoql.svg?branch=master)](https://travis-ci.org/victorvoid/dinoql)
[![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

A customizable GraphQL style query language for interacting with JavaScript objects. Use dinoql to traverse JavaScript objects the same way you query APIs with GraphQL. 


**Table of Contents**

- [Installation](#installation)
- [Why ?](#why-)
- [Documentation](#documentation)
  - [Getting only name from users](#getting-only-name-from-users)
  - [Get user by id](#get-user-by-id)
  - [Aliases - Renaming keys](#aliases---renaming-keys)
  - [Variables](#variables)
  - [Conditions to get fields](#conditions-to-get-fields)
  - [Resolvers](#resolvers)
    - [Order by](#order-by)
    - [Merge](#merge)
    - [Default value](#default-value)
    - [Parse to Number](#parse-to-number)
    - [Get object values](#get-object-values)
    - [Parse to array](#parse-to-array)
    - [First](#first)
    - [Last](#last)
  - [Building your own resolver](#building-your-own-resolver)
  - [Custom options](#custom-options)
    - [Keep structure](#keep-structure)
  - [Improve Performance](#improve-performance-)
- [Organizations and projects using dinoql](organizations-and-projects-using-dinoql)

## Installation

`dinoql` is available from `npm`.

```
$ npm install dinoql -S
```

## Why ?

The main objective is to use the same idea of [GraphQL](https://graphql.org/), however instead of being for API, it will be for javascript objects.

- ♥️  GraphQL syntax.
- 🔫 Safe access (no runtime errors to keys that does not exist).
- ⚡️  [Aliases](#aliases---renaming-keys) support (You can rename your keys in the query).
- 🌟 Many [resolvers](#resolvers) implemented by default.
- 🐣 [Build your own resolver](#building-your-own-resolver).
- 💥 [Fragments support](#fragments-support-)(share piece of query logic).
- 👂 [Variables support](#variables)(dynamic queries).
- 🏄 Parse your queries in build time. ([Example](https://github.com/victorvoid/dinoql/tree/master/examples/webpack))
- 🎒 [Filter values according to the value](#get-user-by-id).
- 💾 Caching support
- 🔥 [Customizable](#custom-options).

## Documentation

All examples are using this data:

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

### Getting only name from users

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

### Variables

Build dynamic queries with variables.

```js
const data = {
  users: [{
    name: 'Victor Igor',
    id: "100",
    age: 18
  }, {
    name: 'Paul Gilbert',
    id: "200",
    age: 35
  }],	
};

const variables = {
  id: "100"
};

const gql = dinoql(data, { variables })`
  users(id: $id) {
    name
  }
`

// { users: [{ name: 'Victor Igor' }] }
```

### Conditions to get fields

You can create conditions to get a field.

```js
const data = {
  dashboard {
    value: '#54'	
  },
  
  name: 'Vic'
};

const variables = {
  cond: false
};

const gql = dql(data, { variables })` 
  dashboard(if: $cond) {
    value
  },
  name
}`;

//{ name: 'Vic' }
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

#### Merge

You can merge array or objects.

##### Array
```js
import dinoql from 'dinoql'
const data = {
  requests: {
    users: [{ id: 10, age: 10 }]
  }
}

const variables = { 
  user: { id: 15, age: 40 }
}

const users = dinoql(data, { variables })`
  requests {
    users(merge: $user) {
      age
    }
  }
`

console.log(users) 

//{ users: [{ age: 10 }, { age: 40 }] }
```

##### Object

```js
import dinoql from 'dinoql'
const data = {
  requests: {
    user: { id: 10, name: 'Victor Igor' }
  }
}

const variables = { 
  user: { age: 40 }
}

const user = dinoql(data, { variables })`
  requests {
    user(merge: $user)
  }
`

console.log(user) 

//{ user: { id: 10, name: 'Victor Igor', age: 10 } }
```

#### Default value
You can add default value to keys not found or values (null/undefined).

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

#### Get object values

```js
import dinoql from 'dinoql'

const data = {
  requests: {
    user: {
      name: 'vic',
      age: 10
    }
  }
}
const gql = dinoql(data)`
  requests {
    user(getObjectValues: true)
  }
`

console.log(gql) //['vic', 10]
```

#### Parse to array


```js
import dinoql from 'dinoql'

const data = {
  requests: {
    fields: {
      field1: 'name',
      field2: 'age'
    }
  }
}

const users = dinoql(data)`
  requests {
    fields(toArray: true)
  }
`

console.log(users)  //[{ field1: 'name' }, { field2: 'age' }]
```

#### First

```js
import dinoql from 'dinoql'

const users = dinoql(data)`
  requests {
    users(first: true) {
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
    users(last: true) {
      name
    }
  }
`

console.log(users)  //{ users: { name: 'Kant Jonas' } }
```

### Building your own resolver

You can create a function to change a value in query.

```js
import dql, { addResolvers } from 'dinoql';

const incAge = (list, right) => {
  const valueToInc = Number(right);
  return list.map(item => ({ ...item, age: item.age + valueToInc }));
};

addResolvers(({ incAge }));

const value = dql(data)`
  requests {
    users(incAge: 2) {
      name,
      age
    }
  }
`;
// { users: [{ name: 'Victor Igor', age: 42 }, { name: 'Kant Jonas', age: 37 }] }
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

### Improve performance 🏄

You can improve performance parsing in build time your queries.

#### How ?

1. Create files `.graphql` or `.gql` and add your queries.

2. Import your queries from `.graphql|.gql`

```graphql
# your queries

query MyQuery {
  requests {
    users
  }
}
```

```js
//your js
import dinoql from 'dinoql'
import { MyQuery } from './MyQueries';

const users = dinoql(data)(MyQuery)
```

3. Setup your webpack - [example](https://github.com/victorvoid/dinoql/tree/master/examples/webpack)

### Fragments support 💥

You can share piece of query logic.

```graphql
fragment queryOne on Query {
  users {
    name
  }
}

fragment queryTwo on Query {
  products
}

query Form {
  requests {
    ...queryOne,
    ...queryTwo,
    friends
  }
}

```

## Organizations and projects using dinoql

⚡️ [List of organizations and projects using dinoql](https://github.com/victorvoid/dinoql/issues/15)

License
-------

The code is available under the [MIT License](LICENSE.md).
