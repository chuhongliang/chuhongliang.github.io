## 面试遇到的算法题

### 简单的字符串压缩：aaaabbbcccdd => a4b3c3d2
```js
let str = 'aaaabbbcccdd';
let strArr = str.split('');
let obj = {};
strArr.forEach(function (item) {
	if (item in obj) {
		obj[item]++;
	} else {
		obj[item] = 1;
	}
});

let sb = '';
for (let key in obj) {
	sb = `${sb}${key}${obj[key]}`;
}
console.log('sb=>', sb);//a4b3c3d2
```


> 输入一个非负整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。
### 实现把数组里的值排成最大值：[3, 45, 67, 90, 22, 101] => 906745322101
```js
let arr = [3, 45, 67, 90, 22, 101];

function desc(item1, item2) {
  let item1Arr = item1.toString().split('');
  let item2Arr = item2.toString().split('');
  return compare(item1Arr, item2Arr);
}

function compare(arr1, arr2) {
  let length = arr1.length < arr2.length ? arr1.length : arr2.length;
  for (let x = 0; x < length; x++) {
    if (arr1[x] > arr2[x]) {
      return -1;
    } else if (arr1[x] < arr2[x]) {
      return 1;
    } else {
      if (x == (length - 1)) {
        return 0;
      }
     continue;
    }
  }
}
arr.sort(desc);
```