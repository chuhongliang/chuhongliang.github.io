

/**
 *
 * 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 的那 两个 整数，
 * 并返回它们的数组下标。你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能
 * 使用两遍。你可以按任意顺序返回答案。
 * 输入：nums = [2,7,11,15], target = 9
 * 输出：[0,1]
 * 解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
 */

// 双指针方式
function twoSum(nums, target) {
	for (let x = 0; x < nums.length; x++) {
		for (let y = x + 1; y < nums.length; y++) {
			if ((nums[x] + nums[y]) === target) {
				return [x, y];
			}
		}
	}
	return [];
}

// map方式
function twoSum(nums, target) {
	const map = new Map();
	for (let x = 0; x < nums.length; x++) {
		let diff = target - nums[x];
		if (map.has(diff)) {
			return [x, map.get(diff)];
		} else {
			map.set(nums[x], x);
		}
	}
	return [];
}

const result = twoSum([2, 7, 11, 15], 9);
console.log('result=>', result);

