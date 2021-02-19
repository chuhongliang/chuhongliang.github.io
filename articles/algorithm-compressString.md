>字符串压缩。利用字符重复出现的次数，编写一种方法，实现基本的字符串压缩功能。比如，
字符串aabcccccaaa会变为a2b1c5a3。若“压缩”后的字符串没有变短，则返回原先的字符串。
你可以假设字符串中只包含大小写英文字母（a至z）。
 
#### 示例:
```sh
输入："aabcccccaaa"
输出："a2b1c5a3"
```

```js
function compressString(s) {
	let len = s.length, res = '';
	let temp = s[0];
	let count = 1;
	for (let x = 1; x < len; x++) {
		if (s[x] === temp) {
			count++;
			continue;
		}
		res += `${temp}${count}`;
		temp = s[x];
		count = 1;
	}
	res += `${temp}${count}`;
	return res;
}
```