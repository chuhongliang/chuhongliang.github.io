



## MySQL SQL 查询语句执行顺序
1. (7) - SELECT
2. (8) - DISTINCT <select_list>
3. (1) - FROM <left_table>
4. (3) - <join_type> JOIN <right_table>
5. (2) - ON <join_condition>
6. (4) - WHERE <where_condition>
7. (5) - GROUP BY <group_by_list>
8. (6) - HAVING <having_condition>
9. (9) - ORDER BY <order_by_condition>
10. (10) - LIMIT <limit_number>

关于 SQL 语句的执行顺序，有三个值得我们注意的地方：

FROM 才是 SQL 语句执行的第一步，并非 SELECT。 数据库在执行 SQL 语句的第一步是将数据从硬盘加载到数据缓冲区中，以便对这些数据进行操作。

SELECT 是在大部分语句执行了之后才执行的，严格的说是在 FROM 和 GROUP BY 之后执行的。理解这一点是非常重要的，这就是你不能在 WHERE 中使用在 SELECT 中设定别名的字段作为判断条件的原因。

无论在语法上还是在执行顺序上， UNION 总是排在在 ORDER BY 之前。很多人认为每个 UNION 段都能使用 ORDER BY 排序，但是根据 SQL 语言标准和各个数据库 SQL 的执行差异来看，这并不是真的。尽管某些数据库允许 SQL 语句对子查询（subqueries）或者派生表（derived tables）进行排序，但是这并不说明这个排序在 UNION 操作过后仍保持排序后的顺序。

虽然SQL的逻辑查询是根据上述进行查询，但是数据库也许并不会完全按照逻辑查询处理的方式来进行查询。MYSQL数据库有两个组件 Parser（分析SQL语句）和 Optimizer（优化）。

从官方手册上看，可以理解为， MySQL 采用了基于开销的优化器，以确定处理查询的最解方式，也就是说执行查询之前，都会先选择一条自以为最优的方案，然后执行这个方案来获取结果。在很多情况下， MySQL 能够计算最佳的可能查询计划，但在某些情况下， MySQL 没有关于数据的足够信息，或者是提供太多的相关数据信息，估测就不那么友好了。

存在索引的情况下，优化器优先使用条件用到索引且最优的方案。当 sql 条件有多个索引可以选择，mysql 优化器将直接使用效率最高的索引执行。


## 子查询
### 子查询按使用场合分：
- 作为主查询的结果数据：select c1,(select f1 from tab2) as f11 from tab1; #这里子查询应该只有一个数据（一行一列，标量子查询）
- 作为主查询的条件数据：select c1 from tab1 where c1 in (select f1 from tab2); #这里子查询可以是多个数据（多行一列，列子查询，以及标量子查询，实际上行子查询也可能，但极少）
- 作为主查询的来源数据：select c1 from (select f1 as c1, f2 from tab2) as t2; #这里子查询可以是任意查询结果（表子查询）。

### 权限分配
```sql
grant select,insert on userdb.userinfo to'zhangsan'@'localhost'
```

### 模糊查询
%：表示任意0个或多个字符。可匹配任意类型和长度的字符，有些情况下若是中文，请使用两个百分号（%%）表示。

```sql
select * from test where text like '%1%';
```

_ ： 表示任意单个字符。匹配单个任意字符，它常用来限制表达式的字符长度语句。
```sql
--倒数第三个字符为 1 ，且最小长度为 5
select * from test where text like '__%1__';
```


## SQL语句分类
- DDL：数据定义语言（create drop）
- DML：数据操作语句（insert update delete）
- DQL：数据查询语句（select ）
- DCL：数据控制语句，进行授权和权限回收（grant revoke）
- TPL：数据事务语句（commit collback savapoint）


## 数据库三范式
第一范式：1NF是对属性的原子性约束，要求字段具有原子性，不可再分解；(只要是关系型数据库都满足1NF)

第二范式：2NF是在满足第一范式的前提下，非主键字段不能出现部分依赖主键；解决：消除复合主键就可避免出现部分以来，可增加单列关键字。

第三范式：3NF是在满足第二范式的前提下，非主键字段不能出现传递依赖，比如某个字段a依赖于主键，而一些字段依赖字段a，这就是传递依赖。解决：将一个实体信息的数据放在一个表内实现。
  

  
## CHAR和VARCHAR的区别
CHAR和VARCHAR类型在存储和检索方面有所不同

CHAR列长度固定为创建表时声明的长度，长度值范围是1到255

当CHAR值被存储时，它们被用空格填充到特定长度，检索CHAR值时需删除尾随空格


### 锁
表级锁：开销小，加锁快，不会出现死锁。锁定粒度大，发生锁冲突的概率最高，并发量最低

行级锁：开销大，加锁慢，会出现死锁。锁力度小，发生锁冲突的概率小，并发度最高
  


## delete、drop、truncate区别
truncate 和 delete只删除数据，不删除表结构 ,drop删除表结构，并且释放所占的空间。

删除数据的速度，drop> truncate > delete

delete属于DML语言，需要事务管理，commit之后才能生效。drop和truncate属于DDL语言，操作立刻生效，不可回滚。



