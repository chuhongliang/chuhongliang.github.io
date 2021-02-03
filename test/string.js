
function maxStr(s) {
	const len = s.length;
	const map = {};
	let x = 0, y = 0;
	let res = 0;

	while (x < len && y < len) {
		if (!map[s[y]]) {
			map[s[y]] = true;
			res = Math.max(res, y - x + 1);
			y++;
		} else {
			map[s[x]] = false;
			x++;
		}
	}
	console.log('res=>', res);
}

// maxStr('abcdcb');

// let a = 'aabb';
// console.log('a[1]', a[3]);

/**
 * 
 * 字符串压缩。利用字符重复出现的次数，编写一种方法，实现基本的字符串压缩功能。比如，
 * 字符串aabcccccaaa会变为a2b1c5a3。若“压缩”后的字符串没有变短，则返回原先的字符串。
 * 你可以假设字符串中只包含大小写英文字母（a至z）。
 * 
 * 示例1:
 * 输入："aabcccccaaa"
 * 输出："a2b1c5a3"
 */


function compressString(s) {
	let len = s.length, res = '';
	let temp = s[0];
	let count = 1;

	for (let x = 1; x < len; x++) {
		if (s[x] === temp) {
			count++;
			continue;
		}
		res += count > 1 ? `${temp}${count}` : temp;
		temp = s[x];
		count = 1;
	}

	res += count > 1 ? `${temp}${count}` : temp;
	return res;
}

// let r = compress('aaaabbbcccdccce');
// console.log('r=>', r);


let a = '968';
let b = '97';

console.log(a > b);
console.log(a < b);