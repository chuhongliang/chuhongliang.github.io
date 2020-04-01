## 面试遇到的算法题

### 简单的字符串压缩：aaaabbbcccdd => a4b3c3d2
```js
let strArr = str.split('');
let length = strArr.length;
let count = 0;
let tempStr = '';
let result = '';
for (let x = 0; x < length; x++) {
  if(tempStr === ''){
    tempStr = strArr[x];
    count ++;
   continue;
  }
  if (tempStr !== strArr[x]) {
    result += `${tempStr}${count}`;
    tempStr = strArr[x];
    count = 1;
  } else {
    count ++;
  }
  if(x === length - 1){
    result += `${tempStr}${count}`;
  }
}
```

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