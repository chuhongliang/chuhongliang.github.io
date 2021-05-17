function getRandomItem(num) {
	const items = [
		{ id: 1, curCount: 4, awardType: 'A' },
		{ id: 2, curCount: 4, awardType: 'B' },
		{ id: 3, curCount: 4, awardType: 'C' },
		{ id: 4, curCount: 4, awardType: 'D' },
		{ id: 5, curCount: 4, awardType: 'E' },
		{ id: 6, curCount: 4, awardType: 'F' },
		{ id: 7, curCount: 4, awardType: 'G' },
		{ id: 8, curCount: 4, awardType: 'H' },
		{ id: 9, curCount: 4, awardType: 'I' },
		{ id: 10, curCount: 4, awardType: 'J' },
		{ id: 11, curCount: 4, awardType: 'K' },
		{ id: 12, curCount: 1, awardType: 'LAST' },
	]

	let awardType = {
		'A': 1,
	}

	const itemList = {};
	items.forEach(item => {
		if (item.awardType !== 'LAST') {
			let weight = awardType[item.awardType] || 5;
			itemList[item.id] = {
				id: item.id,
				curCount: item.curCount,
				weight: weight,
			}
		}
	})
	console.log('itemList=>', itemList);

	const randList = {};
	for (let x = 0; x < num; x++) {
		const { itemArray, totalWeight } = dictToArray(itemList);

		const item = random(itemArray, totalWeight);
		console.log('item=>', item);
		if (randList.hasOwnProperty(item.id)) {
			randList[item.id].count++;
		} else {
			randList[item.id] = { id: item.id, count: 1 };
		}
		itemList[item.id].curCount -= 1;
		if (itemList[item.id].curCount <= 0) {
			delete (itemList[item.id]);
		}
	}
	console.log('itemList=>', itemList);

	return randList;
}

function dictToArray(items) {
	const itemArray = [];
	let totalWeight = 0;
	for (let key in items) {
		if (items.hasOwnProperty(key)) {
			itemArray.push(items[key]);
			totalWeight += (items[key].weight * items[key].curCount);
		}
	}
	return { itemArray, totalWeight };
}

function random(itemArray, totalWeight) {
	let randWeight = rand(1, totalWeight);
	let tempWeight = 0;
	for (let x = 0; x < itemArray.length; x++) {
		tempWeight += (itemArray[x].weight * itemArray[x].curCount);
		if (randWeight <= tempWeight) {
			return itemArray[x];
		}
	}
	return null;
}

function rand(min, max) {
	var n = max - min;
	return min + Math.round(Math.random() * n);
};

let res = getRandomItem(5);
console.log('res=>', res);