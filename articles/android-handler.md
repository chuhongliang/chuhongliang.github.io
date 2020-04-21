# Android Handler
Handler是用来接收和处理线程的消息队列里的message/runnable对象的工具。每个Handler实例关联一个单独的线程和这个的线程的消息队列，Handler实例会绑定到创建这个Handler的线程。从那一刻起，Handler会发送message/runnable到消息队列，然后在message/runnable从消息队列出来的时候处理它。

## Handler的由来

当程序第一次启动的时候，Android会同时启动一条主线程（ Main Thread）来负责处理与UI相关的事件，我们叫做UI线程。

Android的UI操作并不是线程安全的（出于性能优化考虑），意味着如果多个线程并发操作UI线程，可能导致线程安全问题。

为了解决Android应用多线程问题—Android平台只允许UI线程修改Activity里的UI组建，就会导致新启动的线程无法改变界面组建的属性值。

当主线程队列处理一个消息超过5秒,android 就会抛出一个 ANP(无响应)的异常,所以,我们需要把一些要处理比较长的消息,放在一个单独线程里面处理,把处理以后的结果,返回给主线程运行,就需要用的Handler来进行线程建的通信。

## Handler的作用
### 让线程延时执行主要用到的两个方法：
```java
final boolean	postAtTime(Runnable r, long uptimeMillis)
final boolean	postDelayed(Runnable r, long delayMillis)
```
### 让任务在其他线程中执行并返回结果
- 在新启动的线程中发送消息
   - 使用Handler对象的sendMessage()方法或者SendEmptyMessage()方法发送消息。

- 在主线程中获取处理消息
  
重写Handler类中处理消息的方法（void handleMessage(Message msg)），当新启动的线程发送消息时，消息发送到与之关联的MessageQueue。而Hanlder不断地从MessageQueue中获取并处理消息。

## Handler更新UI线程
首先要进行Handler 申明，复写handleMessage方法( 放在主线程中)
```java
private Handler handler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			  // TODO 接收消息并且去更新UI线程上的控件内容
			  if (msg.what == UPDATE) {
				  // 更新界面上的textview
				  tv.setText(String.valueOf(msg.obj));
			  }
			  super.handleMessage(msg);
		}
};
```
子线程发送Message给ui线程表示自己任务已经执行完成，主线程可以做相应的操作了。
```java
new Thread() {
		@Override
		public void run() {
			  // TODO 子线程中通过handler发送消息给handler接收，由handler去更新TextView的值
			  try {
					  //do something
						Message msg = new Message();
						msg.what = UPDATE;					
						msg.obj = "更新后的值" ;
						handler.sendMessage(msg);
				} catch (InterruptedException e) {
					  e.printStackTrace();
				}
		}
}.start();
```

## Handler机制
### Handler:
发送消息，它能把消息发送给Looper管理的MessageQueue。

处理消息，并负责处理Looper分给它的消息。

Handler的构造方法，会首先得到当前线程中保存的Looper实例，进而与Looper实例中的MessageQueue想关联。

Handler的sendMessage方法，会给msg的target赋值为handler自身，然后加入MessageQueue中。　　 　　　

### Looper:
每个线程只有一个Looper，它负责管理对应的MessageQueue，会不断地从MessageQueue取出消息，并将消息分给对应的Hanlder处理。 　

主线程中，系统已经初始化了一个Looper对象，因此可以直接创建Handler即可，就可以通过Handler来发送消息、处理消息。 程序自己启动的子线程，程序必须自己创建一个Looper对象，并启动它，调用Looper.prepare()方法。

prapare()方法：保证每个线程最多只有一个Looper对象。 　

looper()方法：启动Looper，使用一个死循环不断取出MessageQueue中的消息，并将取出的消息分给对应的Handler进行处理。

### MessageQueue:
由Looper负责管理，它采用先进先出的方式来管理Message。
  
### Message:
Handler接收和处理的消息对象。
