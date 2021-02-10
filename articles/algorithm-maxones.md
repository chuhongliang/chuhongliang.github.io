> 给定一个二进制数组， 计算其中最大连续1的个数。

### 示例 1:
```sh
输入: [1,1,0,1,1,1,0,0,1]
输出: 3
解释: 开头的两位和最后的三位都是连续1，所以最大连续1的个数是 3.
```
 
```js
function findMaxConsecutiveOnes(nums) {
	const len = nums.length;
	let max, count = 0;
	for (let x = 0; x < len; x++) {
		if (nums[x] === 1) {
			count++;
			continue;
		}
		max = max > count ? max : count;
		count = 0;
	}
	if (count != 0) max = max > count ? max : count;
	return max;
}
```