# Redis 简介
Redis 是一个开源（BSD许可）的，内存中的数据结构存储系统，它可以用作数据库、缓存和消息中间件。 它支持多种类型的数据结构，如 字符串（strings）， 散列（hashes）， 列表（lists）， 集合（sets）， 有序集合（sorted sets） 与范围查询， bitmaps， hyperloglogs 和 地理空间（geospatial） 索引半径查询。 Redis 内置了 复制（replication），LUA脚本（Lua scripting）， LRU驱动事件（LRU eviction），事务（transactions） 和不同级别的 磁盘持久化（persistence）， 并通过 Redis哨兵（Sentinel）和自动 分区（Cluster）提供高可用性（high availability）。

## Redis的优点

**速度快**，Redis使用C语言实现，基于内存，数据的读写效率非常的高，这也是为什么很多系统的缓存功能使用Redis来实现，但是需要明确的是Redis是一个数据库，缓存只是它的一项应用而已。

单线程模型，所谓单线程模型就是每一个请求都会有一个全新的线程来进行处理，这一点类似于Struts2，每一个请求都会有一个新的线程来进行处理。这样做的好处就是避免了线程频繁切换带来的系统开销，同时也避免了让人头疼的多线程问题。

使用了非阻塞I/O，不在网络上浪费时间，进一步提高了效率。

支持多种的数据类型，并且每一种数据类型都提供了丰富的操作命令，适用于很多特殊的场景，并且支持自定义命令创建个性化的操作命令。

