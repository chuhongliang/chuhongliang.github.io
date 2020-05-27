# C# 程序结构
C# 中的关键组织结构概念包括程序、命名空间、类型、成员和程序集。 C# 程序由一个或多个源文件组成。 程序声明类型，而类型则包含成员，并被整理到命名空间中。 类型示例包括类和接口。 成员示例包括字段、方法、属性和事件。 编译完的 C# 程序实际上会打包到程序集中。 程序集的文件扩展名通常为 .exe 或 .dll，具体取决于实现的是应用程序还是库。

可以使用 dotnet new 命令创建名为 acme 的库项目:
```C# 
dotnet new classlib -o acme
```
在该项目中，在名为 Acme.Collections 的命名空间中声明名为 Stack 的类：
```C#
using System;
namespace Acme.Collections
{
    public class Stack
    {
        Entry top;
        public void Push(object data)
        {
            top = new Entry(top, data);
        }

        public object Pop()
        {
            if (top == null)
            {
                throw new InvalidOperationException();
            }
            object result = top.data;
            top = top.next;
            return result;
        }

        class Entry
        {
            public Entry next;
            public object data;
            public Entry(Entry next, object data)
            {
                this.next = next;
                this.data = data;
            }
        }
    }
}
```
此类的完全限定的名称为 Acme.Collections.Stack。 此类包含多个成员：一个 top 字段、两个方法（Push 和 Pop）和一个 Entry 嵌套类。 Entry 类还包含三个成员：一个 next 字段、一个 data 字段和一个构造函数。 命令：
```C#
dotnet build
```
将示例编译成库（不含 Main 入口点的代码），并生成 acme.dll 程序集。

程序集包含中间语言 (IL) 指令形式的可执行代码和元数据形式的符号信息。 执行前，.NET 公共语言运行时的实时 (JIT) 编译器会将程序集中的 IL 代码转换为特定于处理器的代码。

由于程序集是包含代码和元数据的自描述功能单元，因此无需在 C# 中使用 #include 指令和头文件。 只需在编译程序时引用特定的程序集，即可在 C# 程序中使用此程序集中包含的公共类型和成员。 例如，此程序使用 acme.dll 程序集中的 Acme.Collections.Stack 类：
```C#
using System;
using Acme.Collections;
class Example
{
    static void Main()
    {
        Stack s = new Stack();
        s.Push(1);
        s.Push(10);
        s.Push(100);
        Console.WriteLine(s.Pop());
        Console.WriteLine(s.Pop());
        Console.WriteLine(s.Pop());
    }
}
```
上述程序的项目的 .csproj 文件必须包含 C# 编译器的引用节点，以解析对 acme.dll 程序集中类的引用 ：
```xml
<ItemGroup>
    <ProjectReference Include="..\acme\acme.csproj" />
</ItemGroup>
```
完成此操作后，dotnet build 会创建名为 example.exe 的可执行程序集，它将在运行时输出以下内容：
```C#
100
10
1
```
使用 C#，可以将程序的源文本存储在多个源文件中。 编译多文件 C# 程序时，可以将所有源文件一起处理，并且源文件可以随意相互引用。从概念上讲，就像是所有源文件在处理前被集中到一个大文件中一样。 在 C# 中永远都不需要使用前向声明，因为声明顺序无关紧要（极少数例外情况除外）。 C# 并不限制源文件只能声明一种公共类型，也不要求源文件的文件名必须与其中声明的类型相匹配。
