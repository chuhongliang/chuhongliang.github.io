>把数组排成最小的数 输入一个非负整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。

#### 示例:
```sh
输入: [3,30,34,5,9]
输出: "3033459"
```

```js
function minNumber(nums) {
	nums.sort(function (a, b) {
		if (`${a}${b}` > `${b}${a}`) {
			return 1;
		} else if (`${a}${b}` < `${b}${a}`) {
			return -1;
		} else {
			return 0;
		}
	});
	return nums.join('');
}
```