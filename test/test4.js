
function sum(money, year) {
	for (var x = 0; x < year; x++) {
		money = money + money * 0.15
		console.log('money=>', money);
	}
	console.log('money=>', money);
}

sum(50, 20);