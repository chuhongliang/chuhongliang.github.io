
let arr = [1, -3, 3, -1, 4, 5];
/**
 * previousValue: 表示上一次调用回调时的返回值，或者初始值 init
 * currentValue: 表示当前正在处理的数组元素
 * currentIndex: 表示当前正在处理的数组元素的索引，若提供 init 值，则索引为0，否则索引为1；
 * array: 原数组
 */
let result = arr.reduce((previousValue, currentValue) => {
	return previousValue + currentValue;
});
console.log(result);// 9