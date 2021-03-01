
// 隐式转换规则
// 1. 转成string类型： +（字符串连接符） 
// 2.转成number类型：++/--(自增自减运算符) + - * / %(算术运算符) > < >= <= == != === !=== (关系运算符)
// 3. 转成boolean类型：!（逻辑非运算符）

// 坑一 字符串连接符与算术运算符隐式转换规则混淆
// 坑二 关系运算符：会把其他数据类型转换成number之后再比较关系
// 坑三 复杂数据类型在隐式转换时会先转成String，然后再转成Number运算


// + 号是字符串连接符，会把其它类型转成String
console.log(1 + 'true'); // '1true'

// + 号是自述运算符， 会把其它类型转成Number
console.log(1 + true);   // 2
console.log(1 + undefined); // NaN
console.log(1 + null); // 1


console.log(String(1) + 'true'); // '1true'
console.log(1 + Number(true));   // 2
console.log(1 + Number(undefined)); // NaN
console.log(1 + Number(null)); // 1


console.log('--------------- String ---------------------');
console.log(String(true)); // 'true'
console.log(String(undefined)); // 'undefined'
console.log(String(null)); // 0
console.log(String(NaN)); // 'NaN'
console.log(String([])); // ''
console.log(String({})); // '[object Object]'
console.log(String(function(){})); // NaN


console.log('--------------- Number ---------------------');
console.log(Number('')); // 0
console.log(Number(true)); // 1
console.log(Number(undefined)); // NaN
console.log(Number(null)); // 0
console.log(Number(NaN)); // NaN
console.log(Number([])); // 0
console.log(Number({})); // NaN
console.log(Number(function(){})); // NaN

console.log('--------------- Boolean ---------------------');
console.log(Boolean('')); // 0
console.log(Boolean(undefined)); // NaN
console.log(Boolean(null)); // 0
console.log(Boolean([])); // true
console.log(Boolean({})); // true
console.log(Boolean(function(){})); //true

console.log('-------------------- undefined ----------------------');
console.log(undefined == undefined);// true
console.log(undefined == NaN); // false
console.log(undefined == null); // true
console.log(undefined == false); // false



console.log('-------------------- null ----------------------');
console.log(null == null); // true
console.log(null == undefined); // true
console.log(null == false); // false
console.log(null == NaN);  // false



console.log('-------------------- 大坑 ----------------------');
console.log([] == 0);  // false
console.log(![] == 0);  // false


console.log('-------------------- 神坑 ----------------------');
console.log([] == ![]);  // true  [].valueOf.toString() = 0;   ![] = false = 0; 所以相等
console.log([] == []);  // false  引用数据类型比较 地址不相等。


console.log('-------------------- 天坑 ----------------------');
console.log({} == !{});  // false  {}.valueOf.toString() = [object Object];  !{} = false = 0;
console.log({} == {});  // false


console.log([1, 2] == '1,2'); // true
console.log([1, 2].valueOf()); // [1, 2];


console.log([3, 4] > 3); // false
console.log([3, 4] > '3'); // true
