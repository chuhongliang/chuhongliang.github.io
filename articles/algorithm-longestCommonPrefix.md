编写一个函数来查找字符串数组中的最长公共前缀。

如果不存在公共前缀，返回空字符串 ""。

#### 示例：
```sh
输入：strs = ["flower","flow","flight"]
输出："fl"
```

```js
function longestCommonPrefix(strs) {
	const len = strs.length;
	const s = strs[0];
	let res = ''
	for (let x = 0; x < s.length; x++) {
		for (let y = 1; y < len; y++) {
			if (s[x] != strs[y][x]) {
				return res;
			}
		}
		res += s[x];
	}
	return res;
}
```