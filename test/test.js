

var arr = [9, 5, 7, 1, 2, 3];

function bubbleSort(arr) {
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
        for(var j=0; j<len-1-i;j++){
            console.log('j=>', j);
            if(arr[j] > arr[j+1]){
                var temp = arr[j+1];
                arr[j+1] = arr[j];
                arr[j] = temp;
            }
        }
        console.log('arr=>', arr);
    }
    return arr;
}
// console.log('arr=>', bubbleSort(arr));




function insertionSort(arr) {
    var len = arr.length;
    var preIndex, current;
    for (var i = 1; i < len; i++) {
        console.log('i=>', i);
        preIndex = i - 1;
        current = arr[i];
        console.log('current=>', current);
        while(preIndex >= 0 && arr[preIndex] > current) {
            arr[preIndex+1] = arr[preIndex];
            preIndex--;
            console.log('arr=>', arr);
        }
        arr[preIndex+1] = current;
        console.log('arr=>', arr);
    }
    return arr;
}

// console.log('arr=>', insertionSort(arr));


function merge(left, right)
{
    var result = [];
 
    while (left.length && right.length) {
        if (left[0] <= right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }
 
    while (left.length)
        result.push(left.shift());
 
    while (right.length)
        result.push(right.shift());
 
    return result;
}

function mergeSort(arr) {  // 采用自上而下的递归方法
    console.log('arr=>', arr);
    var len = arr.length;
    if(len < 2) {
        return arr;
    }
    var middle = Math.floor(len / 2),
        left = arr.slice(0, middle),
        right = arr.slice(middle);
    return merge(mergeSort(left), mergeSort(right));
}


