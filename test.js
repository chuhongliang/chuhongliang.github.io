
let obj = {
	x: 1,
};
Object.seal(obj);
console.log(Object.isSealed(obj)); // === true;
