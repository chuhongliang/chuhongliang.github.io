
[Redis和MongoDB的区别](#Redis和MongoDB的区别)
[MongoDB和MySQL的区别](#MongoDB和MySQL的区别)

#　Redis和MongoDB　的区别
就Redis和MongoDB来说，大家一般称之为Redis缓存、MongoDB数据库。

Redis主要把数据存储在内存中，其“缓存”的性质远大于其“数据存储“的性质，其中数据的增删改查也只是像变量操作一样简单；

MongoDB却是一个“存储数据”的系统，增删改查可以添加很多条件，就像SQL数据库一样灵活。

## Mongodb与Redis应用指标对比
- MongoDB和Redis都是NoSQL，采用结构型数据存储。
- 二者在使用场景中，存在一定的区别，这也主要由于二者在内存映射的处理过程，持久化的处理方法不同。
- MongoDB建议集群部署，更多的考虑到集群方案，
- Redis更偏重于进程顺序写入，虽然支持集群，也仅限于主-从模式。

###　实现语言
- mongodb: C
- redis: C/C++ 

### 性能
- mongodb: 	依赖内存，TPS较高
- redis:　依赖内存，TPS非常高

Redis优于MongoDB

### 可操作性	
- mongodb: 丰富的数据表达、索引；最类似于关系数据库，支持丰富的查询语言
- redis:　数据丰富，较少的IO

MongoDB优于Redis


###　内存及存储
- mongodb: 适合大数据量存储，依赖系统虚拟内存管理，采用镜像文件存储；内存占有率比较高，官方建议独立部署在64位系统（32位有最大2.5G文件限制，64位没有改限制）
- redis:　Redis2.0后增加虚拟内存特性，突破物理内存限制；数据可以设置时效性，类似于memcache

不同的应用角度看，各有优势

### 可用性
- mongodb: 支持master-slave,replicaset（内部采用paxos选举算法，自动故障恢复）,auto sharding机制，对客户端屏蔽了故障转移和切分机制
- redis: 依赖客户端来实现分布式读写；主从复制时，每次从节点重新连接主节点都要依赖整个快照,无增量复制；不支持自动sharding,需要依赖程序设定一致hash机制

MongoDB优于Redis；单点问题上，MongoDB应用简单，相对用户透明，Redis比较复杂，需要客户端主动解决。（MongoDB 一般会使用replica sets和sharding功能结合，replica sets侧重高可用性及高可靠性，而sharding侧重于性能、易扩展）

### 可靠性
- mongodb: 从1.8版本后，采用binlog方式（MySQL同样采用该方式）支持持久化，增加可靠性
- redis: 依赖快照进行持久化；AOF增强可靠性；增强可靠性的同时，影响访问性能

MongoDB优于Redis


### 一致性
- mongodb: Mongodb从3.0开始默认使用的是WiredTiger引擎, WiredTiger引擎可以针对单个文档来保证ACID特性，但是当需要操作多个文档的时候无法保证ACID，
- redis: 支持事务，比较弱，仅能保证事务中的操作按顺序执行，

MongoDB优于Redis

### 数据分析
- mongodb: 内置数据分析功能（mapreduce）
- redis: 不支持

MongoDB优于Redis

### 应用场景
- mongodb: 海量数据的访问效率提升
- redis: 较小数据量的性能及运算

MongoDB优于Redis



# MongoDB和MySQL的区别

### 关系型数据库-MySQL
1. 在不同的引擎上有不同的存储方式。
2. 查询语句是使用传统的sql语句，拥有较为成熟的体系，成熟度很高。
3. 开源数据库的份额在不断增加，mysql的份额页在持续增长。
4. 缺点就是在海量数据处理的时候效率会显著变慢。


### 非关系型数据库-MongoDB
非关系型数据库(nosql ),属于文档型数据库。先解释一下文档的数据库，即可以存放xml、json、bson类型系那个的数据。这些数据具备自述性，呈现分层的树状数据结构。数据结构由键值(key=>value)对组成。

1. 存储方式：虚拟内存+持久化。
2. 查询语句：是独特的MongoDB的查询方式。
3. 适合场景：事件的记录，内容管理或者博客平台等等。
4. 架构特点：可以通过副本集，以及分片来实现高可用。
5. 数据处理：数据是存储在硬盘上的，只不过需要经常读取的数据会被加载到内存中，将数据存储在物理内存中，从而达到高速读写。
6. 成熟度与广泛度：新兴数据库，成熟度较低，Nosql数据库中最为接近关系型数据库，比较完善的DB之一，适用人群不断在增长。


### MongoDB优势与劣势
优势：
1. 在适量级的内存的MongoDB的性能是非常迅速的，它将热数据存储在物理内存中，使得热数据的读写变得十分快。
2. MongoDB的高可用和集群架构拥有十分高的扩展性。
3. 在副本集中，当主库遇到问题，无法继续提供服务的时候，副本集将选举一个新的主库继续提供服务。
4. MongoDB的Bson和JSon格式的数据十分适合文档格式的存储与查询。

劣势：
1. 事务支持不如MySQL强大，目前只支持单文档事务，不支持多文档事务。
2. 新兴数据库，成熟度较低。
3. MongoDB占用空间过大。

### 对比
```
数据库	                MongoDB	                                             MySQL
数据库模型	            非关系型	                                   关系型
存储方式	    以类JSON的文档的格式存储	                            不同引擎有不同的存储方式
查询语句	    MongoDB查询方式（类似JavaScript的函数）	                SQL语句
数据处理方式	基于内存，将热数据存放在物理内存中，从而达到高速读写       不同引擎有自己的特点
成熟度	        新兴数据库，成熟度较低	成熟度高
广泛度	        NoSQL数据库中，比较完善且开源，使用人数在不断增长	      开源数据库，市场份额不断增长
事务性	        仅支持单文档事务操作，弱一致性	支持事务操作
占用空间	    占用空间大	                                           用空间小
join操作	    MongoDB没有join	                                      MySQL支持join
```

