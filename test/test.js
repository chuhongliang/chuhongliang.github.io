// 斐波那契指的是这样一个数列：1、1、2、3、5、8、13、21、34......在数学上，
// 斐波纳契数列以如下被以递归的方法定义：
// F(1) = 1，F(2) = 1, F(n) = F(n - 1) + F(n - 2) （n >= 2，n∈N *）;
// 随着数列项数的增加，前一项与后一项之比越来越逼近黄金分割的数值0.6180339887..…

function fb1(n) {
	if (n <= 2) {
		return 1;
	}
	return fb1(n - 1) + fb1(n - 2);
}


function fb2(n, res1 = 1, res2 = 1) {
	console.log('n=>', n, 'res2=>', res2);
	if (n <= 2) return res2;
	let sum = res1 + res2;
	res1 = res2;
	res2 = sum;
	return fb2(n - 1, res1, res2);
}


function fb3(n) {
	let res1 = 1, res2 = 1;
	let sum = res2;
	for (let x = 2; x < n; x++) {
		sum = res1 + res2;
		res1 = res2;
		res2 = sum;
	}
	return sum;
}


for (let x = 1; x < 4; x++) {
	console.log('y=>', x, fb2(x));
}

