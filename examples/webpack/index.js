import dinoql from '../../src';
import { Form } from './query.graphql';

const data = {
  requests: {
    products: [{ test: 0, other: false}],

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
};

//it works
// const user = dinoql(data, { keep: true })`
//   requests {
//     friends
//   }
// `;

const variables = {
  id: "200"
};

const user = dinoql(data, { variables })(Form);
console.log(user);
// { products: [ { test: 0 } ], users: [ { name: 'Kant Jonas' } ] }
