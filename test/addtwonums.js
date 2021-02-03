/**
 * 给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，
 * 并且每个节点只能存储 一位 数字。请你将两个数相加，并以相同形式返回一个表示和的链表。
 * 可以假设除了数字 0 之外，这两个数都不会以 0 开头。
 *
 * 输入：l1 = [2,4,3], l2 = [5,6,4]
 * 输出：[7,0,8]
 * 解释：342 + 465 = 807.
 */


function addTwoNums(l1, l2) {
	const res = [];
	let len = l1.length > l2.length ? l1.length : l2.length;
	let digit = 0;
	for (let x = 0; x < len; x++) {
		let num1 = l1[x] || 0;
		let num2 = l2[x] || 0;
		num1 += digit;
		let total = num1 + num2;
		digit = Math.floor(total / 10);
		res.push(total % 10);
	}
	if (digit != 0) res.push(digit);
	return res;
}

function addTwoNums(l1, l2) {
	let num1 = l1.shift() || 0;
	let num2 = l2.shift() || 0;
	let total = num1 + num2;
	let digit = Math.floor(total / 10);
	let res = [];
	res.push(total % 10);
	if (l1[0] || l2[0] || digit != 0) {
		if (!l1[0]) l1[0] = 0;
		if (!l2[0]) l2[0] = 0;
		l1[0] += digit;
		addTwoNums(l1, l2).forEach(num => {
			res.push(num);
		});
	}
	return res;
}


// let r = addTwoNums([2, 4, 3], [5, 6, 4]);
let r = addTwoNums([9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]);
console.log('r=>', r);

// console.log('18/10=>', Math.floor(18 / 10));
// console.log('18%10=>', 18 % 10);
// console.log('[].pop()=>', [1, 2].shift());