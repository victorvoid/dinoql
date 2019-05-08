import dinoql from '../../src';
import { Form } from './query.graphql';

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
};

//it works
// const user = dinoql(data, { keep: true })`
//   requests {
//     friends
//   }
// `;

const user = dinoql(data)(Form);
console.log(user);
// { friends: [ { name: 'Kátia', id: '300', age: 10 } ],
//   users: [ { name: 'Victor Igor' }, { name: 'Kant Jonas' } ],
//   products: [] }
