for (let x = 1; x <= 9; x++) {
	let s = '';
	for (let y = 1; y <= x; y++) {
		s += `${y} x ${x} = ${x * y}  `
	}
	console.log(s);
}