# C# 控制语句

程序操作使用语句进行表示。 C# 支持几种不同的语句，其中许多语句是从嵌入语句的角度来定义的。

使用代码块，可以在允许编写一个语句的上下文中编写多个语句。 代码块是由一系列在分隔符 { 和 } 内编写的语句组成。

表达式语句用于计算表达式。 可用作语句的表达式包括方法调用、使用 new 运算符的对象分配、使用 = 和复合赋值运算符的赋值、使用 ++ 和 -- 运算符和 await 表达式的递增和递减运算。

选择语句用于根据一些表达式的值从多个可能的语句中选择一个以供执行。 此组包含 if 和 switch 语句。

迭代语句用于重复执行嵌入语句。 此组包含 while、do、for 和 foreach 语句。

跳转语句用于转移控制权。 此组包含 break、continue、goto、throw、return 和 yield 语句。

try...catch 语句用于捕获在代码块执行期间发生的异常，try...finally 语句用于指定始终执行的最终代码，无论异常发生与否。

checked 和 unchecked 语句用于控制整型类型算术运算和转换的溢出检查上下文。

lock 语句用于获取给定对象的相互排斥锁定，执行语句，然后解除锁定。

using 语句用于获取资源，执行语句，然后释放资源。

下面列出了可以使用的各种语句，以及每种语句的示例。

## if 语句：
```C#
static void IfStatement(string[] args)
{
    if (args.Length == 0)
    {
        Console.WriteLine("No arguments");
    }
    else
    {
        Console.WriteLine("One or more arguments");
    }
}
```

## switch 语句：
```C#
static void SwitchStatement(string[] args)
{
    int n = args.Length;
    switch (n)
    {
        case 0:
            Console.WriteLine("No arguments");
            break;
        case 1:
            Console.WriteLine("One argument");
            break;
        default:
            Console.WriteLine($"{n} arguments");
            break;
    }
}
```

## while  语句：
```C#
static void WhileStatement(string[] args)
{
    int i = 0;
    while (i < args.Length)
    {
        Console.WriteLine(args[i]);
        i++;
    }
}
```

## do 语句：
```C#
static void DoStatement(string[] args)
{
    string s;
    do
    {
        s = Console.ReadLine();
        Console.WriteLine(s);
    } while (!string.IsNullOrEmpty(s));
}
```

## for 语句：
```C#
static void ForStatement(string[] args)
{
    for (int i = 0; i < args.Length; i++)
    {
        Console.WriteLine(args[i]);
    }
}
```

## foreach 语句：
```C#
static void ForEachStatement(string[] args)
{
    foreach (string s in args)
    {
        Console.WriteLine(s);
    }
}
```

## break 语句：
```C#
static void BreakStatement(string[] args)
{
    while (true)
    {
        string s = Console.ReadLine();
        if (string.IsNullOrEmpty(s))
            break;
        Console.WriteLine(s);
    }
}
```

## continue 语句：
```C#
static void ContinueStatement(string[] args)
{
    for (int i = 0; i < args.Length; i++)
    {
        if (args[i].StartsWith("/"))
            continue;
        Console.WriteLine(args[i]);
    }
}
```

## goto 语句：
```C#
static void GoToStatement(string[] args)
{
    int i = 0;
    goto check;
    loop:
    Console.WriteLine(args[i++]);
    check:
    if (i < args.Length)
        goto loop;
}
```

## return 语句：
```C#
static int Add(int a, int b)
{
    return a + b;
}
static void ReturnStatement(string[] args)
{
   Console.WriteLine(Add(1, 2));
   return;
}
```

## yield 语句：
```C#
static System.Collections.Generic.IEnumerable<int> Range(int start, int end)
{
    for (int i = start; i < end; i++)
    {
        yield return i;
    }
    yield break;
}
static void YieldStatement(string[] args)
{
    foreach (int i in Range(-10,10))
    {
        Console.WriteLine(i);
    }
}
```

## throw 和 try 语句：
```C#
static double Divide(double x, double y)
{
    if (y == 0)
        throw new DivideByZeroException();
    return x / y;
}
static void TryCatch(string[] args)
{
    try
    {
        if (args.Length != 2)
        {
            throw new InvalidOperationException("Two numbers required");
        }
        double x = double.Parse(args[0]);
        double y = double.Parse(args[1]);
        Console.WriteLine(Divide(x, y));
    }
    catch (InvalidOperationException e)
    {
        Console.WriteLine(e.Message);
    }
    finally
    {
        Console.WriteLine("Good bye!");
    }
}
```

## checked 和 unchecked 语句：
```C#
static void CheckedUnchecked(string[] args)
{
    int x = int.MaxValue;
    unchecked
    {
        Console.WriteLine(x + 1);  // Overflow
    }
    checked
    {
        Console.WriteLine(x + 1);  // Exception
    }
}
```

## lock 语句：
```C#
class Account
{
    decimal balance;
    private readonly object sync = new object();
    public void Withdraw(decimal amount)
    {
        lock (sync)
        {
            if (amount > balance)
            {
                throw new Exception(
                    "Insufficient funds");
            }
            balance -= amount;
        }
    }
}
```

## using 语句：
```C#
static void UsingStatement(string[] args)
{
    using (TextWriter w = File.CreateText("test.txt"))
    {
        w.WriteLine("Line one");
        w.WriteLine("Line two");
        w.WriteLine("Line three");
    }
}
```