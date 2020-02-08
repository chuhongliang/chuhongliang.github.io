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

--- 

## Acticity 生命周期调用顺序

#### 打开一个新的activity实例的时候，系统会依次调用：
- onCreate（) -> onStart() -> onResume() 然后开始running

#### 用户回到桌面或是打开其他activity，系统会调用：
- onPause() -> onStop() 进入停止状态

#### 如果用户返回到onStop()状态的activity（又显示在前台了），系统会调用：
- onRestart() -> onStart() -> onResume() 然后重新running

---

## Activity 四种启动模式
Android中的activity全都归属于task管理 。task 是多个 activity 的集合，这些 activity 按照启动顺序排队存入一个栈（即“back stack”）。android默认会为每个App维持一个task来存放该app的所有activity，task的默认name为该app的packagename。

#### 启动模式是定义activity 实例与task 的关联方式。 　　

- **standard** （默认模式）　
    - 当通过这种模式来启动Activity时,　Android总会为目标 Activity创建一个新的实例,并将该Activity添加到当前Task栈中。这种方式不会启动新的Task,只是将新的 Activity添加到原有的Task中。　
- **singleTop**
    - 该模式和standard模式基本一致,但有一点不同:当将要被启动的Activity已经位于Task栈顶时,系统不会重新创建目标Activity实例,而是直接复用Task栈顶的Activity。
- **singleTask**
    - Activity在同一个Task内只有一个实例。如果将要启动的Activity不存在,那么系统将会创建该实例,并将其加入Task栈顶；　
    - 如果将要启动的Activity已存在,且存在栈顶,直接复用Task栈顶的Activity。
    - 如果Activity存在但是没有位于栈顶,那么此时系统会把位于该Activity上面的所有其他Activity全部移出Task,从而使得该目标Activity位于栈顶。
- **singleInstance**
    - 无论从哪个Task中启动目标Activity,只会创建一个目标Activity实例且会用一个全新的Task栈来装载该Activity实例（全局单例）.
    - 如果将要启动的Activity不存在,那么系统将会先创建一个全新的Task,再创建目标Activity实例并将该Activity实例放入此全新的Task中。
    - 如果将要启动的Activity已存在,那么无论它位于哪个应用程序,哪个Task中;系统都会把该Activity所在的Task转到前台,从而使该Activity显示出来。

### 两种定义启动模式方法:
#### 1. 使用 Intent 标志
在要启动 activity 时，你可以在传给 startActivity() 的 intent 中包含相应标志，以修改 activity 与 task 的默认关系。
```java
Intent i = new Intent(this,ＮewActivity.class);
i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
startActivity(i);
```
#### 通过标志修改的模式
- Intent.FLAG_ACTIVITY_NEW_TASK
    - 与"singleTask"模式相同，在新的 task 中启动 activity。如果要启动的 activity 已经运行于某 task 中，则那个 task 将调入前台。
- Intent.FLAG_ACTIVITY_SINGLE_TOP
    - 与 "singleTop"模式相同，如果要启动的 activity位于back stack 顶，系统不会重新创建目标Activity实例,而是直接复用Task栈顶的Activity。
- FLAG_ACTIVITY_CLEAR_TOP
    - 此种模式在launchMode中没有对应的属性值。如果要启动的 activity 已经在当前 task 中运行，则不再启动一个新的实例，且所有在其上面的 activity 将被销毁。

#### 2. 在manifest 文件中声明
在 manifest 文件中 activity 声明时，利用 activity 元素的 launchMode 属性来设定 activity 与 task 的关系。
```java
<activity
  ．．．．．．
  android:launchMode="standard"
  >
  ．．．．．．．
</activity>
```
注：launchMode 设置的模式可以被启动 activity 的 intent 标志所覆盖。

一般不要改变 activity 和 task 默认的工作方式。 如果你确定有必要修改默认方式，请保持谨慎，并确保 activity 在启动和从其它 activity 返回时的可用性，多做测试和安全方面的工作。

## Intent Filter
在 Android 的 AndroidManifest.xml 配置文件中可以通过 intent-filter 节点为一个 Activity 指定其 Intent Filter，以便告诉系统该 Activity 可以响应什么类型的 Intent。

### intent-filter 的三大属性
- Action 
    - 一个 Intent Filter 可以包含多个 Action，Action 列表用于标示 Activity 所能接受的“动作”，它是一个用户自定义的字符串。
- URL
    - 在 intent-filter 节点中，通过 data节点匹配外部数据，也就是通过 URI 携带外部数据给目标组件。
- Category
    - 为组件定义一个 类别列表，当 Intent 中包含这个类别列表的所有项目时才会匹配成功。

以下为具体用法：
```java
<intent-filter > 
	<action android:name="android.intent.action.MAIN" />
	<action android:name="com.scu.amazing7Action" /> 
	<data 
		android:mimeType="mimeType"
		android:scheme="scheme"
		android:host="host"
		android:port="port"
		android:path="path"/>
	<category android:name="code　android.intent.category.LAUNCHER" />
</intent-filter>
```
在代码中使用以下语句便可以启动该Intent 对象：
```java
Intent i=new Intent(); 
i.setAction("com.scu.amazing7Action");
```
注：只有data的所有的属性都匹配成功时 URI 数据匹配才会成功

### Intent Filter 的匹配过程
- 加载所有的Intent Filter列表
- 去掉action匹配失败的Intent Filter
- 去掉url匹配失败的Intent Filter
- 去掉Category匹配失败的Intent Filter
- 判断剩下的Intent Filter数目是否为0。如果为0查找失败返回异常；如果大于0，就按优先级排序，返回最高优先级的Intent Filter

---

## 开发中使用Activity注意事项
- 一般设置Activity为非公开的
    - 非公开的Activity不能设置intent-filter，以免被其他activity唤醒（如果拥有相同的intent-filter）。
```java
<activity  
．．．．．． 
android:exported="false" /> 
```

- 不要指定activity的taskAffinity属性
- 不要设置activity的LaunchMode（保持默认）
- 在匿名内部类中使用this时加上activity类名（类名.this,不一定是当前activity）
- 设置activity全屏
    - 在其 onCreate()方法中加入：
```java
// 设置全屏模式
getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN); 
// 去除标题栏
requestWindowFeature(Window.FEATURE_NO_TITLE);
```



