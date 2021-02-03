
/**
 * 给定一个二进制数组， 计算其中最大连续1的个数。
 *
 * 示例 1:
 * 输入: [1,1,0,1,1,1]
 * 输出: 3
 * 解释: 开头的两位和最后的三位都是连续1，所以最大连续1的个数是 3.
 */

function maxLength(nums) {
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
	if (count != 0) max = count;
	return max;
}



/**
 * 给定一个包含 n + 1 个整数的数组 nums ，其数字都在 1 到 n 之间（包括 1 和 n），
 * 可知至少存在一个重复的整数。假设 nums 只有 一个重复的整数 ，找出 这个重复的数 。
 * 示例 1：
 * 输入：nums = [1,3,4,2,2]
 * 输出：2
 */

function duplicateNum(nums) {
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


/**
 * 给你一个数组 nums 和一个值 val，你需要 原地 移除所有数值等于 val 的元素，
 * 并返回移除后数组的新长度。不要使用额外的数组空间，你必须仅使用 O(1) 额外空间并 原地
 * 修改输入数组。元素的顺序可以改变。你不需要考虑数组中超出新长度后面的元素。
 * 示例 1：
 * 输入：nums = [3,2,2,3], val = 3
 * 输出：2, nums = [2,2]
 * 解释：函数应该返回新的长度 2, 并且 nums 中的前两个元素均为 2。
 * 你不需要考虑数组中超出新长度后面的元素。例如，函数返回的新长度为 2 ，而 nums = [2,2,3,3] 或 nums = [2,2,0,0]，也会被视作正确答案。
*/

function delVal(nums, val) {
	let l = 0, r = nums.length - 1;
	while (l < r) {
		while (l < r && nums[l] != val) l++;
		while (l < r && nums[r] === val) r--;
		nums[l] = nums[r];
		nums[r] = val;
	}
	return nums[l] === val ? l : l + 1;
}


