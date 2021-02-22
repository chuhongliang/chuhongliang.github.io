

const Pet = function () {

}

Pet.drink = function () {

}

Pet.prototype.eat = function () {

}




let dog = new Pet();
dog.eat();

console.log('Pet.property=>', Pet.prototype);
console.log('dog.__proto__=>', dog.__proto__);