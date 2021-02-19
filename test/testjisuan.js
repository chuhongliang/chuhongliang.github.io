
var array = [258, 281, 270, 298, 267, 281, 268, 276, 266, 289, 279, 358, 340, 374, 340, 449, 370, 385, 381, 395, 390, 401, 382];

var desc = []; // 历史最大回撤
var asc = []; // 历史最大上涨

for (var x = 0; x < array.length - 1 ; x++) {
    if(array[x] < array[x+1]){
        var temp = Math.round((array[x+1] - array[x]) / array[x] * 100);
        asc.push(temp/100);
    }else{
        var temp = Math.round((array[x] - array[x+1]) / array[x] * 100);
        desc.push(temp/100);
    }
}

console.log('asc=> ', asc);
console.log('desc=>', desc);
