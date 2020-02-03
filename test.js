
function pet(name) {
	this.name = name;
}
let dog = new pet("狗");
// getPrototypeOf
console.log(Object.getPrototypeOf(dog) === pet.prototype); //true

// setPrototypeOf
Object.setPrototypeOf(dog, { sound: "汪汪" });
console.log(dog.sound); //汪汪
