const dql = require('../src');

describe('[dql] resolvers { keep: true }', () => {
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
      const value = dql(data, { keep: true })` 
      test { 
        test2 { 
          test3 { 
            test4 { 
               box(orderBy: age) {
                  name
               }
            } 
          }
        }
      }`;

      const dataOrdered = {
        test: {
          test2: {
            test3: {
              test4: {
                box: [
                  { name: { full: false } },
                  { name: { full: true } }
                ]
              }
            }
          }
        }
      };

      expect(value).toEqual(dataOrdered);
    });
  })

  describe('[first]', () => {
    test('should get first item from array', () => {
      const value = dql(data, { keep: true })` 
      test { 
        test2 { 
          test3 { 
            test4 { 
               box(first: 1) {
                  name,
                  age
               }
            } 
          }
        }
      }`;

      const dataFiltered = {
        test: {
          test2: {
            test3: {
              test4: {
                box: {
                  name: { full: true },
                  age: 10
                }
              }
            }
          }
        }
      };

      expect(value).toEqual(dataFiltered);
    });
  })

  describe('[last]', () => {
    test('should get last item from array', () => {
      const value = dql(data, { keep: true })` 
      test { 
        test2 { 
          test3 { 
            test4 { 
               box(last: 1) {
                  name,
                  age
               }
            } 
          }
        }
      }`;

      const dataFiltered = {
        test: {
          test2: {
            test3: {
              test4: {
                box: {
                  name: { full: false },
                  age: 2
                }
              }
            }
          }
        }
      };

      expect(value).toEqual(dataFiltered);
    });
  });
});

