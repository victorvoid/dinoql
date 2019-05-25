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

    test('should work with multiples getObjectValue', () => {
      const newdata = {
        data: {
          item1: { name: 'Vic', age: 10, users: { name1: { fill: '10', active: false }, name2: { fill: '20' }}},
          item2: { name: 'Jao', age: 12},
          item3: { name: 'Mar', age: 14},
        }
      };

      const value = dql(newdata)` 
        data(getObjectValues: true)  {
          name,
          users(getObjectValues: true) {
            fill(toNumber: true)
          }
        }`;

      const dataParsed = {
        data: [
          { name: 'Vic', users:[{ fill: 10 }, { fill: 20}]},
          { name: 'Jao'},
          { name: 'Mar'},
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

    test('should get fields only if condition is false', () => {
      const value = dql(data)` 
        test { 
          test2 { 
            test3 {
              test4(unless: false) {
                test5
              }
            }
          }
        }`;

      expect(value).toEqual({ test5: 10 });
    });
  })

  describe('[merge]', () => {
    test('should merge two objects', () => {
      const newdata = {
        requests: {
          user: { name: 'vic' }
        }
      };

      const variables = {
        newUser: { age: 10 }
      };

      const value = dql(newdata, { variables })` 
        requests {
          user(merge: $newUser)
        }
      `;

      expect(value).toEqual({ user: { name: 'vic', age: 10 }})
    });

    test('should merge two arrays', () => {
      const newdata = {
        requests: {
          users: [{ id: 10 }, { id: 12 }]
        }
      };

      const variables = {
        newUser: [{ id: 20}]
      };

      const value = dql(newdata, { variables })` 
        requests {
          users(id: 10, merge: $newUser)
        }
      `;

      expect(value).toEqual({ users: [{ id: 10 }, { id: 20 }] })
    });
  });

  describe('[getProp]', () => {
    test('should return the obj with various data', () => {
      const newData = {
        requests: {
          users: { id: 10, name: 'Victor Fellype' },
          information: { 
            title: { text: 'my title' }, 
            description: { text: 'my description' } 
          }
        }
      };

      const data = dql(newData)`
        requests {
          users(getProp: name)
          information {
            title(getProp: text)
            description(getProp: text)
          }
        }
      `

      expect(data).toEqual({ users: 'Victor Fellype', title: 'my title', description: 'my description' });
    });

    test('should return a void obj {}', () => {
      const newData = {
        requests: {
          users: { name: 'Victor Fellype' },
        }
      };

      const value = dql(newData)`
        requests {
          users(getProp: id)
        }
      `

      expect(value).toEqual({});
    });
  });

  describe('[getPath]', () => {
    test('should return a obj with one array and multiples objs', () => {
      const newData = {
        requests: {
          cms: {
            footer_data: {
              social_networks: [
                { name: 'facebook', url: 'facebook.com' },
                { name: 'instagram', url: 'instagram.com' }
              ]
            }
          }
        }
      };

      const socialNetworks = dql(newData)`
        requests(getPath: "cms.footer_data.social_networks")
      `

      expect(socialNetworks).toEqual({
        requests: [
          { name: 'facebook', url: 'facebook.com' },
          { name: 'instagram', url: 'instagram.com' }
        ]
      });
    });

    test('should return a void obj {}', () => {
      const newData = {
        requests: {
          cms: {
            footer_data: {
              media: []
            }
          }
        }
      };

      const socialMedia = dql(newData)`
        requests(getPath: "cms.footer_data.social_networks")
      `

      expect(socialMedia).toEqual({});
    });
  });

});

