>给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。
### 示例 :
```sh
输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

```js
function lengthOfLongestSubstring(s) {
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
}
```