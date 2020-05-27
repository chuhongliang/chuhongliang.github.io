# 类和对象
类是最基本的 C# 类型。 类是一种数据结构，可在一个单元中就将状态（字段）和操作（方法和其他函数成员）结合起来。 类为动态创建的类实例（亦称为“对象”）提供了定义。 类支持继承和多形性，即派生类可以扩展和专门针对基类的机制。

新类使用类声明进行创建。 类声明的开头是标头，指定了类的特性和修饰符、类名、基类（若指定）以及类实现的接口。 标头后面是类主体，由在分隔符 { 和 } 内编写的成员声明列表组成。

```C#
public class Point
{
    public int x, y;
    public Point(int x, int y)
    {
        this.x = x;
        this.y = y;
    }
}
```

类实例是使用 new 运算符进行创建，此运算符为新实例分配内存，调用构造函数来初始化实例，并返回对实例的引用。 以下语句创建两个 Point 对象，并将对这些对象的引用存储在两个变量中：
```C#
Point p1 = new Point(0, 0);
Point p2 = new Point(10, 20);
```
当无法再访问对象时，对象占用的内存会被自动回收。 既没必要，也无法在 C# 中显式解除分配对象。

## 成员
类成员要么是静态成员，要么是实例成员。 静态成员属于类，而实例成员则属于对象（类实例）。
以下列表概述了类可以包含的成员类型。
- 常量
  - 与类相关联的常量值
- 字段
  - 类的常量
- 方法
  - 类可以执行的计算和操作
- 属性
  - 与读取和写入类的已命名属性相关联的操作
- 索引器
  - 与将类实例编入索引（像处理数组一样）相关联的操作
- 事件
  - 类可以生成的通知
- 运算符
  - 类支持的转换和表达式运算符
- 构造函数
  - 初始化类实例或类本身所需的操作
- 终结器
  - 永久放弃类实例前要执行的操作
- 类型
  - 类声明的嵌套类型

## 可访问性
每个类成员都有关联的可访问性，用于控制能够访问成员的程序文本区域。 可访问性有六种可能的形式。 以下内容对访问修饰符进行了汇总。
- public
  - 访问不受限制。
- protected
  - 访问仅限于此类或派生自此类的类。
- internal
  - 访问仅限于当前程序集（.exe、.dll 等）。
- protected internal
  - 访问仅限于包含类、派生自包含类的类或同一程序集中的类。
- private
  - 访问仅限于此类。
- private protected
  - 访问仅限于同一程序集中的包含类或派生自包含类的类。

## 类型参数
类定义可能会按如下方式指定一组类型参数：在类名后面用尖括号括住类型参数名称列表。 然后，可以在类声明的主体中使用类型参数来定义类成员。 在以下示例中，Pair 的类型参数是 TFirst 和 TSecond：
```C#
public class Pair<TFirst,TSecond>
{
    public TFirst First;
    public TSecond Second;
}
```
声明为需要使用类型参数的类类型被称为泛型类类型。 结构、接口和委托类型也可以是泛型。 使用泛型类时，必须为每个类型参数提供类型自变量：
```C#
Pair<int,string> pair = new Pair<int,string> { First = 1, Second = "two" };
int i = pair.First;     // TFirst is int
string s = pair.Second; // TSecond is string
```
包含类型自变量的泛型类型（如上面的 Pair<int,string>）被称为构造泛型类型。

## 基类
类声明可能会按如下方式指定基类：在类名和类型参数后面编写冒号和基类名。 省略基类规范与从 object 类型派生相同。 在以下示例中，Point3D 的基类是 Point，Point 的基类是 object：
```C#
public class Point
{
    public int x, y;
    public Point(int x, int y)
    {
        this.x = x;
        this.y = y;
    }
}
public class Point3D: Point
{
    public int z;
    public Point3D(int x, int y, int z) :
        base(x, y)
    {
        this.z = z;
    }
}
```
类继承其基类的成员。 继承是指隐式包含其基类的所有成员的类，实例和静态构造函数以及基类的终结器除外。 派生类可以在其继承的成员中添加新成员，但无法删除继承成员的定义。 在上面的示例中，Point3D 从 Point 继承了 x 和 y 字段，每个 Point3D 实例均包含三个字段（x、y 和 z）。

可以将类类型隐式转换成其任意基类类型。 类类型的变量可以引用相应类的实例或任意派生类的实例。 例如，类声明如上，Point 类型的变量可以引用 Point 或 Point3D：
```C#
Point a = new Point(10, 20);
Point b = new Point3D(10, 20, 30);
```

## 字段
字段是与类或类实例相关联的变量。

使用静态修饰符声明的字段定义的是静态字段。 静态字段只指明一个存储位置。 无论创建多少个类实例，永远只有一个静态字段副本。

不使用静态修饰符声明的字段定义的是实例字段。 每个类实例均包含相应类的所有实例字段的单独副本。

在以下示例中，每个 Color 类实例均包含 r、g 和 b 实例字段的单独副本，但只包含 Black、White、Red、Green 和 Blue 静态字段的一个副本：
```C#
public class Color
{
    public static readonly Color Black = new Color(0, 0, 0);
    public static readonly Color White = new Color(255, 255, 255);
    public static readonly Color Red = new Color(255, 0, 0);
    public static readonly Color Green = new Color(0, 255, 0);
    public static readonly Color Blue = new Color(0, 0, 255);
    private byte r, g, b;
    public Color(byte r, byte g, byte b)
    {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}
```
如上面的示例所示，可以使用 readonly 修饰符声明只读字段。 只能在字段声明期间或在同一个类的构造函数中向 readonly 字段赋值。

## 方法
方法是实现对象或类可执行的计算或操作的成员。 静态方法是通过类进行访问。 实例方法是通过类实例进行访问。

方法可能具有参数列表，用于表示传递给方法的值或变量引用；并具有返回类型，用于指定方法计算并返回的值的类型。 如果方法未返回值，则它的返回类型为 void。

方法可能也包含一组类型参数，必须在调用方法时指定类型自变量，这一点与类型一样。 与类型不同的是，通常可以根据方法调用的自变量推断出类型自变量，无需显式指定。

在声明方法的类中，方法的签名必须是唯一的。 方法签名包含方法名称、类型参数数量及其参数的数量、修饰符和类型。 方法签名不包含返回类型。

### 参数
参数用于将值或变量引用传递给方法。 方法参数从调用方法时指定的自变量中获取其实际值。 有四类参数：值参数、引用参数、输出参数和参数数组。

值参数 用于传递输入自变量。 值参数对应于局部变量，从为其传递的自变量中获取初始值。 修改值形参不会影响为其传递的实参。

可以指定默认值，从而省略相应的自变量，这样值参数就是可选的。

引用参数 用于按引用传递自变量。 为引用参数传递的自变量必须是具有明确值的变量，并且在方法执行期间，引用参数指明的存储位置与自变量相同。 引用参数使用 ref 修饰符进行声明。 下面的示例展示了如何使用 ref 参数。
```C#
using System;
class RefExample
{
    static void Swap(ref int x, ref int y)
    {
        int temp = x;
        x = y;
        y = temp;
    }
    public static void SwapExample()
    {
        int i = 1, j = 2;
        Swap(ref i, ref j);
        Console.WriteLine($"{i} {j}");    // Outputs "2 1"
    }
}
```
