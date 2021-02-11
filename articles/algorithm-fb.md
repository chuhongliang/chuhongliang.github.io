
>写一个函数，输入 n ，求斐波那契（Fibonacci）数列的第 n 项（即 F(N)）。斐波那契数列的定义如下：
```sh
F(0) = 0，F(1) = 1
F(n) = F(n - 1) + F(n - 2)，其中 n > 1
```

>斐波那契指的是这样一个数列：1、1、2、3、5、8、13、21、34......在数学上,随着数列项数的增加，前一项与后一项之比越来越逼近黄金分割的数值0.6180339887..…

### 递归法:
```js
function fib(n) {
	if (n < 2) {
		return n;
	}
	return fb1(n - 1) + fb1(n - 2);
}
```

### 尾递归法:
```js
function fb2(n, res1 = 1, res2 = 1) {
	if (n == 0) return 0;
	if (n <= 2) return res2;
	let sum = res1 + res2;
	res1 = res2;
	res2 = sum;
	return fb2(n - 1, res1, res2);
}
```

### 遍历法:
```js
function fb3(n) {
	if (n < 2) return n;
	let res1 = 1, res2 = 1;
	let sum = res2;
	for (let x = 2; x < n; x++) {
		sum = res1 + res2;
		res1 = res2;
		res2 = sum;
	}
	return sum;
}
```