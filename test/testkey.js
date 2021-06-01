
function toCamel(str) {
	return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
		console.log('$0=>', $0);
		console.log('$1=>', $1);
		console.log('$2=>', $2);
		return $1 + $2.toUpperCase();
	});
}
console.log(toCamel('test_to_camel_ss'));
console.log(toCamel('cur_count'));
console.log(toCamel('base_count'));
console.log(toCamel('box_no'));
console.log(toCamel('small_pic'));
console.log(toCamel('activity_key'));



function toLowerLine(str) {
	var temp = str.replace(/[A-Z]/g, function (match) {
		console.log('match=>', match);
		return "_" + match.toLowerCase();
	});
	if (temp.slice(0, 1) === '_') { //如果首字母是大写，执行replace时会多一个_，这里需要去掉
		temp = temp.slice(1);
	}
	return temp;
};

console.log(toLowerLine("TestToLowerLine"));
console.log(toLowerLine("testToLowerLine"));


const dict = {
	'122': {
		id: 122,
		cur_count: 13,
		base_count: 13,
	}
}

for (const id of Object.keys(dict)) {
	console.log('id=>', id);

	const item = dict[id];

	for (const key of Object.keys(item)) {
		let newKey = toCamel(key);
		item[newKey] = item[key];
		delete (item[key]);
		console.log('key=>', key);
	}
}
console.log('dict=>', dict);