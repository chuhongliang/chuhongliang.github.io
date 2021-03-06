## Node.js
Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。 Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型。 

Node 是一个让 JavaScript 运行在服务端的开发平台，它让 JavaScript 成为与PHP、Python、Perl、Ruby 等服务端语言平起平坐的脚本语言。 发布于2009年5月，由Ryan Dahl开发，实质是对Chrome V8引擎进行了封装。

Node对一些特殊用例进行优化，提供替代的API，使得V8在非浏览器环境下运行得更好。V8引擎执行Javascript的速度非常快，性能非常好。Node是一个基于Chrome JavaScript运行时建立的平台， 用于方便地搭建响应速度快、易于扩展的网络应用。Node 使用事件驱动， 非阻塞I/O 模型而得以轻量和高效，非常适合在分布式设备上运行数据密集型的实时应用。



## 发展史
2009年2月，Ryan Dahl在博客上宣布准备基于V8创建一个轻量级的Web服务器并提供一套库。

2009年5月，Ryan Dahl在GitHub上发布了最初版本的部分Node包，随后几个月里，有人开始使用Node开发应用。

2009年11月和2010年4月，两届JSConf大会都安排了Node.js的讲座。

2010年年底，Node获得云计算服务商Joyent资助，创始人Ryan Dahl加入Joyent全职负责Node的发展。

2011年7月，Node在微软的支持下发布Windows版本。



## 特性
V8引擎本身使用了一些最新的编译技术。这使得用Javascript这类脚本语言编写出来的代码运行速度获得了极大提升，又节省了开发成本。对性能的苛求是Node的一个关键因素。 Javascript是一个事件驱动语言，Node利用了这个优点，编写出可扩展性高的服务器。Node采用了一个称为“事件循环(event loop）”的架构，使得编写可扩展性高的服务器变得既容易又安全。提高服务器性能的技巧有多种多样。Node选择了一种既能提高性能，又能减低开发复杂度的架构。这是一个非常重要的特性。并发编程通常很复杂且布满地雷。Node绕过了这些，但仍提供很好的性能。
Node采用一系列“非阻塞”库来支持事件循环的方式。本质上就是为文件系统、数据库之类的资源提供接口。向文件系统发送一个请求时，无需等待硬盘（寻址并检索文件），硬盘准备好的时候非阻塞接口会通知Node。该模型以可扩展的方式简化了对慢资源的访问， 直观，易懂。


## 版本发布
- 每6个月发布一个主要版本(即Major号变更)，作为Current版本
- 发布月份: 4月发布偶数版本，10月发布奇数版本
- 每12个月将一个版本转入LTS版本。对，只有偶数版本（一般是在其后续奇数版本发布时）
- LTS版本要经历两个阶段：活跃期（Active）与维护期（Maintenance)
- 活跃期(Active)共18个月，主要在不改变兼容性的情况下，周期性修改自身Bug与合并其他版本的重要修改
- 维护期（Maintenance)共12个月，只负责修改本版本的Bug以及特别紧急的如安全性问题。

## 版本选择
LTS代表“Long Term Support（长期支持）”，Current代表“当前的”。Current就代表最新发布的版本（每6个月一次的），它可能是奇数版本也可能是偶数版本。因为其是最新的，所以包含Node.js平台的最新特性。而LTS代表了一个被不断修正与改进的版本。每个时刻Current版本只有一个，LTS版本可能有3个，LTS-Active版本可能有2个.

在Node.js官网中给出的LTS版本总是处于LTS的最新版本（目前是10.15.1），根据发布计划，该版本处于活跃期(Ative)我们可以看到其MINOR版本在不断升级过程中。

## 适用场景
Node.js适合做一些高并发的，I/O密集型的应用。

当应用程序需要处理大量并发的I/O，而在向客户端发出响应之前，应用程序内部并不需要进行非常复杂的处理的时候，Node.js非常适合。Node.js也非常适合与web socket配合，开发长连接的实时交互应用程序。
  


## Node.js优点
采用事件驱动、异步编程，为网络服务而设计。其实Javascript的匿名函数和闭包特性非常适合事件驱动、异步编程。而且JavaScript也简单易学，很多前端设计人员可以很快上手做后端设计。

Node.js非阻塞模式的IO处理给Node.js带来在相对低系统资源耗用下的高性能与出众的负载能力，非常适合用作依赖其它IO资源的中间层服务。

Node.js轻量高效，可以认为是数据密集型分布式部署环境下的实时应用系统的完美解决方案。Node非常适合如下情况：在响应客户端之前，您预计可能有很高的流量，但所需的服务器端逻辑和处理不一定很多。

单进程，节约资源

异步I/O，提升并发量



## Node.js缺点
可靠性低, 一旦出现未捕获的异常将直接导致服务不可用.

单进程，单线程，只支持单核CPU，不能充分的利用多核CPU服务器。一旦这个进程崩掉，那么整个web服务就崩掉了。

>以上缺点可以可以通过代码的健壮性来弥补。使用cluster模式开启多个进程。 设置全局异常捕获器。