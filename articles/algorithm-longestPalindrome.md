

> 给你一个字符串 s，找到 s 中最长的回文子串。

#### 示例：
```js
输入：s = "babad"
输出："bab"
解释："aba" 同样是符合题意的答案。
```

### 暴力法
```js
// 根据回文子串的定义，枚举所有长度大于等于2的子串，依次判断它们是否是回文
function longestPalindrome(s) {
	let max = 1;
	for (let x = 0; x < s.length; x++) {
		for (let y = x + 1; y < s.length; y++) {
			let temp = s.substring(x, y);
			if (temp == temp.split('').reverse().join('')) {
				max = Math.max(max, temp.length);
			}
		}
	}
	return max;
}
```

### 中心扩散法
```js
// 中心扩散法
function longestPalindrome(s) {
	let x = 1;
	let max = 1;
	while (x < s.length) {
		let temp = centerSpread(s, x, x);
		max = Math.max(max, temp.length);
		temp = centerSpread(s, x, x + 1);
		max = Math.max(max, temp.length);
		x++;
	}
	return max;
}

function centerSpread(s, l, r) {
	const len = s.length;
	while (l >= 0 && r < len) {
		if (s[l] == s[r]) {
			l--;
			r++;
		} else {
			break;
		}
	}
	return s.substring(l + 1, r);
}
```