Google Protocol Buffer( 简称 Protobuf) 是 Google 公司内部的混合语言数据标准，目前已经正在使用的有超过 48,162 种报文格式定义和超过 12,183 个 .proto 文件。他们用于 RPC 系统和持续数据存储系统。

Protocol Buffers 是一种轻便高效的结构化数据存储格式，可以用于结构化数据串行化，或者说序列化。它很适合做数据存储或 RPC 数据交换格式。可用于通讯协议、数据存储等领域的语言无关、平台无关、可扩展的序列化结构数据格式。

- Google开源： https://github.com/google/protobuf/
- Golang的官方protobuf支持: https://github.com/golang/protobuf
- 使用和原理：http://www.ibm.com/developerworks/cn/linux/l-cn-gpb/

# Protobuf 特点
- 语言无关，平台无关
  - Protobuf支持Java, C++, Python等多种语言，支持多个平台。
- 高效
  - 比XML更小（3~10倍），更快（20 ~ 100倍），更为简单。
- 扩展性，兼容性好
  - 你可以更新数据结构，而不影响和破坏原有的旧程序。

# Protobuf 的优点
简单说来 Protobuf 的主要优点就是：简单，快。

Protobuf 有如 XML，不过它更小、更快、也更简单。你可以定义自己的数据结构，然后使用代码生成器生成的代码来读写这个数据结构。你甚至可以在无需重新部署程序的情况下更新数据结构。只需使用 Protobuf 对数据结构进行一次描述，即可利用各种不同语言或从各种不同数据流中对你的结构化数据轻松读写。

它有一个非常棒的特性，即“向后”兼容性好，人们不必破坏已部署的、依靠“老”数据格式的程序就可以对数据结构进行升级。这样您的程序就可以不必担心因为消息结构的改变而造成的大规模的代码重构或者迁移的问题。因为添加新的消息中的 field 并不会引起已经发布的程序的任何改变。

Protobuf 语义更清晰，无需类似 XML 解析器的东西（因为 Protobuf 编译器会将 .proto 文件编译生成对应的数据访问类以对 Protobuf 数据进行序列化、反序列化操作）。

使用 Protobuf 无需学习复杂的文档对象模型，Protobuf 的编程模式比较友好，简单易学，同时它拥有良好的文档和示例，对于喜欢简单事物的人们而言，Protobuf 比其他的技术更加有吸引力。

# Protobuf 的不足
Protbuf 与 XML 相比也有不足之处。它功能简单，无法用来表示复杂的概念。

XML 已经成为多种行业标准的编写工具，Protobuf 只是 Google 公司内部使用的工具，在通用性上还差很多。

由于文本并不适合用来描述数据结构，所以 Protobuf 也不适合用来对基于文本的标记文档（如 HTML）建模。另外，由于 XML 具有某种程度上的自解释性，它可以被人直接读取编辑，在这一点上 Protobuf 不行，它以二进制的方式存储，除非你有 .proto 定义，否则你没法直接读出 Protobuf 的任何内容

# Protobuf 使用
创建.proto文件，定义数据结构
```txt
//例：在xxx.proto文件中定义Example1 message
message Example1{
	optional string stringVal =1;
	optional bytes bytesVal =2;
	message EmbeddedMessage{
		int32 int32Val = 1;
		string stringVal = 2;
	}
	optional EmbededMessage embeddedExample = 3;
	repeated int32 repeatedInt32Val = 4;
	repeated string repeatedStringVal = 5;	
}
```
我们在上例中定义了一个名为 Example1 的 消息，语法很简单，message 关键字后跟上消息名称：
```txt
message xxx{
}
```
之后我们在其中定义了message具有的字段，形式为：
```txt
message xxx {
  // 字段规则：required -> 字段只能也必须出现 1 次
  // 字段规则：optional -> 字段可出现 0 次或多次
  // 字段规则：repeated -> 字段可出现任意多次（包括 0）
  // 类型：int32、int64、sint32、sint64、string、32-bit ....
  // 字段编号：0 ~ 536870911（除去 19000 到 19999 之间的数字）
  字段规则 类型 名称 = 字段编号;
}
```
在上例中，我们定义了：

类型string，名为stringVal的optional可选字段，字段编号为1，此字段可出现0次或1次

类型bytes，名为bytesVal的optional可选字段，字段编号为2，此字段可出现0次或1次

类型 EmbeddedMessage（自定义的内嵌 message 类型），名为 embeddedExample1 的 optional 可选字段，字段编号为 3，此字段可出现 0 或 1 次

类型 int32，名为 repeatedInt32Val 的 repeated 可重复字段，字段编号为 4，此字段可出现 任意多次（包括 0）

类型 string，名为 repeatedStringVal 的 repeated 可重复字段，字段编号为 5，此字段可出现 任意多次（包括 0）

---


参考资源:

[Google Protocol Buffer 的使用和原理](https://www.ibm.com/developerworks/cn/linux/l-cn-gpb/index.html)

[深入 ProtoBuf - 简介](https://www.jianshu.com/p/a24c88c0526a)

[学习Cap'n proto](https://www.jianshu.com/p/f1110b22cb5c)

[FlatBuffers详解](http://www.voidcn.com/article/p-xtbacuzn-bqm.html)