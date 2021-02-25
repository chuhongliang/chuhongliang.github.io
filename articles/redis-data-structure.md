

# Redis特性（默认16个DB）
- 1. 非关系型键值对数据库，可以根据键以O(1)的时间复杂度取出或插入关联值。
- 2. Redis的数据都是存在内存中的。
- 3. 键的类型可以是字符串，整型，浮点型等，且是唯一的。
- 4. 值类型可以是string, set, sorted set, list, hash等。
- 5. Redis内置了复制，磁盘持久化，LUA脚本，事务，SSL，客户端代理等功能。
- 6. 通过Redis哨兵和自动分区可提供高可用。


Redis中所有的key都是string类型


```js
key -> dict 
value -> redisObject

redisObject{ //数据编码类型
	string: int raw embstr
	list: quicklist->ziplist
	hash: hashtable ziplist
	set: hashtable intset
	zset: ziplist skiplist
}
redis-server 启动服务
redis-cli 连接redis

type key 查看数据类型
object encoding key 查看数据编码类型

dictEntry{
	key: sds 
	value: redisObject
}

```

# Key的类型为sds

# String
Redis是用C语言实现的, C语言中用char[] 数组实现string 以'\0为结尾';

Redis实现的string 类型称为sds(simple dynamic string)
- sds 二进制安全数据结构
- 动态扩容机制，避免了频繁的内存分配
- 扩容每次会扩一倍长度，当大小为1M时，每次扩1M.


# redisObject string
- embstr 长度 <= 44的字符串  缓存行为64byte大小 redisObject 16byte大小 
  内存开辟空间时会开辟一个连续的64byte大小的空间，[redisObjec embstr]embstr会在redisObject后面; 读取的时候会一次把两个对象全读到，节省内存IO.
- int 如果要存储的数据是int整型，redisObject的ptr指针会直接存储int数值 而不是指向另一个内存地址
- raw 长度 >= 45的字符串
- 使用setbit append命令会改变redisObject的编码 字符串都是raw类型.


```js
sds{
	len: 数据长度
	free: 剩余空间
	char buf[]:
	扩容每次扩一半，
}

if(string_size < 32)
 return SDS_TYPE_5
if(string_size < 0xff) // 2^8 - 1
 return SDS_TYPE_8
if(string_size < 0xffff) // 2^16 - 1
 return SDS_TYPE_16
if(string_size < 32) // 2^32 - 1 
 return SDS_TYPE_32

return SDS_TYPE_64

```




```js
bitcount login:2021:0222 单日日活

bitop and login:2021:0222 login:2021:0225 连续登录

bitop or login:2021:0222 login:2021:0225 间断登录 月活
```

Redis 6.0之前是单线程模型
操作顺序 read -> commend -> write

6.0之后可以设置多线程
默认是read -> commend -> writes(多个)

手动设置reads(多个) -> commend -> writes(多个)

# List
List 是一个有序(加入时序)的数据结构，Redis采用quicklist(双端链表)和ziplist作为底层实现

可以通过设置每个ziplist的最大容量，quicklist的数据压缩范围，提取数据存取效率。
- list-max-ziplist-size -2
- list-compress-depth 0
- blpop brpop 阻塞一段时间返会结果 可以实现阻塞队列
- brpoplpush 会备份数据到另一个列表，更安全的用法。

# Hash 
Hash数据结构底层是一个字典(dict)，也是Redis用来存储K-V的数据结构，当数据量比较小或者单个元素比较小时，底层用ziplist存储。数据大小和元素数量阀值可以通过参数设置。
- hash-max-ziplist-entries
- hash-max-ziplist-value

# Set
Set为无序的，自动去重的集合数据类型。Set底层实现为一个value为null的字典(dict)。当数据可以用整形表示时，Set集合将被编码为intset(有序的)数据结构。

两个条件任意一个不满足时，Set会用字典(dict)存储数据。
- 1. 元素个数少于 set-max-instset-entries
- 2. 元素无法用整形表示

## intset
整数集合是一个有序的，存储整型数据的结构。整型集合在Redis中可以保存int16_t, int32_t, int64_t类型的整型数据。并且可以保证集合中不会有重复数据。

sdiff 求差集 sinter求并集

# ZSet
ZSet为有序（优先score排序, score相同则用元素字典序）自动去重的集合数据类型.ZSet数据结构底层实现为字典(dict) + 跳跃表(skiplist),当数据较少时. 用ziplist编码结构存储.


# Redis 有哪些持久化方式？各自的优缺点?
Redis提供两种持久化方式，RDB和AOF机制.
- RDB(Redis DataBase): RDB保存某一个时间点之前的快照数据.
- AOF(Append-only-file): 指所有的命令行记录，以redis请求协议的格式完全持久化为aof文件. 
- 混合持久化(4.0之后): 指进行AOF重写时子进程将当前时间点的数据快照保存为RDB文件格式，而后父进程累积命令保存为AOF格式.
## RDB
- 1. 通过配置参数触发。
  - 通过一定时间周期内命令执行的个数，超过阀值即执行。
  ```js
	     时间(s) 次数
	save 900 1
	save 300 10 
	save 60 10000
	```
- 2. 通过手动执行 bgsave/save 显式触发生成快照。
   - bgsave和conf配置方式  会fork一个子进程去执行，
   - save 方式会阻塞主线程

### Redis 在发生RDB持久化的过程中有几个问题需要思考
- 1. RDB快照过程中Redis是否会停止对外提供服务
- 2. 如果不会停止服务，如何处理新的请求

#### RDB快照过程
主进程会先利用系统的fork机制（linux操作系统提供的），fork一个子进程。子进程会共享主进程一部分内存的数据，并且会把这块共享数据置为read-only的状态。

在持久化过程中，如果有新的写入命令，会触发一个copyonwrite的操作，不会影响子进程的持久化，持久化结束后，主进程还要负现子进程的回收。

## RDB文件格式
紧凑的二进制文件格式, 存储的是数据.

### 优点
1. 性能最大化，fork子进程来完成写操作，让主进程继续处理命令。使用单独子进程进行持久化，保证了redis的高性能。
2. 当重启恢复数据的时候，数据量比较大时，Redis进接解析RDB二进制文件，生成对应的数据存储在内存中，比AOF启动效率更高。
   
### 缺点
1. 数据安全性低：RDB间隔一段时间持久化，如果持久化过程中发生故障，会发生丢失数据。所以这种方式更适合数据要求不严谨的的时候。
2. Linux fork()之后，kernel会把父进程所有的内存页的权限都设为read-only，子进程的地址空间指向父进程。

当父进程都只读内存时，相安无事。当其中某个进程写内存时，CPU硬件检测到内存页是read-only的，于是触发 页异常(page-fault)中断。陷入kernel的一个中断例程，中断例程中，kernel的copyonwrite机制会把触发异常的内存页复制一份，于是父子进程各自独立持有了一份，如果这个时候有大量的写入操作，会产生大量的分页错误（页异常(page-fault)），这样就得耗费不少性能在复制上。


## AOF
AOF 持久化执行流程

```js
通过 appendonly yes 开启

append命令写入->缓冲区(内存)->同步策略(sync)->AOF文件 -> rewrite重写策略
```
Redis使用单线程响应命令，如果每次写AOF文件命令都追加到磁盘，会极大影响处理性能，所以Redis先写入aof缓冲区，根据用配置的硬盘同步策略写入aof文件，可以通过appendsync参数配置

- no: 表示等待操作系统进行同步到磁盘上面。默认情况下最长周期为30s
  (快速响应客户端，不对AOF做数据同步，同步文件由操作系统负责，通常最长同步周期为30s)
- always: 表示每次更新操作后手动调用fsync()将数据写到磁盘（第次都写磁盘）
- everysec: 表示每一秒同步一次，（折中 默认值）

### AOF 重写机制
随着命令不断写入AOF，文件会越来越大，为了解决这个问题Redis引入了AOF重写机制压缩文件体积，AOF文件重写是把Redis进程内的数据转化为写命令，同步到新的AOF文件，AOF重写机制可以通过手动触发和自动触发。

- 手动触发：bgwriteaof 命令
- 自动触发：需要配置如下两个参数
  ```js
	auto-aof-rewrite-percentage 100
	auto-aof-rewrite-size 64mb
	```
  如上代表当AOF文件大小 大于64mb时，且当前AOF文件大小比基准大小增长了100% 时，会触发一次AOF重写。

  - auto-aof-rewrite-size：表示AOF重写时文件最小体积，默认64mb
	- auto-aof-rewrite-percentage：表示当前AOF文件空间(aof_current_size)和上一次重写后的AOF文件空间的比值(aof_base_size)。

#### 优点
数据安全，aof持久化可以配置appendsync属性，有always，每进行一次命令操作就会记录到aof文件中一次。更安全.

#### 缺点
数据集大的时候，比rdb启动效率更低。(指令重放) aof会把之前执行过的命令再执行一遍.


### RDB 和 AOF的区别。
RDB持久化是指在指定的时间间隔内将内存中的数据集快照写入磁盘，实际操作过程是fork一个子进程，先将数据集写入临时文件，写入成功后，再替换之前的文件，用二进制压缩存储。

AOF持久化以日志的形式记录服务器所处理的每一个写、删除操作，查询操作不会记录，以文本的方式记录，可以打开文件看到详细的操作记录。

RDB启动更高效，AOF更安全能最大限度的避免数据丢失.

## 混合持久化
可以通过设置 aof-use-rdb-preamble yes 开启

先以RDB的方式持久化存储到AOF文件中，再把后续的指令以AOF的形式存储起来。

加载时,会首先识别AOF文件是否以REDIS字符串开头，如果是就以RDB加载，加载完RDB后继续按AOF格式加载剩余部分。

混合持久化方案兼顾了RDB的速度，和AOF的安全性

# Redis 是如何删除过期数据的?
对于已过期的数据，Redis将用两种策略删除这些过期键，分别是定期删除和惰性删除。

- 惰性删除：是指访问键时，再检查当前的键是否过期，如果过期则删除并返回null给客户端；如果没过期则正常返回信息给客户端。
  - 优点：简单，不需要对数据做额外的处理，只是在每次访问key的时候检查是否过其。
  - 缺点：删除过期键值不及时，造成一定的空间浪费。
- 定期删除：Redis会周期性的随机测试一批设置过期时间的key并进行处理，测试到已过期的key将被删除。具体算法如下：
   - Redis配置项hz定义了serverCron的执行周期，默认为10，代表每秒执行10次。
   - 每次过期key的清理时间不超过cpu的25%，比如hz为10，则一次清理时间为最大25ms。
   - 清理是会依次遍历所有DB；
   - 从DB中随机取20个key，判断是否过其，若过期则删除。
   - 若有5个以上的key过期重复上一步，否则遍历下一个DB。
   - 在清理过程中若达到25%cpu时间则退出清理。



	
# 过期淘汰设计

##  LRU(Least Recently Used 最近最少用)算法:
如果一个数据最近没有被访问到，那么可以认为它在将来被访问的可能性也很小。因此，当空间满时，最久没有被访问到的元素最先被淘汰。

LRU算法通常通过链表来实现，添加元素的时候通常直接插入表头，访问元素时，先访问元素是否在链表内，如果存在就把元素移动至表头，所以链表的元素排列顺序就是元素被访问的顺序。当内存达到设置的阀值时，队尾的元素由于被访问的时间线较远，会优先被踢出。


## LFU(Least Frequently Used 最不经常用)算法:
如果一个数据最近一段时间很少被访问到，那么可以认为它在将来被访问的可能性也很小。因此，当空间满时，最小频率被访问的数据最先被淘汰。

redisObject 中24bit 的 lru字段来存储lfu数据，这24 bit被分为两部分:
- 1. 高16位用来记录访问时间 单位（分钟）
- 2. 低8位用来记录访问频率，简称counter
  
counter: 8bit很容易就溢出了，技巧是用一个逻辑计数器，基于概率对计数器进行增加，而不是一个普通的递增的计数器。


# 什么是缓存雪崩
在流量达到洪峰时，大量的正常请求导致了缓存服务器宕机，所有请求到达DB，导致了DB服务不可用，就是缓存雪崩。

解决方案：
- 1. 保证缓存服务的高可用：如采用Redis Cluster 架构（集群）
- 2. 服务接口的分流与降级：提前压测预估系统处理能力，做好服务的限流与降级。
- 3. 对缓存进行时实监控，当请求访问的慢速到达阀值时，及时报警，通过自动故障转移，服务降级，停止部分非核心接口访问。
- 4. 对大热KEY可以缓存在本地，缓解对redis的压力。


# 热KEY重建有什么风险 （缓存击穿）
热KEY重建指的是，开发人员设置好的缓存过期时间过了，需要重新构建缓存。

热KEY说明：当前可能有大量请求，同时访问同一个热KEY，而且这个并发量特别大。缓存失效的瞬间可能会有大量线程重建缓存，造成后端数据库压力暴增.

优先方案:
- 1. 通过设置互斥锁，同一时间，只允许一个请求进行热key的重建。如基于redis setnx命令来实现。

