>给定一个包含 n + 1 个整数的数组 nums ，其数字都在 1 到 n 之间（包括 1 和 n），可知至少存在一个重复的整数。假设 nums 只有 一个重复的整数 ，找出 这个重复的数 。


### 示例：
```sh
输入：nums = [1,3,4,2,2]
输出：2
```

```js
function findDuplicate(nums) {
	const len = nums.length;
	const map = new Map();
	for (let x = 0; x < len; x++) {
		if (map.has(nums[x])) {
			return nums[x];
		} else {
			map.set(nums[x], 1);
		}
	}
	return null;
}
```