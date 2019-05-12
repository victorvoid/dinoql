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
          },
          id: "20"
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
  });

  describe('[parseInt]', () => {
    test('should parse to integer', () => {
      const value = dql(data)` 
      test { 
        test2 { 
          id(toNumber: true)
        }
      }`;

      const dataParsed = {
        id: 20
      };

      expect(value).toEqual(dataParsed);
    });
  })

  describe('[parse to array]', () => {
    test('should parse to array', () => {
      const value = dql(data)` 
      test { 
        test2 { 
          test3 {
            test4(toArray: true)
          }
        }
      }`;

      const dataParsed = {
        test4: [
          {test5: 10},
          {box: [{name: {full: true}, age: 10}, {name: {full: false}, age: 2}]}
        ]
      };

      expect(value).toEqual(dataParsed);
    });
  })

  describe('[default value]', () => {
    test('should return defaultValue when key does not found', () => {
      const value = dql(data)` 
      test { 
        test2 { 
          test3 { 
            test4 { 
               test5
            },
            notfound(defaultValue: 10)
          },
        }
      }`;

      const dataFiltered = {
        test5: 10,
        notfound: 10
      };

      expect(value).toEqual(dataFiltered)
    });

    test('should return defaultValue when value is null or undefined', () => {
      const newdata = {
        requests: {
          hoy: null
        }
      };

      const value = dql(newdata)`
        requests {
          hoy(defaultValue: 10)
        }
      `;

      expect(value).toEqual({ hoy: 10 });
    });
  });

  describe('[Get only values from object]', () => {
    test('should get only values form object', () => {
      const value = dql(data)` 
      test { 
        test2 { 
          test3 {
            test4(getObjectValues: true)
          }
        }
      }`;

      const dataParsed = {
        test4: [
          10,
          [{name: {full: true}, age: 10}, {name: {full: false}, age: 2}]
        ]
      };

      expect(value).toEqual(dataParsed);
    });
  })

  describe('[Condition resolvers]', () => {
    test('should get fields only if condition is true', () => {
      const value = dql(data)` 
        test { 
          test2 { 
            test3 {
              test4(if: true) {
                test5
              }
            }
          }
        }`;

      expect(value).toEqual({ test5: 10 });
    });

    test('shouldn\'t get fields only if condition is false', () => {
      const value = dql(data)` 
        test { 
          test2 { 
            test3 {
              test4(if: false) {
                test5
              }
            }
          }
        }`;

      expect(value).toEqual({});
    });

    test('should get value from variable and get fields when is true', () => {
      const variables = {
        cond: true
      };

      const value = dql(data, { variables })` 
        test { 
          test2 { 
            test3 {
              test4(if: $cond) {
                test5
              }
            }
          }
        }`;

      expect(value).toEqual({ test5: 10});
    });

    test('shouldn\'t get value from variable and get fields when is false', () => {
      const variables = {
        cond: false
      };

      const value = dql(data, { variables })` 
        test { 
          test2 { 
            test3 {
              test4(if: $cond) {
                test5
              }
            }
          }
        }`;

      expect(value).toEqual({});
    });
  })
});

