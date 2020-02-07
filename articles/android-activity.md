Activity 类是 Android 应用的关键组件，而 Activity 的启动和组合方式则是该平台应用模型的基本组成部分。在编程范式中，应用是通过 main() 方法启动的，而 Android 系统与此不同，它会调用与其生命周期特定阶段相对应的特定回调方法来启动 Activity 实例中的代码。

# Activity 生命周期
为了在 Activity 生命周期的各个阶段之间导航转换，Activity 类提供六个核心回调：onCreate()、onStart()、onResume()、onPause()、onStop() 和 onDestroy()。当 Activity 进入新状态时，系统会调用每个回调。

下图是对此范例的直观展现。


![](../assets/vendor/activity_lifecycle.png)


# 生命周期回调
一个 Activity 在其生命周期中会经历多种状态。您可以使用一系列回调来处理状态之间的转换。下面几节将介绍这些回调。

## onCreate()
已创建状态，Activity 对用户不可见

在系统首次创建 Activity 时触发。在 onCreate() 方法中，执行基本应用启动逻辑，该逻辑在 Activity 的整个生命周期中只应发生一次。onCreate() 的实现可能会将数据绑定到列表，将 Activity 与 ViewModel 相关联，并实例化某些类范围变量。此方法接收 savedInstanceState 参数，后者是包含 Activity 先前保存状态的 Bundle 对象。如果 Activity 此前未曾存在，则 Bundle 对象的值为 null。

onCreate() 方法完成执行后，Activity 进入已开始状态，系统会相继调用 onStart() 和 onResume() 方法。

## onStart()
已开始状态，Activity 对用户可见

onStart() 方法会非常快速地完成，并且与“已创建”状态一样，Activity 不会一直处于“已开始”状态。一旦此回调结束，Activity 便会进入已恢复状态，系统将调用 onResume() 方法。

## onResume()
已恢复状态，Activity 对用户可见

这是应用与用户交互的状态。应用会一直保持这种状态，直到某些事件发生，让焦点远离应用。此类事件包括接到来电、用户导航到另一个 Activity，或设备屏幕关闭。

当 Activity 进入已恢复状态时，与 Activity 生命周期相关联的所有具有生命周期感知能力的组件都将收到 ON_RESUME 事件。这时，生命周期组件可以启动任何需要在组件可见，且位于前台时运行的功能，例如启动摄像头预览。

当发生中断事件时，Activity 进入已暂停状态，系统调用 onPause() 回调。

如果 Activity 从“已暂停”状态返回“已恢复”状态，系统将再次调用 onResume() 方法。因此，您应实现 onResume()，以初始化在 onPause() 期间释放的组件，并执行每次 Activity 进入“已恢复”状态时必须完成的任何其他初始化操作。

## onPause()
已暂停状态, Activity 仍然可见。

此方法表示 Activity 不再位于前台（尽管如果用户处于多窗口模式，Activity 仍然可见）。使用 onPause() 方法暂停或调整当 Activity 处于“已暂停”状态时不应继续（或应有节制地继续）的操作，以及您希望很快恢复的操作。

## onStop() 
已停止状态，Activity 不再对用户可见

当 Activity 进入已停止状态时，与 Activity 生命周期相关联的所有具有生命周期感知能力的组件都将收到 ON_STOP 事件。这时，生命周期组件可以停止任何无需在组件未在屏幕上可见时运行的功能。

在 onStop() 方法中，应用应释放或调整应用对用户不可见时的无用资源。例如，应用可以暂停动画效果，或从细粒度位置更新切换到粗粒度位置更新。使用 onStop() 而非 onPause() 可确保与界面相关的工作继续进行，即使用户在多窗口模式下查看您的 Activity 也能如此。

## onDestroy()
销毁 Ativity 之前，系统会先调用 onDestroy()。系统调用此回调的原因如下：
- Activity 正在结束（由于用户彻底关闭 Activity 或由于系统为 Activity 调用 finish()），或者
- 由于配置变更（例如设备旋转或多窗口模式），系统暂时销毁 Activity

当 Activity 进入已销毁状态时，与 Activity 生命周期相关联的所有具有生命周期感知能力的组件都将收到 ON_DESTROY 事件。此时，生命周期组件可以在 Activity 遭到销毁之前清理所需的任何数据。