const { dql } = require('../src');

describe('[dql]', () => {
  let data = {};
  beforeEach(() => {
    data = {
      test: {
        test2: {
          test3: {
            test4: {
              test5: 10,
              box: [{ name: { full: true }, age: 10 }]
            },
            age: 10
          }
        }
      },
      peoples: 2
    };
  });

  test('should return full object structure', () => {
    const value = dql(data)` 
      test { 
        test2 { 
          test3 { 
            test4 { 
               test5
            } 
          }
        }
      }`;

    expect(value).toEqual({ test: { test2: {test3: {test4: { test5: 10}}}}});
  });

  test('should works in arrays', () => {
    const value = dql(data)` 
      test { 
        test2 { 
          test3 { 
            test4 { 
              box {
                name
              }
            } 
          }
        }
      }`;

    expect(value).toEqual({ test: { test2: {test3: {test4: { box: [{ name: { full: true } }]}}}}});
  });


  test('should return key if is not found', () => {
    const value = dql(data)` 
      test { 
        testdsjj
      }`;

    expect(value).toEqual({ test: {} });
  });
});

