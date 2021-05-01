
console.log('a 开始');
exports.done = false;
const b = require('./b.js');
console.log('在 a 中，b.done = %j', b.done, 'b.name=>', b.name);


exports.name = '我是a';
exports.doSomeThing = function(){
    console.log('a.doSomeThing...');
}
console.log('在a中　b=>', b);
exports.done = true;
console.log('a 结束');
console.log('在a中　b=>', b);
