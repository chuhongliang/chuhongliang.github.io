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
console.log('sb=>', sb);