
# MongoDB 知识点
- [存储引擎](#存储引擎)
- [索引](#索引)
- [调优](#调优)
- [锁](#锁)
- [事务](#事务)
- [日志系统](#日志系统)
- [复制集](#复制集)
- [分片集群](#分片集群)

## 存储引擎
从MongoDB 3.2 版本开始，MongoDB 支持多数据存储引擎，MongoDB支持的存储引擎有：WiredTiger，MMAPv1和In-Memory。

MongoDB 3.2 开始默认的存储引擎是WiredTiger，3.3版本之前的默认存储引擎是MMAPv1，MongoDB4.x版本不再支持MMAPv1存储引擎。

MongoDB不仅能将数据持久化存储到硬盘文件中，而且还能将数据只保存到内存中；In-Memory存储引擎用于将数据只存储在内存中，只将少量的元数据和诊断日志（Diagnostic）存储到硬盘文件中，由于不需要Disk的IO操作，就能获取索取的数据，In-Memory存储引擎大幅度降低了数据查询的延迟（Latency）

### WiredTiger
mongodb3.2开始mongodb默认支持WiredTiger存储引擎

WiredTiger存储引擎的主要优势：

#### 最大化可用缓存： 
WiredTiger最大限度地利用可用内存作为缓存来减少I / O瓶颈。

使用了两个缓存：WiredTiger缓存和文件系统缓存。
- WiredTiger缓存存储未压缩的数据并提供类似内存的性能。
- 操作系统的文件系统缓存存储压缩数据。
- 当在WiredTiger缓存中找不到数据时，WiredTiger将在文件系统缓存中查找数据。

WiredTiger缓存在保存尽可能多的工作集时表现最佳。但是，为需要它的其他进程（如操作系统，包括文件系统缓存）保留内存也很重要。这也包括MongoDB本身，整体上消耗的内存比WiredTiger主动使用的内存多。

MongoDB默认为WiredTiger缓存大小约为RAM的60％。离开文件系统缓存的最小量是可用内存的20％。任何较低的操作系统都可能受限于资源。


#### 高吞吐量： 
WiredTiger使用“写入时复制” - 当文档更新时，WiredTiger将制作文档的新副本并确定最新版本以返回给读者。此方法允许多个客户端同时修改集合中的不同文档，从而实现更高的并发性和吞吐量。当应用程序使用具有多个内核的主机（越多越好）并且多个线程正在写入不同的文档时，实现最佳写入性能。

#### 减少存储空间并改善磁盘IOP： 
WiredTiger使用压缩算法来减少磁盘上存储的数据量。不仅存储减少了，而且随着从磁盘读取或写入更少的位，IOP性能也会提高。某些类型的文件比其他文件压缩得更好。文本文件是高度可压缩的，而二进制数据可能不是可压缩的，因为它可能已经被编码和压缩。使用压缩时，WiredTiger会产生额外的CPU周期，但用户可以配置压缩方案以优化CPU开销与压缩比。Snappy是默认的压缩引擎，在高压缩率和低CPU开销之间提供了良好的平衡。Zlib将实现更高的压缩比，但会产生额外的CPU周期。

#### 压缩（索引和journals日志）：
索引可以在内存和磁盘上压缩。WiredTiger利用前缀压缩来压缩索引，节省RAM使用以及释放存储IOP。默认情况下，使用Snappy压缩压缩journals日志。

#### 多核可扩展性：
随着CPU制造商缩小到更小的平版印刷，功耗变得越来越成问题，处理器趋势已转向多核架构，以维持摩尔定律的节奏。WiredTiger在设计时考虑了现代的多核架构，并提供跨多核系统的可扩展性。危险指针，无锁算法和快速锁存等编程技术可最大限度地减少线程之间的争用。线程可以执行操作而不会相互阻塞 - 从而减少线程争用，更好的并发性和更高的吞吐量。

WiredTiger允许用户为其读取指定隔离级别。读取操作可以返回大部分副本集已接受或提交到磁盘的数据视图。这样可以保证应用程序只读取在发生故障时仍然存在的数据，并且在将新的副本集成员提升为主要成员时不会回滚。


#### 内存使用
在上面提到过：【最大化可用缓存： WiredTiger最大限度地利用可用内存作为缓存来减少I / O瓶颈。使用了两个缓存：WiredTiger缓存和文件系统缓存。WiredTiger缓存存储未压缩的数据并提供类似内存的性能。操作系统的文件系统缓存存储压缩数据。当在WiredTiger缓存中找不到数据时，WiredTiger将在文件系统缓存中查找数据。】

mongodb从3.4版本开始默认使用内存为下面两个中的最大一个：
- 50% of (RAM - 1 GB)
- 256MB
- 
默认情况下，WiredTiger对所有集合使用Snappy块压缩，对所有索引使用前缀压缩。压缩默认值可在全局级别配置，也可以在集合和索引创建时单独指定压缩级别。



#### 文档级并发
WiredTiger使用文档级并发控制进行写操作。因此，多个客户端可以同时修改集合的不同文档。

对于大多数读写操作，WiredTiger使用乐观并发控制。WiredTiger仅在全局，数据库和集合级别使用意图锁。当存储引擎检测到两个操作之间的冲突时，会发生写入冲突，导致MongoDB透明地重试该操作。

一些全局操作（通常是涉及多个数据库的短期操作）仍然需要全局“实例范围”锁定。其他一些操作（例如删除集合）仍需要独占数据库锁。

#### checkpoint
在Checkpoint操作开始时，WiredTiger提供指定时间点（point-in-time）的数据库快照（Snapshot），该Snapshot呈现的是内存中数据的一致性视图。当向Disk写入数据时，WiredTiger将Snapshot中的所有数据以一致性方式写入到数据文件（Disk Files）中。一旦Checkpoint创建成功，WiredTiger保证数据文件和内存数据是一致性的，因此，Checkpoint担当的是还原点（Recovery Point），Checkpoint操作能够缩短MongoDB从Journal日志文件还原数据的时间。

当WiredTiger创建Checkpoint时，MongoDB将数据刷新到数据文件（Disk Files）中，在默认情况下，WiredTiger创建Checkpoint的时间间隔是60s，或产生2GB的Journal文件。在WiredTiger创建新的Checkpoint期间，上一个Checkpoint仍然是有效的，这意味着，即使MongoDB在创建新的Checkpoint期间遭遇到错误而异常终止运行，只要重启，MongoDB就能从上一个有效的Checkpoint开始还原数据。

当MongoDB以原子方式更新WiredTiger的元数据表，使其引用新的Checkpoint时，表明新的Checkpoint创建成功，MongoDB将老的Checkpoint占用的Disk空间释放。使用WiredTiger 存储引擎，如果没有记录数据更新的日志，MongoDB只能还原到上一个Checkpoint；如果要还原在上一个Checkpoint之后执行的修改操作，必须使用Jounal日志文件。

#### journal日志
WiredTiger使用预写日志的机制，在数据更新时，先将数据更新写入到日志文件，然后在创建Checkpoint操作开始时，将日志文件中记录的操作，刷新到数据文件，就是说，通过预写日志和Checkpoint，将数据更新持久化到数据文件中，实现数据的一致性。WiredTiger 日志文件会持久化记录从上一次Checkpoint操作之后发生的所有数据更新，在MongoDB系统崩溃时，通过日志文件能够还原从上次Checkpoint操作之后发生的数据更新。

#### disk回收：
当从MongoDB中删除文档（Documents）或集合（Collections）后，MongoDB不会将Disk空间释放给OS，MongoDB在数据文件（Data Files）中维护Empty Records的列表。当重新插入数据后，MongoDB从Empty Records列表中分配存储空间给新的Document，因此，不需要重新开辟空间。为了更新有效的重用Disk空间，必须重新整理数据碎片。

#### 压缩
使用WiredTiger，MongoDB支持对所有集合和索引进行压缩。压缩可以以额外的CPU为代价最大限度地减少磁盘的使用。

默认情况下WiredTiger存储引擎使用snappy方式压缩所有集合，前缀压缩方式压缩索引。

对于集合的压缩还可以使用zlib方式压缩。



### MongoDB内存存储引擎  In-Memory 

从MongoDB Enterprise 3.2.6开始，In-Memory内存存储引擎是64位版本中通用可用性（GA）的一部分。除某些元数据和诊断数据外，In-Memory内存存储引擎不维护任何磁盘上的数据，包括配置数据、索引、用户凭据等。

通过避免磁盘I / O，内存中存储引擎使数据库操作的延迟更可预测。

#### 并发
in-memory内存存储引擎将文档级并发控制用于写入操作。因此，多个客户端可以同时修改集合的不同文档。

#### 内存使用
内存存储引擎要求其所有数据（包括索引，oplog（如果mongod实例是副本集的一部分）等）必须适合指定的–inMemorySizeGB命令行选项或 YAML配置文件中的storage.inMemory.engineConfig.inMemorySizeGB设置。

默认情况下，in-memory 内存存储引擎使用50％的（物理RAM减去1GB）。

#### 持久性
内存中存储引擎是非持久性的，不会将数据写入持久性存储。非持久数据包括应用程序数据和系统数据，例如用户，权限，索引，副本集配置，分片群集配置等。

因此，日志或等待数据变得持久的概念不适用于内存中的存储引擎。


#### 部署架构
除了独立运行外，使用in-memory内存存储引擎的mongod实例还可以作为副本集的一部分或分片群集的一部分运行。

#### 复制集
可以部署将in-memory内存存储引擎用作副本集一部分的mongod实例。例如，作为三副本集的一部分，您可能需要修改配置：

两个mongod实例与内存存储引擎一起运行。
一个使用WiredTiger存储引擎运行的mongod实例。将WiredTiger成员配置为隐藏成员（即hidden：true和优先级：0）。
使用此部署模型，只有与in-memory内存存储引擎一起运行的mongod实例才能成为主要实例。客户端仅连接到内存存储引擎mongod实例。即使两个运行内存存储引擎的mongod实例都崩溃并重新启动，它们也可以从运行WiredTiger的成员进行同步。与WiredTiger一起运行的隐藏mongod实例会将数据持久保存到磁盘，包括用户数据，索引和复制配置信息。

#### 分片集群
可以将使用内存存储引擎的mongod实例部署为分片群集的一部分。例如，在分片群集中，您可以拥有一个由以下副本集组成的分片：

两个mongod实例与内存存储引擎一起运行
一个WiredTiger存储引擎运行的mongod实例。将WiredTiger成员配置为隐藏成员（即hidden：true和优先级：0）。
在此分片节点上，添加标记inmem。例如，如果此分片的名称为shardC，请连接到mongos并运行sh.addShardTag（）命令，添加标签。


## 索引
MongoDB中的索引和其他数据库索引类似，也是使用B-Tree结构。MongoDB的索引是在collection级别上的，并且支持在任何列或者集合内的文档的子列中创建索引。

Mongodb的索引默认使用的是B-tree这一特殊的数据结

B-tree索引具有分层树结构，树顶部是header block，包含指向任何给定范围的键值的适当branch block的指针。而branch block通常会指向适当的leaf block以获得更具体的范围，或者对于更大的索引会继续指向branch block然后到leaf block，因为leaf block上才包含一个键值列表和指向磁盘上文档位置的指针。

而B-tree索引具有以下优点：

1. 由于每个叶子节点处于相同的深度，所以性能是非常可预测的。 从理论上讲，集合中的任何文档都不会超过三或四次I/O。

2. B树为大型集合提供了良好的性能，因为深度最多为四个（一个头部块，两个分支块级别和一个叶子块级别）。 一般来说，没有任何文件需要四个以上的I/O来定位。 实际上，因为头部块几乎总是已经加载到内存中，而分支块通常加载到内存中，所以实际的物理磁盘读取次数通常只有一次或两次。

3. 因为与前一个和后一个叶子块的链接，所以B-tree索引支持范围查询以及精确的查找是可行的。


### 索引类型
mongoDB支持_id索引 、单键索引、多键索引（当一个被索引的值是数组时，MongoDB会索引这个数组中的每一个元素。更多信息在 multikey模块有详细说明）、复合索引（多个字段，可以分别指定升降序）、时期过期索引（过一段时间索引失效）、全文索引、地理位置索引、稀疏索引（允许索引的字段为空值，建立时跳过）、部分索引（对满足条件的字段建立索引，比如给月工资1W以上的小伙伴建立索引）

#### 默认_id 索引
MongoDB 在创建集合期间在_id字段上创建了唯一索引。该索引可防止客户端插入两个_id字段值相同的文档。_id字段的索引不能删除。

#### 单字段索引 （Single Field Index）
除MongoDB定义的_id索引外，MongoDB还支持在文档的单个字段上创建用户定义的升序/降序索引。

对于单字段索引和排序操作，索引键的排序顺序（即升序或降序）无关紧要，因为MongoDB可以在任一方向上遍历索引。

#### 复合索引
MongoDB支持用户在多个字段上定义索引，即 复合索引。

复合索引中字段的顺序很重要。例如，如果复合索引为{ userid: 1, score: -1 }，则索引首先以userid字段进行排序，然后在每个userid 值以score字段进行排序。

对于复合索引和排序操作，索引键的排序顺序（即升序或降序）可以确定索引是否可以支持排序操作。有关索引顺序对复合索引中结果的影响的详细信息，请参阅 排序顺序。

#### 多键索引
MongoDB使用多键索引来索引存储在数组中的内容。如果索引字段包含数组值，MongoDB会为数组的每个元素创建单独的索引条目。这些多键索引允许查询通过匹配数组中的元素来获取包含数组的文档。如果索引字段包含数组值，MongoDB会自动决定是否需要创建多键索引; 不需要显式指定多键类型。

多键索引和多键索引边界 获取有关多键索引的详细信息。

#### 地理空间索引

为了支持对地理空间坐标数据的高效查询，MongoDB提供了两个特殊索引：返回结果时使用平面几何的2d索引和使用球面几何的2dphere索引。

有关地理空间索引的更多介绍，请参阅2d Index Internals。

#### 文本索引

MongoDB提供了一种text索引类型，支持在集合中搜索字符串内容。这些文本索引不存储特定于语言的停用词（例如“the”，“a”，“or”），并且集合中的词干均仅存储词根。
有关文本索引和搜索的详细信息，请参阅文本索引。

#### 哈希索引

为了支持基于哈希的分片，MongoDB提供了哈希索引类型，索引字段值的哈希值。这些索引在其范围内具有更随机的值分布，但仅 支持等值匹配且不支持范围查询。

### 索引属性
1. 唯一索引:索引的唯一属性会导致MongoDB拒绝索引字段的重复值。除了唯一约束之外，唯一索引在功能上可与其他MongoDB索引互换。
2. 部分索引: 
    - 3.2版本的新功能。
    - 部分索引仅索引符合特定的过滤表达式的集合中的文档。通过索引集合中的文档子集，部分索引具有较低的存储要求，减少索引创建和维护的性能成本
    - 部分索引是稀疏索引功能的超集，应该优先于稀疏索引。
3. 稀疏索引
   - 索引的稀疏属性可确保索引仅包含具有索引字段的文档的条目。索引会跳过没有索引字段的文档。
   - 将稀疏索引与唯一索引组合，以拒绝具有字段重复值的文档，但忽略没有索引键的文档。
4. TTL索引:TTL索引是MongoDB在指定时间后自动从集合中删除文档的特殊索引。这是某些类型的信息理想选择，例如机器生成的事件数据，日志和会话信息，这些信息只需要在数据库中保存有限的时间。

#### 覆盖查询
当查询标准和查询投影仅包含索引字段，MongoDB的可以直接从索引返回结果，无需扫描的任何文档或文档加载到内存。这些覆盖的查询可以非常有效。

#### 交叉索引
2.6版中的新功能。

MongoDB可以使用交叉索引来完成查询。对于指定复合查询条件的查询，如果一个索引可以满足查询条件的一部分，而另一个索引可以满足查询条件的另一部分，则MongoDB可以使用两个索引的交集来完成查询。使用复合索引还是使用索引交集更有效取决于具体的查询和系统。


## 调优
### db profiling

MongoDB支持对DB的请求进行profiling，目前支持3种级别的profiling。
- 0： 不开启profiling
- 1： 将处理时间超过某个阈值(默认100ms)的请求都记录到DB下的system.profile集合 （类似于mysql、redis的slowlog）
- 2： 将所有的请求都记录到DB下的system.profile集合（生产环境慎用）

常，生产环境建议使用1级别的profiling，并根据自身需求配置合理的阈值，用于监测慢请求的情况，并及时的做索引优化。

如果能在集合创建的时候就能『根据业务查询需求决定应该创建哪些索引』，当然是最佳的选择；但由于业务需求多变，要根据实际情况不断的进行优化。索引并不是越多越好，集合的索引太多，会影响写入、更新的性能，每次写入都需要更新所有索引的数据；所以你system.profile里的慢请求可能是索引建立的不够导致，也可能是索引过多导致。

### 通过explain结果来分析性能
我们往往会通过打点数据来分析业务的性能瓶颈，这时，我们会发现很多瓶颈都是出现在数据库相关的操作上，这时由于数据库的查询和存取都涉及大量的IO操作，而且有时由于使用不当，会导致IO操作的大幅度增长，从而导致了产生性能问题。而MongoDB提供了一个explain工具来用于分析数据库的操作。

## 锁

MongoDB 使用的是“readers-writer”锁， 可以支持并发但有很大的局限性当一个读锁存在,许多读操作可以使用这把锁，然而, 当一个写锁的存在，一个单一的写操作会”exclusively“持有该锁，同一时间其它写操作不能使用共享这个锁；

举个例子，假设一个集合里有10个文档，多个update操作不能并发在这个集合上，即使是更新不同的文档。

### 锁的粒度

在 2.2 版本以前，一个mongodb实例一个写锁，多个读锁。也就是说mongod 只有全局锁(锁定一个server)；

在2.2-3.0的版本，一个数据库一个写锁，多个读锁。例如如果一个 mongod 实例上有 5 个库，如果只对一个库中的一个集合执行写操作，那么在写操作过程中，这个库被锁；而其它 4 个库不影响。相比 RDBMS 来说，这个粒度已经算很大了！

在3.0之后的版本，WiredTiger提供了文档（不是集合）级别的锁。

更新：MongoDB 3.4版本，写操作的锁定粒度在表中数据记录(document)级别，即使操作对象可能是多条数据，每条数据在被写入时都会被锁定，防止其他进程写入；但是写操作是非事务性的，即写入多条数据，即使当前写入操作还没有完成，前面已经写入的数据也可以被其他进程修改。除非指定了$isolated，一次写入操作影响的数据无法在本次操作结束之前被其他进程修改。

$isolated也是非事务性的，即如果写入过程出错，已经完成的写入操作不会被rollback；另外，
$isolated需要额外的锁，无法用于sharded方式部署的集群。

### MongoDB高吞吐的原因：

MongoDB 没有完整事务支持，操作原子性只到单个 document 级别，所以通常操作粒度比较小；
MongoDB 锁实际占用时间是内存数据计算和变更时间，通常很快；
MongoDB 锁有一种临时放弃机制，当出现需要等待慢速 IO 读写数据时，可以先临时放弃，等 IO 完成之后再重新获取锁。

### 哪些操作会对数据库产生锁？

下表列出了常见数据库操作产生的锁。

操作	锁定类型

查询	读锁

通过cursor读取数据	读锁

插入数据	写锁

删除数据	写锁

修改数据	写锁

Map-reduce	读写锁均有，除非指定为non-atomic，部分mapreduce任务可以同时执行(猜测是生成的中间表不冲突的情况下)

添加index	通过前台API添加index，锁定数据库一段时间

db.eval()	写锁，同时阻塞其他运行在MongoDB上的JavaScript进程

eval	写锁，如果设定锁定选项是nolock，则不会有些锁，而且eval无法向数据库写入数据

aggregate()	读锁


### 如何查看锁的状态
```sql
db.serverStatus()
db.currentOp()
mongotop # 类似top命令，每秒刷新
mongostat
the MongoDB Monitoring Service (MMS)
```

### 哪些数据库管理操作会锁数据库？

某些数据库管理操作会 exclusively 锁住数据库，以下命令需要申请 exclusively 锁，并锁定一段时间
```sql
db.collection.ensureIndex(),
reIndex,
compact,
db.repairDatabase(),
db.createCollection(), when creating a very large (i.e. many gigabytes) capped collection,
db.collection.validate(),
db.copyDatabase() # 可能会锁定所有数据库(database)
```

以下命令需要申请 exclusively 锁，但锁定很短时间。
```sql
db.collection.dropIndex(),
db.collection.getLastError(),
db.isMaster(),
rs.status() (i.e. replSetGetStatus,)
db.serverStatus(),
db.auth(), and
db.addUser().
```

备注：可见，一些查看命令也会锁库，在比较繁忙的生产库中，也会有影响的。

### MongoDB内部可能锁住所有库的操作

以下数据库内部操作会锁定多个库。

日志管理 MongoDB的内部操作，每个一段时间就锁定所有数据库，所有的数据库共享一份日志
用户认证 锁定admin数据库和用户正在申请访问的数据库
所有写入备份数据库(replica)的操作都会锁定写入目标数据库和本地数据库，本地数据库的写入锁允许写入主节点的oplog


## 事务
Mongodb从3.0开始默认使用的是WiredTiger引擎, WiredTiger引擎可以针对单个文档来保证ACID特性，但是当需要操作多个文档的时候无法保证ACID，也即无法提供事务支持。

### 单文档的ACID
MongoDB在更新单个文档时，会对该文档加锁，而要理解MongoDB的锁机制，需要先了解以下几个概念：

- Intent Lock（我把它翻译为意图锁): 意图锁表明读写方(reader-writer)意图针对更细粒度的资源进行读取或写入操作。比如：如果当某个Collection被加了intent lock，那么说明读写方意图针对该Collection中的某个文档进行读或写的操作。

- Multiple granularity locking (我把它翻译为多粒度锁机制): MongoDB采用的是所谓的MGL多粒度锁机制，具体可以参考文末的wiki链接。简单来说就是结合了多种不同粒度的锁，包括S锁（Shared lock），X锁（Exclusive lock), IS锁(Intent Share lock), IX(Intent Exclusive lock)


- 所有的锁都是平等的，它们是排在一个队列里，符合FIFO原则。但是，MongoDB做了优化，即当一个锁被采用时，所有与它兼容的锁（即上表为yes的锁）都会被采纳，从而可以并发操作。举个例子，当你针对Collection A中的Document a使用S锁时，其它reader可以同时使用S锁来读取该Document a，也可以同时读取同一个Collection的Document b.因为所有的S锁都是兼容的。那么，如果此时针对Collection A中的Document c进行写操作是否可以呢？显然需要为Document c赋予x锁，此时Collection A就需要IX锁，而由于IX和IS是兼容的，所以没有问题。简单来说，只要不是同一个Document，读写操作是可以并发的；如果是同一个Document，读可以并发，但写不可以。

- WiredTiger针对global, db, collection level只能使用intent lock。另外，针对冲突的情况，WiredTiger会自动重试。

### Session
Session 是 MongoDB 3.6 版本引入的概念，引入这个特性主要就是为实现多文档事务做准备。Session 本质上就是一个「上下文」。

在以前的版本，MongoDB 只管理单个操作的上下文，mongod 服务进程接收到一个请求，为该请求创建一个上下文 （源码里对应 OperationContext），然后在服务整个请求的过程中一直使用这个上下文，内容包括，请求耗时统计、请求占用的锁资源、请求使用的存储快照等信息。有了 Session之后，就可以让多个请求共享一个上下文，让多个请求产生关联，从而有能力支持多文档事务。

每个 Session 包含一个唯一的标识 lsid，在 4.0 版本里，用户的每个请求可以指定额外的扩展字段，主要包括：
- lsid: 请求所在 Session 的 ID， 也称 logic session id
- txnNmuber： 请求对应的事务号，事务号在一个 Session 内必须单调递增
- stmtIds： 对应请求里每个操作（以insert为例，一个insert命令可以插入多个文档）操作ID

实际上，用户在使用事务时，是不需要理解这些细节，MongoDB Driver 会自动处理，Driver 在创建 Session 时分配 lsid，接下来这个 Session 里的所以操作，Driver 会自动为这些操作加上 lsid，如果是事务操作，会自动带上 txnNumber。

值得一提的是，Session lsid 可以通过调用 startSession 命令让 server 端分配，也可以客户端自己分配，这样可以节省一次网络开销；而事务的标识，MongoDB 并没有提供一个单独的 startTransaction的命令，txnNumber 都是直接由 Driver 来分配的，Driver 只需保证一个 Session 内，txnNumber 是递增的，server 端收到新的事务请求时，会主动的开始一个新事务。

MongoDB 在 startSession 时，可以指定一系列的选项，用于控制 Session 的访问行为，主要包括：

- causalConsistency： 是否提供 causal consistency 的语义，如果设置为true，不论从哪个节点读取，MongoDB 会保证 "read your own write" 的语义。参考 causal consistency
- readConcern：参考 MongoDB readConcern 原理解析
- writeConcern：参考 MongoDB writeConcern 原理解析
- readPreference： 设置读取时选取节点的规则，参考 read preference
- retryWrites：如果设置为true，在复制集场景下，MongoDB 会自动重试发生重新选举的场景; 

### ACID
Atomic

针对多文档的事务操作，MongoDB 提供 "All or nothing" 的原子语义保证。

Consistency

太难解释了，还有抛弃 Consistency 特性的数据库？

Isolation

MongoDB 提供 snapshot 隔离级别，在事务开始创建一个 WiredTiger snapshot，然后在整个事务过程中使用这个快照提供事务读。

Durability

事务使用 WriteConcern {j: ture} 时，MongoDB 一定会保证事务日志提交才返回，即使发生 crash，MongoDB 也能根据事务日志来恢复；而如果没有指定 {j: true} 级别，即使事务提交成功了，在 crash recovery 之后，事务的也可能被回滚掉。

### 事务与复制
复制集配置下，MongoDB 整个事务在提交时，会记录一条 oplog（oplog 是一个普通的文档，所以目前版本里事务的修改加起来不能超过文档大小 16MB的限制），包含事务里所有的操作，备节点拉取oplog，并在本地重放事务操作。

整个重放过程如下：

- 获取当前 Batch （后台不断拉取 oplog 放入 Batch）
- 设置 OplogTruncateAfterPoint 时间戳为 Batch里第一条 oplog 时间戳 （存储在 local.replset.oplogTruncateAfterPoint 集合）
- 写入 Batch 里所有的 oplog 到 local.oplog.rs 集合，根据 oplog 条数，如果数量较多，会并发写入加速
- 清理 OplogTruncateAfterPoint, 标识 oplog 完全成功写入；如果在本步骤完成前 crash，重启恢复时，发现 oplogTruncateAfterPoint 被设置，会将 oplog 截短到该时间戳，以恢复到一致的状态点。
- 将 oplog 划分到到多个线程并发重放，为了提升并发效率，事务产生的 oplog 包含的所有修改操作，跟一条普通单条操作的 oplog 一样，会据文档ID划分到多个线程。
- 更新 ApplyThrough 时间戳为 Batch 里最后一条 oplog 时间戳，标识下一次重启后，从该位置重新同步，如果本步骤之前失败，重启恢复时，会从 ApplyThrough 上一次的值（上一个 Batch 最后一条 oplog）拉取 oplog。
- 更新 oplog 可见时间戳，如果有其他节点从该备节点同步，此时就能读到这部分新写入的 oplog
- 更新本地 Snapshot（时间戳），新的写入将对用户可见。

### 事务与存储引擎
事务时序统一

WiredTiger 很早就支持事务，在 3.x 版本里，MongoDB 就通过 WiredTiger 事务，来保证一条修改操作，对数据、索引、oplog 三者修改的原子性。但实际上 MongoDB 经过多个版本的迭代，才提供了事务接口，核心难点就是时序问题。

MongoDB 通过 oplog 时间戳来标识全局顺序，而 WiredTiger 通过内部的事务ID来标识全局顺序，在实现上，2者没有任何关联。这就导致在并发情况下， MongoDB 看到的事务提交顺序与 WiredTiger 看到的事务提交顺序不一致。

为解决这个问题，WiredTier 3.0 引入事务时间戳（transaction timestamp）机制，应用程序可以通过 WT_SESSION::timestamp_transaction 接口显式的给 WiredTiger 事务分配 commit timestmap，然后就可以实现指定时间戳读（read "as of" a timestamp）。有了 read "as of" a timestamp 特性后，在重放 oplog 时，备节点上的读就不会再跟重放 oplog 有冲突了，不会因重放 oplog 而阻塞读请求，这是4.0版本一个巨大的提升。

### 事务对 cache 的影响
WiredTiger(WT) 事务会打开一个快照，而快照的存在的 WiredTiger cache evict 是有影响的。一个 WT page 上，有N个版本的修改，如果这些修改没有全局可见（参考 __wt_txn_visible_all），这个 page 是不能 evict 的（参考 __wt_page_can_evict）。

在 3.x 版本里，一个写请求对数据、索引、oplog的修改会放到一个 WT 事务里，事务的提交由 MongoDB 自己控制，MongoDB 会尽可能快的提交事务，完成写清求；但 4.0 引入事务之后，事务的提交由应用程序控制，可能出现一个事务修改很多，并且很长时间不提交，这会给 WT cache evict 造成很大的影响，如果大量内存无法 evict，最终就会进入 cache stuck 状态。

为了尽量减小 WT cache 压力，MongoDB 4.0 事务功能有一些限制，但事务资源占用超过一定阈值时，会自动 abort 来释放资源。规则包括

- 事务的生命周期不能超过 transactionLifetimeLimitSeconds （默认60s），该配置可在线修改
- 事务修改的文档数不能超过 1000 ，不可修改
- 事务修改产生的 oplog 不能超过 16mb，这个主要是 MongoDB 文档大小的限制， oplog 也是一个普通的文档，也必须遵守这个约束。

### Read as of a timestamp 与 oldest timestamp
Read as of a timestamp 依赖 WiredTiger 在内存里维护多版本，每个版本跟一个时间戳关联，只要 MongoDB 层可能需要读的版本，引擎层就必须维护这个版本的资源，如果保留的版本太多，也会对 WT cache 产生很大的压力。

WiredTiger 提供设置 oldest timestamp 的功能，允许由 MongoDB 来设置该时间戳，含义是Read as of a timestamp 不会提供更小的时间戳来进行一致性读，也就是说，WiredTiger 无需维护 oldest timestamp 之前的所有历史版本。MongoDB 层需要频繁（及时）更新 oldest timestamp，避免让 WT cache 压力太大。

### 引擎层 Rollback 与 stable timestamp
在 3.x 版本里，MongoDB 复制集的回滚动作是在 Server 层面完成，但节点需要回滚时，会根据要回滚的 oplog 不断应用相反的操作，或从回滚源上读取最新的版本，整个回滚操作效率很低。

4.0 版本实现了存储引擎层的回滚机制，当复制集节点需要回滚时，直接调用 WiredTiger 接口，将数据回滚到某个稳定版本（实际上就是一个 Checkpoint），这个稳定版本则依赖于 stable timestamp。WiredTiger 会确保 stable timestamp 之后的数据不会写到 Checkpoint里，MongoDB 根据复制集的同步状态，当数据已经同步到大多数节点时（Majority commited），会更新 stable timestamp，因为这些数据已经提交到大多数节点了，一定不会发生 ROLLBACK，这个时间戳之前的数据就都可以写到 Checkpoint 里了。

MongoDB 需要确保频繁（及时）的更新 stable timestamp，否则影响 WT Checkpoint 行为，导致很多内存无法释放。

### 分布式事务
MongoDB 4.0 支持副本集多文档事务，并计划在 4.2 版本支持分片集群事务功能。



## 日志系统
mongodb中主要有四种日志。分别是系统日志、Journal日志、oplog主从日志、慢查询日志等。

### 1.系统日志
系统日志在Mongdb数据中很中重要，它记录mongodb启动和停止的操作，以及服务器在运行过程中发生的任何异常信息；配置系统日志也非常简单，在运行mongod时候增加一个参数logpath，就可以设置；

### 2. Journal日志
Jouranl日志通过预写入的redo日志为mongodb增加了额外的可靠性保障。开启该功能时候，数据的更新就先写入Journal日志，定期集中提交（目前是每100ms提交一次） ，然后在正式数据执行更改。启动数据库的Journal功能非常简单，只需在mongod后面指定journal参数即可；

### 3. Oplog主从日志
Mongodb的高可用复制策略有一个叫做Replica Sets.ReplicaSet复制过程中有一个服务器充当主服务器，而一个或多个充当从服务器，主服务将更新写入一个本地的collection中，这个collection记录着发生在主服务器的更新操作。并将这些操作分发到从服务器上。这个日志是Capped Collection。


### 4. 慢查询日志
慢查询记录了执行时间超过了所设定时间阀值的操作语句。慢查询日志对于发现性能有问题的语句很有帮助，建议开启此功能并经常分析该日志的内容。

要配置这个功能只需要在mongod启动时候设置profile参数即可。


## 复制集
一组Mongodb复制集，就是一组mongod进程，这些进程维护同一个数据集合。复制集提供了数据冗余和高等级的可靠性，这是生产部署的基础。

一组复制集就是一组mongod实例掌管同一个数据集，实例可以在不同的机器上面。实例中包含一个主导，接受客户端所有的写入操作，其他都是副本实例，从主服务器上获得数据并保持同步。

主服务器很重要，包含了所有的改变操作（写）的日志。但是副本服务器集群包含有所有的主服务器数据，因此当主服务器挂掉了，就会在副本服务器上重新选取一个成为主服务器。

每个复制集还有一个仲裁者，仲裁者不存储数据，只是负责通过心跳包来确认集群中集合的数量，并在主服务器选举的时候作为仲裁决定结果。

### 复制集的目的
1. 保证数据在生产部署时的冗余和可靠性，通过在不同的机器上保存副本来保证数据的不会因为单点损坏而丢失。能够随时应对数据丢失、机器损坏带来的风险。
2. 换一句话来说，还能提高读取能力，用户的读取服务器和写入服务器在不同的地方，而且，由不同的服务器为不同的用户提供服务，提高整个系统的负载。


### 复制的基本架构
基本的架构由3台服务器组成，一个三成员的复制集，由三个有数据，或者两个有数据，一个作为仲裁者。

#### 具有三个存储数据的成员的复制集有：
- 一个主库；
- 两个从库组成，主库宕机时，这两个从库都可以被选为主库。
- 当主库宕机后,两个从库都会进行竞选，其中一个变为主库，当原主库恢复后，作为从库加入当前的复制集群即可。

#### 当存在arbiter节点
在三个成员的复制集中，有两个正常的主从，及一台arbiter节点：
- 一个主库
- 一个从库，可以在选举中成为主库
- 一个aribiter节点，在选举中，只进行投票，不能成为主库

由于arbiter节点没有复制数据，因此这个架构中仅提供一个完整的数据副本。arbiter节点只需要更少的资源，代价是更有限的冗余和容错。

当主库宕机时，将会选择从库成为主，主库修复后，将其加入到现有的复制集群中即可。


#### Primary选举
复制集通过replSetInitiate命令（或mongo shell的rs.initiate()）进行初始化，初始化后各个成员间开始发送心跳消息，并发起Priamry选举操作，获得『大多数』成员投票支持的节点，会成为Primary，其余节点成为Secondary。

『大多数』的定义

假设复制集内投票成员（后续介绍）数量为N，则大多数为 N/2 + 1，当复制集内存活成员数量不足大多数时，整个复制集将无法选举出Primary，复制集将无法提供写服务，处于只读状态。

通常建议将复制集成员数量设置为奇数，从上表可以看出3个节点和4个节点的复制集都只能容忍1个节点失效，从『服务可用性』的角度看，其效果是一样的。（但无疑4个节点能提供更可靠的数据存储）

#### 所有成员说明 
- Secondary
    - 正常情况下，复制集的Seconary会参与Primary选举（自身也可能会被选为Primary），并从Primary同步最新写入的数据，以保证与Primary存储相同的数据。
    - Secondary可以提供读服务，增加Secondary节点可以提供复制集的读服务能力，同时提升复制集的可用性。另外，Mongodb支持对复制集的Secondary节点进行灵活的配置，以适应多种场景的需求。

- Arbiter
    - Arbiter节点只参与投票，不能被选为Primary，并且不从Primary同步数据。
    - 比如你部署了一个2个节点的复制集，1个Primary，1个Secondary，任意节点宕机，复制集将不能提供服务了（无法选出Primary），这时可以给复制集添加一个Arbiter节点，即使有节点宕机，仍能选出Primary。
    - Arbiter本身不存储数据，是非常轻量级的服务，当复制集成员为偶数时，最好加入一个Arbiter节点，以提升复制集可用性。
- Priority0
    - Priority0节点的选举优先级为0，不会被选举为Primary
    - 比如你跨机房A、B部署了一个复制集，并且想指定Primary必须在A机房，这时可以将B机房的复制集成员Priority设置为0，这样Primary就一定会是A机房的成员。
    - （注意：如果这样部署，最好将『大多数』节点部署在A机房，否则网络分区时可能无法选出Primary）

- Vote0: Mongodb 3.0里，复制集成员最多50个，参与Primary选举投票的成员最多7个，其他成员（Vote0）的vote属性必须设置为0，即不参与投票。
- Hidden: Hidden节点不能被选为主（Priority为0），并且对Driver不可见。因Hidden节点不会接受Driver的请求，可使用Hidden节点做一些数据备份、离线计算的任务，不会影响复制集的服务。

- Delayed
    - Delayed节点必须是Hidden节点，并且其数据落后与Primary一段时间（可配置，比如1个小时）。
    - 因Delayed节点的数据比Primary落后一段时间，当错误或者无效的数据写入Primary时，可通过Delayed节点的数据来恢复到之前的时间点。

#### Priority 0节点
作为一个辅助可以作为一个备用。在一些复制集中，可能无法在合理的时间内添加新成员的时候。备用成员保持数据的当前最新数据能够替换不可用的成员。

#### Hidden 节点（隐藏节点）
客户端将不会把读请求分发到隐藏节点上，即使我们设定了 复制集读选项 。

这些隐藏节点将不会收到来自应用程序的请求。我们可以将隐藏节点专用于报表节点或是备份节点。 延时节点也应该是一个隐藏节点。

#### Delayed 节点（延时节点）
延时节点的数据集是延时的，因此它可以帮助我们在人为误操作或是其他意外情况下恢复数据。
　
举个例子，当应用升级失败，或是误操作删除了表和数据库时，我们可以通过延时节点进行数据恢复。



## 分片集群
分片（sharding）是MongoDB用来将大型集合分割到不同服务器（或者说一个集群）上所采用的方法。尽管分片起源于关系型数据库分区，但MongoDB分片完全又是另一回事。

和MySQL分区方案相比，MongoDB的最大区别在于它几乎能自动完成所有事情，只要告诉MongoDB要分配数据，它就能自动维护数据在不同服务器之间的均衡。

### 分片的目的
高数据量和吞吐量的数据库应用会对单机的性能造成较大压力,大的查询量会将单机的CPU耗尽,大的数据量对单机的存储压力较大,最终会耗尽系统的内存而将压力转移到磁盘IO上。

为了解决这些问题,有两个基本的方法: 垂直扩展和水平扩展。
- 垂直扩展：增加更多的CPU和存储资源来扩展容量。
- 水平扩展：将数据集分布在多个服务器上。水平扩展即分片。

### 分片设计思想
分片为应对高吞吐量与大数据量提供了方法。使用分片减少了每个分片需要处理的请求数，因此，通过水平扩展，集群可以提高自己的存储容量和吞吐量。举例来说，当插入一条数据时，应用只需要访问存储这条数据的分片.

使用分片减少了每个分片存储的数据。

### 分片机制提供了如下三种优势
1. 对集群进行抽象，让集群“不可见”
    - MongoDB自带了一个叫做mongos的专有路由进程。mongos就是掌握统一路口的路由器，其会将客户端发来的请求准确无误的路由到集群中的一个或者一组服务器上，同时会把接收到的响应拼装起来发回到客户端。
2. 保证集群总是可读写
    - MongoDB通过多种途径来确保集群的可用性和可靠性。将MongoDB的分片和复制功能结合使用，在确保数据分片到多台服务器的同时，也确保了每分数据都有相应的备份，这样就可以确保有服务器换掉时，其他的从库可以立即接替坏掉的部分继续工作。
3. 使集群易于扩展
    - 当系统需要更多的空间和资源的时候，MongoDB使我们可以按需方便的扩充系统容量。

### 分片集群架构
#### 组件
- Config Server: 存储集群所有节点、分片数据路由信息。默认需要配置3个Config Server节点。
- Mongos: 提供对外应用访问，所有操作均通过mongos执行。一般有多个mongos节点。数据迁移和数据自动平衡。
- Mongod: 存储应用数据记录。一般有多个Mongod节点，达到数据分片目的。

#### 分片集群的构造
- mongos ：数据路由，和客户端打交道的模块。mongos本身没有任何数据，他也不知道该怎么处理这数据，去找config server
- config server：所有存、取数据的方式，所有shard节点的信息，分片功能的一些配置信息。可以理解为真实数据的元数据。
- shard：真正的数据存储位置，以chunk为单位存数据。

Mongos本身并不持久化数据，Sharded cluster所有的元数据都会存储到Config Server，而用户的数据会议分散存储到各个shard。Mongos启动后，会从配置服务器加载元数据，开始提供服务，将用户的请求正确路由到对应的碎片。

#### Mongos的路由功能
- 当数据写入时，MongoDB Cluster根据分片键设计写入数据。
- 当外部语句发起数据查询时，MongoDB根据数据分布自动路由至指定节点返回数据。

### 集群中数据的分布
#### Chunk
在一个shard server内部，MongoDB还是会把数据分为chunks，每个chunk代表这个shard server内部一部分数据。chunk的产生，会有以下两个用途：
- Splitting：当一个chunk的大小超过配置中的chunk size时，MongoDB的后台进程会把这个chunk切分成更小的chunk，从而避免chunk过大的情况
- Balancing：在MongoDB中，balancer是一个后台进程，负责chunk的迁移，从而均衡各个shard server的负载，系统初始1个chunk，chunk size默认值64M,生产库上选择适合业务的chunk size是最好的。ongoDB会自动拆分和迁移chunks。

#### 分片集群的数据分布（shard节点）
1. 使用chunk来存储数据
2. 进群搭建完成之后，默认开启一个chunk，大小是64M，
3. 存储需求超过64M，chunk会进行分裂，如果单位时间存储需求很大，设置更大的chunk
5. chunk会被自动均衡迁移。

#### chunksize的选择
适合业务的chunksize是最好的。
chunk的分裂和迁移非常消耗IO资源；chunk分裂的时机：在插入和更新，读数据不会分裂。
- 小的chunksize：数据均衡是迁移速度快，数据分布更均匀。数据分裂频繁，路由节点消耗更多资源。
- 大的chunksize：数据分裂少。数据块移动集中消耗IO资源。通常100-200M

#### chunk分裂及迁移
随着数据的增长，其中的数据大小超过了配置的chunk size，默认是64M，则这个chunk就会分裂成两个。数据的增长会让chunk分裂得越来越多。

这时候，各个shard 上的chunk数量就会不平衡。这时候，mongos中的一个组件balancer  就会执行自动平衡。把chunk从chunk数量最多的shard节点挪动到数量最少的节点。

chunkSize 对分裂及迁移的影响
- MongoDB 默认的 chunkSize 为64MB，如无特殊需求，建议保持默认值；chunkSize 会直接影响到 chunk 分裂、迁移的行为。
- chunkSize 越小，chunk 分裂及迁移越多，数据分布越均衡；反之，chunkSize 越大，chunk 分裂及迁移会更少，但可能导致数据分布不均。
- chunkSize 太小，容易出现 jumbo chunk（即shardKey 的某个取值出现频率很高，这些文档只能放到一个 chunk 里，无法再分裂）而无法迁移；chunkSize 越大，则可能出现 chunk 内文档数太多（chunk 内文档数不能超过 250000 ）而无法迁移。
- chunk 自动分裂只会在数据写入时触发，所以如果将 chunkSize 改小，系统需要一定的时间来将 chunk 分裂到指定的大小。
- chunk 只会分裂，不会合并，所以即使将 chunkSize 改大，现有的 chunk 数量不会减少，但 chunk 大小会随着写入不断增长，直到达到目标大小

### 数据区分
#### 分片键shard key
MongoDB中数据的分片是、以集合为基本单位的，集合中的数据通过片键（Shard key）被分成多部分。其实片键就是在集合中选一个键，用该键的值作为数据拆分的依据。

所以一个好的片键对分片至关重要。片键必须是一个索引，通过sh.shardCollection加会自动创建索引（前提是此集合不存在的情况下）。一个自增的片键对写入和数据均匀分布就不是很好，因为自增的片键总会在一个分片上写入，后续达到某个阀值可能会写到别的分片。但是按照片键查询会非常高效。

随机片键对数据的均匀分布效果很好。注意尽量避免在多个分片上进行查询。在所有分片上查询，mongos会对结果进行归并排序。

对集合进行分片时，你需要选择一个片键，片键是每条记录都必须包含的，且建立了索引的单个字段或复合字段，MongoDB按照片键将数据划分到不同的数据块中，并将数据块均衡地分布到所有分片中。

为了按照片键划分数据块，MongoDB使用基于范围的分片方式或者 基于哈希的分片方式。

#### 注意：
- 分片键是不可变。
- 分片键必须有索引。
- 分片键大小限制512bytes。
- 分片键用于路由查询。
- MongoDB不接受已进行collection级分片的collection上插入无分片
- 键的文档（也不支持空值插入）

#### 以范围为基础的分片Sharded Cluster
Sharded Cluster支持将单个集合的数据分散存储在多shard上，用户可以指定根据集合内文档的某个字段即shard key来进行范围分片（range sharding）。

对于基于范围的分片，MongoDB按照片键的范围把数据分成不同部分。

假设有一个数字的片键:想象一个从负无穷到正无穷的直线，每一个片键的值都在直线上画了一个点。MongoDB把这条直线划分为更短的不重叠的片段，并称之为数据块，每个数据块包含了片键在一定范围内的数据。在使用片键做范围划分的系统中，拥有”相近”片键的文档很可能存储在同一个数据块中，因此也会存储在同一个分片中。

#### 基于哈希的分片
分片过程中利用哈希索引作为分片的单个键，且哈希分片的片键只能使用一个字段，而基于哈希片键最大的好处就是保证数据在各个节点分布基本均匀。

对于基于哈希的分片，MongoDB计算一个字段的哈希值，并用这个哈希值来创建数据块。在使用基于哈希分片的系统中，拥有”相近”片键的文档很可能不会存储在同一个数据块中，因此数据的分离性更好一些。

Hash分片与范围分片互补，能将文档随机的分散到各个chunk，充分的扩展写能力，弥补了范围分片的不足，但不能高效的服务范围查询，所有的范围查询要分发到后端所有的Shard才能找出满足条件的文档。

### 分片键选择建议
1. 递增的sharding key
   - 数据文件挪动小。（优势）
   - 因为数据文件递增，所以会把insert的写IO永久放在最后一片上，造成最后一片的写热点。同时，随着最后一片的数据量增大，将不断的发生迁移至之前的片上。
2. 随机的sharding key
   - 数据分布均匀，insert的写IO均匀分布在多个片上。（优势）
   - 大量的随机IO，磁盘不堪重荷。
3. 混合型key
   - 大方向随机递增，小范围随机分布。
   - 为了防止出现大量的chunk均衡迁移，可能造成的IO压力。我们需要设置合理分片使用策略（片键的选择、分片算法（range、hash））