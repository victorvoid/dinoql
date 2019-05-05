const dql = require('../src');

describe('[dql] { keep: false }', () => {
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

  test('should return only values', () => {
    const value = dql(data)` 
      test { 
        test2 { 
          test3 { 
            test4 { 
               test5
            },
            age
          },
        }
      }`;

    const dataFiltered = {
      test5: 10,
      age: 10
    };

    expect(value).toEqual(dataFiltered)
  });

  test('should return only values using aliases', () => {
    const value = dql(data)` 
      test { 
        test2 { 
          test3 { 
            test4 { 
               test5
            },
            ageChanged: age
          },
        }
      }`;

    const dataFiltered = {
      test5: 10,
      ageChanged: 10
    };

    expect(value).toEqual(dataFiltered)
  });

  test('should return only values using defaultValue', () => {
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


  test('should return empty array to keys not found', () => {
    const value = dql(data)` 
      test { 
        testdsjj { 
          testsdjsjk { 
            test4skdjsdsj { 
               test5sldksldks
            } 
          }
        }
      }`;

    expect(value).toEqual({testdsjj: []})
  })

  test('should get error when resolver does not exist', () => {
    try {
      const value = dql(data)` 
      test { 
        test1(defaultValue: 10, rskkskksks: 10)
      }`;
    } catch(e){
      expect(e.message).toBe('Resolver "rskkskksks" does not exist.');
    }
  })

  test('should works in arrays', () => {
    const newdata = {
      users: [{
        name: 'Victor Igor',
        id: "100",
        age: 40
      }, {
        name: 'Kant Jonas',
        id: "200",
        age: 35
      }]
    };

    const value = dql(newdata)`
      newUsers: users(id: "200") {
        name  
      }
    `;

    const dataFiltered = {
      newUsers: [{ name: 'Kant Jonas' }]
    };

    expect(value).toEqual(dataFiltered);
  })
});

