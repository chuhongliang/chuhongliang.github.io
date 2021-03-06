Collection接口是处理对象集合的根接口，其中定义了很多对元素进行操作的方法。Collection接口有两个主要的子接口List和Set，Map不是Collection的子接口。

Collection接口中有几个比较常用的方法，比如方法add()添加一个元素到集合中，addAll()将指定集合中的所有元素添加到集合中，contains()方法检测集合中是否包含指定的元素，toArray()方法返回一个表示集合的数组。

另外，Collection中有一个iterator()函数，它的作用是返回一个Iterator接口。通过Iterator迭代器来遍历集合。ListIterator是List接口所特有的，在List接口中，通过ListIterator()返回一个ListIterator对象。

### Collection接口有两个常用的子接口: List 和 Set

# 一、List接口
List集合代表一个有序集合，集合中每个元素都有其对应的顺序索引。List集合允许使用重复元素，可以通过索引来访问指定位置的集合元素。

List接口继承于Collection接口，它可以定义一个允许重复的有序集合。因为List中的元素是有序的，所以我们可以通过使用索引（元素在List中的位置，类似于数组下标）来访问List中的元素，这类似于Java的数组。

List接口为Collection直接接口。List所代表的是有序的Collection，即它用某种特定的插入顺序来维护元素顺序。用户可以对列表中每个元素的插入位置进行精确地控制，同时可以根据元素的整数索引（在列表中的位置）访问元素，并搜索列表中的元素。实现List接口的集合主要有：ArrayList、LinkedList、Vector、Stack。

## ArrayList
ArrayList是一个动态数组，也是我们最常用的集合。它允许任何符合规则的元素插入甚至包括null。每一个ArrayList都有一个初始容量（10），该容量代表了数组的大小。随着容器中的元素不断增加，容器的大小也会随着增加。在每次向容器中增加元素的同时都会进行容量检查，当快溢出时，就会进行扩容操作。所以如果我们明确所插入元素的多少，最好指定一个初始容量值，避免过多的进行扩容操作而浪费时间、效率。 

size、isEmpty、get、set、iterator 和 listIterator 操作都以固定时间运行。add 操作以分摊的固定时间运行，也就是说，添加 n 个元素需要 O(n) 时间（由于要考虑到扩容，所以这不只是添加元素会带来分摊固定时间开销那样简单）。

ArrayList擅长于随机访问。同时ArrayList是非同步的。

## LinkedList
同样实现List接口的LinkedList与ArrayList不同，ArrayList是一个动态数组，而LinkedList是一个双向链表。所以它除了有ArrayList的基本操作方法外还额外提供了get，remove，insert方法在LinkedList的首部或尾部。

由于实现的方式不同，LinkedList不能随机访问，它所有的操作都是要按照双重链表的需要执行。在列表中索引的操作将从开头或结尾遍历列表（从靠近指定索引的一端）。这样做的好处就是可以通过较低的代价在List中进行插入和删除操作。

与ArrayList一样，LinkedList也是非同步的。如果多个线程同时访问一个List，则必须自己实现访问同步。一种解决方法是在创建List时构造一个同步的List： 
```java
List list = Collections.synchronizedList(new LinkedList(...));
```

## Vector
与ArrayList相似，但是Vector是同步的。所以说Vector是线程安全的动态数组。它的操作与ArrayList几乎一样。

## Stack
Stack继承自Vector，实现一个后进先出的堆栈。Stack提供5个额外的方法使得Vector得以被当作堆栈使用。基本的push和pop 方法，还有peek方法得到栈顶的元素，empty方法测试堆栈是否为空，search方法检测一个元素在堆栈中的位置。Stack刚创建后是空栈。

## ArrayList 和 LinkedList比较
- ArrayList是实现了基于动态数组的数据结构，LinkedList基于链表的数据结构。 

- 对于随机访问get和set，ArrayList绝对优于LinkedList，因为LinkedList要移动指针。 

- 对于新增和删除操作add和remove，LinedList比较占优势，因为ArrayList要移动数据。 
这一点要看实际情况的。若只对单条数据插入或删除，ArrayList的速度反而优于LinkedList。但若是批量随机的插入删除数据，LinkedList的速度大大优于ArrayList. 因为ArrayList每插入一条数据，要移动插入点及之后的所有数据。

---

# Set接口
Set是一种不包括重复元素的Collection。它维持它自己的内部排序，所以随机访问没有任何意义。与List一样，它同样允许null的存在但是仅有一个。由于Set接口的特殊性，所有传入Set集合中的元素都必须不同，同时要注意任何可变对象，如果在对集合中元素进行操作时，导致e1.equals(e2)==true，则必定会产生某些问题。Set接口有三个具体实现类，分别是散列集HashSet、链式散列集LinkedHashSet和树形集TreeSet。

Set是一种不包含重复的元素的Collection，无序，即任意的两个元素e1和e2都有e1.equals(e2)=false，Set最多有一个null元素。需要注意的是:虽然Set中元素没有顺序，但是元素在set中的位置是由该元素的HashCode决定的，其具体位置其实是固定的。

此外需要说明一点，在set接口中的不重复是有特殊要求的。

举一个例子:对象A和对象B，本来是不同的两个对象，正常情况下它们是能够放入到Set里面的，但是如果对象A和B的都重写了hashcode和equals方法，并且重写后的hashcode和equals方法是相同的话。那么A和B是不能同时放入到Set集合中去的，也就是Set集合中的去重和hashcode与equals方法直接相关。

#### 为了更好地理解，请看下面的例子：
```java
public class Test{ 
public static void main(String[] args) { 
     Set<String> set=new HashSet<String>(); 
     set.add("Hello"); 
     set.add("world"); 
     set.add("Hello"); 
     System.out.println("集合的尺寸为:"+set.size()); 
     System.out.println("集合中的元素为:"+set.toString()); 
  } 
} 
```
#### 运行结果:
```java
集合的尺寸为:2
集合中的元素为:[world, Hello]
```
由于String类中重写了hashcode和equals方法，用来比较指向的字符串对象所存储的字符串是否相等。所以这里的第二个Hello是加不进去的。

#### 再看一个例子：
```java
public class TestSet {
    public static void main(String[] args){ 
        Set<String> books = new HashSet<String>();
        //添加一个字符串对象
        books.add(new String("Struts2权威指南"));
        //再次添加一个字符串对象，
        //因为两个字符串对象通过equals方法比较相等，所以添加失败，返回false
        boolean result = books.add(new String("Struts2权威指南"));
        System.out.println(result);
        //下面输出看到集合只有一个元素
        System.out.println(books);
    }
}
```
#### 运行结果：
```java
false
[Struts2权威指南]
```
#### 程序中，book集合两次添加的字符串对象明显不是一个对象（程序通过new关键字来创建字符串对象），当使用==运算符判断返回false，使用equals方法比较返回true，所以不能添加到Set集合中，最后只能输出一个元素。

## HashSet
HashSet 是一个没有重复元素的集合。它是由HashMap实现的，不保证元素的顺序(这里所说的没有顺序是指：元素插入的顺序与输出的顺序不一致)，而且HashSet允许使用null 元素。HashSet是非同步的，如果多个线程同时访问一个哈希set，而其中至少一个线程修改了该set，那么它必须保持外部同步。 HashSet按Hash算法来存储集合的元素，因此具有很好的存取和查找性能。

HashSet的实现方式大致如下，通过一个HashMap存储元素，元素是存放在HashMap的Key中，而Value统一使用一个Object对象。


## HashSet使用和理解中容易出现的误区:
- HashSet中是允许存入null值的，但是在HashSet中仅仅能够存入一个null值。
- HashSet中存储的元素的是无序的，但是由于HashSet底层是基于Hash算法实现的，使用了hashcode，所以HashSet中相应的元素的位置是固定的。
- 必须小心操作可变对象（Mutable Object）。如果一个Set中的可变元素改变了自身状态导致Object.equals(Object)=true将导致一些问题。

## LinkedHashSet
LinkedHashSet继承自HashSet，其底层是基于LinkedHashMap来实现的，有序，非同步。LinkedHashSet集合同样是根据元素的hashCode值来决定元素的存储位置，但是它同时使用链表维护元素的次序。这样使得元素看起来像是以插入顺序保存的，也就是说，当遍历该集合时候，LinkedHashSet将会以元素的添加顺序访问集合的元素。

## TreeSet
TreeSet是一个有序集合，其底层是基于TreeMap实现的，非线程安全。TreeSet可以确保集合元素处于排序状态。TreeSet支持两种排序方式，自然排序和定制排序，其中自然排序为默认的排序方式。当我们构造TreeSet时，若使用不带参数的构造函数，则TreeSet的使用自然比较器；若用户需要使用自定义的比较器，则需要使用带比较器的参数。

TreeSet集合不是通过hashcode和equals函数来比较元素的.它是通过compare或者comparaeTo函数来判断元素是否相等.compare函数通过判断两个对象的id，相同的id判断为重复元素，不会被加入到集合中。


## HashSet、LinkedHashSet、TreeSet比较
- Set 是有序的，不允许包含相同的元素，如果试图把两个相同元素加入同一个集合中，add方法返回false。
- Set 判断两个对象相同不是使用==运算符，而是根据equals方法。也就是说，只要两个对象用equals方法比较返回true，Set就不会接受这两个对象。

- HashSet 是无序的，不能保证元素的排列顺序，顺序有可能发生变化。
- HashSet 不是同步的。
- HashSet 集合元素可以是null，但只能放入一个null。
- LinkedHashSet 集合同样是根据元素的hashCode值来决定元素的存储位置，但是它同时使用链表维护元素的次序。这样使得元素看起来像是以插入顺序保存的，也就是说，当遍历该集合时候，LinkedHashSet将会以元素的添加顺序访问集合的元素。
- LinkedHashSet 在迭代访问Set中的全部元素时，性能比HashSet好，但是插入时性能稍微逊色于HashSet。
- TreeSet 是SortedSet接口的唯一实现类，TreeSet可以确保集合元素处于排序状态。TreeSet支持两种排序方式，自然排序和定制排序，其中自然排序为默认的排序方式。向TreeSet中加入的应该是同一个类的对象。
- TreeSet 判断两个对象不相等的方式是两个对象通过equals方法返回false，或者通过CompareTo方法比较没有返回0。

---

## Collection 和 Collections区别
java.util.Collection 是一个集合接口（集合类的一个顶级接口）。它提供了对集合对象进行基本操作的通用接口方法。Collection接口在Java 类库中有很多具体的实现。Collection接口的意义是为各种具体的集合提供了最大化的统一操作方式，其直接继承接口有List与Set

```java
Collection   
├──List   
|  ├──LinkedList   
|  ├──ArrayList   
|  ├──Vector   
|  |  ├──Stack   
├──Set 
```

java.util.Collections 是一个包装类（工具类/帮助类）。它包含有各种有关集合操作的静态多态方法。此类不能实例化，就像一个工具类，用于对集合中元素进行排序、搜索以及线程安全等各种操作，服务于Java的Collection框架。

代码示例：
```java
import java.util.ArrayList; 
import java.util.Collections; 
import java.util.List; 
  
public class TestCollections { 
    public static void main(String args[]) { 
        //注意List是实现Collection接口的 
        List list = new ArrayList(); 
        double array[] = { 112, 111, 23, 456, 231 }; 
        for (int i = 0; i < array.length; i++) { 
            list.add(new Double(array[i])); 
        } 
        Collections.sort(list); 
        for (int i = 0; i < array.length; i++) { 
            System.out.println(list.get(i)); 
        } 
        // 结果：23.0 111.0 112.0 231.0 456.0 
    } 
} 
```