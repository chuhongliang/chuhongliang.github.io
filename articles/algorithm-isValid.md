
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。

左括号必须以正确的顺序闭合。

```sh
示例 ：
输入：s = "()"
输出：true
```
```js
function isValid(s) {
	const array = [];
	const map = {
		'(': ')',
		'[': ']',
		'{': '}',
	}
	const len = s.length;
	for (let x = 0; x < len; x++) {
		if (s[x] in map) {
			array.push(s[x]);
		} else {
			let temp = array.pop();
			if (s[x] != map[temp]) {
				return false;
			}
		}
	}
	return true;
}
```