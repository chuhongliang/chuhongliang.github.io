console.log('b 开始');
exports.done = false;
const a = require('./a.js');
console.log('在 b 中，a.done = %j', a.done, 'a.name=>', a.name);
console.log('a=>', a);

exports.name = '我是b';
exports.doSomeThing = function(){
    console.log('b.doSomeThing');
    a.doSomeThing();
}
exports.done = true;
console.log('b 结束');
console.log('a=>', a);
