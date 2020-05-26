# 委托
委托类型表示对具有特定参数列表和返回类型的方法的引用。 通过委托，可以将方法视为可分配给变量并可作为参数传递的实体。 委托还类似于其他一些语言中存在的“函数指针”概念。 与函数指针不同，委托是面向对象且类型安全的。

下面的示例声明并使用 Function 委托类型。官方例子比较难理解，自己写个容易理解的
```C#
using System;
delegate void Notify();

class Timer{
    public event Notify onStart;
    public event Notify onStop;
    int time;
    public Timer(int time){
        this.time = time;
    }
    public void start(){
        // todo
        onStart.Invoke();
    }

    public void stop(){
        onStop.Invoke();
    }
}

class TimerExample{

    public onClick(){
        Timer.onStart += click;
        Timer.onStrop += stop;
        Timer.start();
    }

    public click(){
        //todo
    }

    public stop(){
        //todo
    }

}
```
这只是委托的用法之一，只是觉得用来实现“发布/订阅”模式很方便。委托可以理解成一个方法栈，可以一次性执行所里面的方法。
其它用法感觉难以理解，也没找到合适的适用场景。