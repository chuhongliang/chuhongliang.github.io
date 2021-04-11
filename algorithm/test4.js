/**
在柠檬水摊上，每一杯柠檬水的售价为 5 美元。
顾客排队购买你的产品，（按账单 bills 支付的顺序）一次购买一杯。
每位顾客只买一杯柠檬水，然后向你付 5 美元、10 美元或 20 美元。你必须给每个顾客正确找零，也就是说净交易是每位顾客向你支付 5 美元。
注意，一开始你手头没有任何零钱。
如果你能给每位顾客正确找零，返回 true ，否则返回 false 。
*/

var lemonadeChange = function(bills) {
    var five = 0, ten = 0;
    while (bills.length > 0) {
        var bill = bills.shift();
        if (bill === 5) { five++; }
        else if (bill === 10) { five--; ten++; }
        else if (ten > 0) { five--; ten--; }
        else { five -= 3; }
        if (five < 0) return false;
    }
    return true;
};

/** 有效的山脉数组
给定一个整数数组 arr，如果它是有效的山脉数组就返回 true，否则返回 false。
让我们回顾一下，如果 A 满足下述条件，那么它是一个山脉数组：

arr.length >= 3
在 0 < i < arr.length - 1 条件下，存在 i 使得：
arr[0] < arr[1] < ... arr[i-1] < arr[i]
arr[i] > arr[i+1] > ... > arr[arr.length - 1]

示例 1：
输入：arr = [2,1]
输出：false

示例 2：
输入：arr = [3,5,5]
输出：false

示例 3：
输入：arr = [0,3,2,1]
输出：true
*/

var validMountainArray = function(arr) {
    var up = true;
    for(var x=1;x<arr.length;x++){
        if (arr[x] === arr[x - 1] || arr[x] === arr[x + 1]) return false;
        if (up === true && arr[x] > arr[x - 1]) { continue; }
        else if (up === true && arr[x] < arr[x - 1]) { up = false; }
        else if (up === false && arr[x] > arr[x - 1]) { return false; }
    }
    return true;
};

/**
给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。

岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。

此外，你可以假设该网格的四条边均被水包围。

示例 1：

输入：grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
输出：1
示例 2：

输入：grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
输出：3

 */

var numIslands = function(grid) {
    var landNum = 0;
    var map = {};
    for (var x = 0; x < grid.length; x++) {
        var row = grid[x];
        for (var y = 0; y < row.length; y++) {
            if (Number(row[y]) === 0) continue;
            var curId = x + '_' + y;
            var left = 0, up = 0;
            if (y > 0) { left = row[y - 1]; }
            if (x > 0) { up = grid[x - 1][y]; }
            if (Number(left) === 1) {
                var leftId = x + '_' + y - 1;
                var land = map[leftId];
                map[curId] = land;
            } else if (Number(up) === 1) {
                var upId = x - 1 + '_' + y;
                var land = map[upId];
                map[curId] = land;
            } else {
                landNum++;
                map[curId] = landNum;
            }
        }
    }
    return landNum;
};

/**
 编写一个算法来判断一个数 n 是不是快乐数。

「快乐数」定义为：

对于一个正整数，每一次将该数替换为它每个位置上的数字的平方和。
然后重复这个过程直到这个数变为 1，也可能是 无限循环 但始终变不到 1。
如果 可以变为  1，那么这个数就是快乐数。
如果 n 是快乐数就返回 true ；不是，则返回 false 。

 

示例 1：

输入：19
输出：true
解释：
12 + 92 = 82
82 + 22 = 68
62 + 82 = 100
12 + 02 + 02 = 1
示例 2：

输入：n = 2
输出：false

 */

var isHappy = function(n) {
    var map = {};  
    while(n != 1){
        arr = n.toString().split('');
        var temp = 0;
        for(var x=0;x<arr.length;x++){
            temp += (arr[x] * arr[x]);
        }
        if(map[temp]) return false;
        map[temp] = true;
        n = temp;
    }
    return true;
};


