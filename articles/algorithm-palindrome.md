>给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false 。
回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。例如，121 是回文，而 123 不是。

#### 示例 1：
```js
输入：x = 121
输出：true
```


### 反转法：
```js
function isPalindrome(n) {
	let s1 = n.toString();
	let s2 = s1.split('').reverse().join('');
	if (s == s2) {
		return true;
	}
	return false;
}
```

### 用栈的方式：
```js
function isPalindrome(n) {
	let s = n.toString();
	let array = s.split('');
	for (let x = 0; x < s.length; x++) {
		let temp = array.pop();
		if (s[x] != temp) {
			return false;
		}
	}
	return true;
}
```

### 双指针法：
```js
function isPalindrome(n) {
	let s = n.toString();
	let x = 0; y = s.length - 1;
	while (x < y) {
		if (s[x] == s[y]) {
			x++;
			y--;
		} else {
			return false;
		}
	}
	return true;
}
```

