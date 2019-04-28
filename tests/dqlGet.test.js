const { dqlGet } = require('../src');

describe('[dqlGet]', () => {
  let data = {};
  beforeEach(() => {
    data = {
      test: {
        test2: {
          test3: {
            test4: {
              test5: 10,
              box: true
            },
            age: 10
          }
        }
      },
      peoples: 2
    };
  });

  test('should return only values', () => {

    const value = dqlGet(data)` 
      test { 
        test2 { 
          test3 { 
            test4 { 
               test5
            } 
          }
        }
      }`

    expect(value).toBe(10)
  });


  test('should return undefined to keys not found', () => {
    const value = dqlGet(data)` 
      test { 
        testdsjj { 
          testsdjsjk { 
            test4skdjsdsj { 
               test5sldksldks
            } 
          }
        }
      }`

    expect(value).toBeUndefined()
  })
});

