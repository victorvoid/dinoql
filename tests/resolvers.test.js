const dql = require('../src');

describe('[dql] resolvers', () => {
  let data = {};
  beforeEach(() => {
    data = {
      test: {
        test2: {
          test3: {
            test4: {
              test5: 10,
              box: [
                { name: { full: true }, age: 10 },
                { name: { full: false }, age: 2 }
              ]
            },
            age: 10
          }
        }
      },
      peoples: 2
    };
  });

  describe('[orderBy]', () => {
    test('should order by specific prop', () => {
      const value = dql(data)` 
      test { 
        test2 { 
          test3 { 
            test4 { 
               box(orderBy: age) {
                  name,
                  age
               }
            } 
          }
        }
      }`;

      const dataFiltered = {
        box: [
          { name: { full: false}, age: 2 },
          { name: { full: true}, age: 10 }
        ]
      };

      expect(value).toEqual(dataFiltered);
    });
  })
});

