
function pet(name) {
	this.name = name;
}
let dog = new pet("狗");
// getPrototypeOf
console.log(Object.getPrototypeOf(dog) === pet.prototype); //true

// setPrototypeOf
Object.setPrototypeOf(dog, { sound: "汪汪" });
console.log(dog.sound); //汪汪

//试望阴山，黯然销魂，无言徘徊。见青峰几簇，去天才尺；黄沙一片，匝地无埃。碎叶城荒，拂云堆远，雕外寒烟惨不开。踟蹰久，忽砯崖转石，万壑惊雷。穷边自足秋怀。又何必、平生多恨哉。只凄凉绝塞，峨眉遗冢；梢沉腐草，骏骨空台。北转河流，南横斗柄，略点微霜鬓早衰。君不信，向西风回首，百事堪哀。——清代·纳兰性德《沁园春·试望阴山》