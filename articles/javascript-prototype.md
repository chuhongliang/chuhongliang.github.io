
### **原型** prototype
>我们所创建的每一个函数，解析器都会向函数中添加一个属性prototype，这个属性对应着一个对象，这个对象就是我们所谓的原型对象.

>如果函数作为普通函数调用prototype没有任何作用, 当函数以构造函数的形式调用时，它所创建的对象中都会有一个隐含的属性，指向该构造函数的原型对象，我们可以通过__proto__来访问该属性.

>原型对象就相当于一个公共的区域，所有同一个类的实例都可以访问到这个原型对象，
我们可以将对象中共有的内容，统一设置到原型对象中。
当我们访问对象的一个属性或方法时，它会先在对象自身中寻找，如果有则直接使用，
如果没有则会去原型对象中寻找，如果找到则直接使用
以后我们创建构造函数时，可以将这些对象共有的属性和方法，统一添加到构造函数的原型对象中，这样不用分别为每一个对象添加，也不会影响到全局作用域，就可以使每个对象都具有这些属性和方法了

例如: `hasOwnProperty()`方法存在于Obejct原型对象中,它便可以被任何对象当做自己的方法使用.
> `object.hasOwnProperty( propertyName )`
> `hasOwnProperty()`函数的返回值为`Boolean`类型。如果对象`object`具有名称为`propertyName`的属性，则返回`true`，否则返回`false`。

```javascript
let pet = {
  name: "狗",
};
console.log(pet.hasOwnProperty("name")); //true
console.log(pet.hasOwnProperty("hasOwnProperty")); //false
console.log(Object.prototype.hasOwnProperty("hasOwnProperty")); //true
```
由以上代码可知,`hasOwnProperty()`并不存在于`pet`对象中,但是`pet`依然可以拥有此方法.

&nbsp;

---

&nbsp;

### `__proto__`与`prototype`
实例对象的`__proto__`属性,指向原型对象,我们便可以通过此属性找到原型对象.

```javascript
function pet(name) {
  this.name = name;
}
let dog = new pet('狗');
console.log(dog.__proto__ === pet.prototype); //true
```

> `getPrototypeOf()` 获取原型对象.

```javascript
function pet(name) {
	this.name = name;
}
let dog = new pet('狗');
console.log(Object.getPrototypeOf(dog) === pet.prototype); //true
```

> `isPrototypeOf` 来检验某个对象是否是另一个对象的原型对象.

```javascript
function pet(name) {
	this.name = name;
}
let dog = new pet('狗');
console.log(pet.prototype.isPrototypeOf(dog)); //true
```

&nbsp;

---

&nbsp;

### **原型链**
>实例对象方法调用,是先在实例对象内部找,如果找到则立即返回调用,如果没有找到就顺着`__proto__`向上寻找,如果找到该方法则调用,没有找到会直接报错,这便是**原型链**.

```javascript
function pet(name) {
	this.name = name;
}
let dog = new pet("狗");
// 先在dog对象实例中寻找`hasOwnProperty()`方法,发现不存在此方法
console.log(dog.hasOwnProperty("hasOwnProperty")); //fasle
// 在dog的原型对象dog.__proto__即pet.prototype中寻找hasOwnProperty()方法,依然没有找到
console.log(dog.__proto__.hasOwnProperty("hasOwnProperty")); //fasle
console.log(pet.prototype.hasOwnProperty("hasOwnProperty")); //false
console.log(dog.__proto__ === pet.prototype); //true

/**
 * 在pet.prototype原型对象pet.prototype.__proto__
 * 即Object.prototype中寻找hasOwnProperty()方法
 * */
console.log(pet.prototype.__proto__.hasOwnProperty("hasOwnProperty")); //true
console.log(dog.__proto__.__proto__.hasOwnProperty("hasOwnProperty")); //true
console.log(dog.__proto__.__proto__ === pet.prototype.__proto__); // true
console.log(dog.__proto__.__proto__ === Object.prototype); // true
```


### ES6中的 `__proto__`
>虽然`__proto__`在最新的ECMA标准中被纳入了规范,但是由于`__proto__`前后的双下划线，说明它本质上是一个内部属性，而不是一个正式的对外的 API.
标准明确规定，只有浏览器必须部署这个属性，其他运行环境不一定需要部署，而且新的代码最好认为这个属性是不存在的。因此，无论从语义的角度，还是从兼容性的角度，都不要使用这个属性，而是使用下面的`Object.setPrototypeOf()`（写操作）、`Object.getPrototypeOf()`（读操作）代替。

```javascript
function pet(name) {
	this.name = name;
}
let dog = new pet("狗");
// getPrototypeOf
console.log(Object.getPrototypeOf(dog) === pet.prototype); //true

// setPrototypeOf
Object.setPrototypeOf(dog, { sound: "汪汪" });
console.log(dog.sound); //汪汪
```

> `Object.setPrototypeOf()` 只能生效当前实例;

```javascript
function pet(name) {
	this.name = name;
}
let dog = new pet("狗");
let cat = new pet("猫");
Object.setPrototypeOf(dog, { sound: "汪汪" });
console.log(dog.sound); //汪汪
console.log(cat.sound); //undefind
```
