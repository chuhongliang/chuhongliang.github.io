console.log('main 开始');
const a = require('./a.js');
const b = require('./b.js');
console.log('在 main 中，a.done=%j，b.done=%j', a.done, b.done);

// b.doSomeThing();

// console.log('require.main=>', require.main);

// console.log('require.cache=>', require.cache);