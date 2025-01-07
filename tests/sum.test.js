/* 
Yes, you can absolutely have sum.js in one folder and sum.test.js in another. 
The test file does not have to be in the same folder as the implementation file. 
It depends on your preferred project structure and the testing framework you're using.
*/



/* 

// How it looks:
const sum = require('./sum') // sum.js must export this fn like: module.exports = sum


// Version 1
test('Adds 1 + 2 to equal 3 (this is a description)', () => {
    expect(sum(1,2)).toEqual(3)
})


// run these tests like  "npm run test"  and it will run all tests


// Version 2
describe('what youre testing here (overall description)', () => {
    it('should be a function', () => { // describe each case like that
        expect(typeof sum).toEqual('function')
        // there can be more 'expect' statements here to test all possibilities for a single case
        // instead of .toEqual() there are also .toBeTruthy() and .toBeFalsy()
    })
    it('should return a number', () => {
        expect(typeof sum(1,2)).toEqual('number')
    })
})




/* 
if you want to use assert() instead of expect(), you need to bring in: const assert = require('assert')     assert is a core Node.js module
assert.deepEqual(sum(1,2), 3)    // 3 here is what sum(1,2) should be equal to
does the same thing as 'expect' essentially
*/



/* 
testing is done in Node.js environment -- if you want to test some DOM functionality, you need to bring in an additional package
npm i -D jest-environment-jsdom
to use it, you need to add some configuration: jest.config.js    and in that file: 
    module.exports config = {
        testEnvironment: 'jsdom'
    }
and then in your test files you can create mock-DOM elements just like how you do on the front-end:  document.createElement('div')   and .appendChild()
you can do it (create elements and run 'expect') inside the callback function of the 'it' statements
*/