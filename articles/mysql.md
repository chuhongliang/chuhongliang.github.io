# MySQL简介

MySQL是一个关系型数据库管理系统，由瑞典MySQL AB 公司开发，属于 Oracle 旗下产品。MySQL 是最流行的关系型数据库管理系统之一，在 WEB 应用方面，MySQL是最好的 RDBMS (Relational Database Management System，关系数据库管理系统) 应用软件之一。

MySQL是一种关系型数据库管理系统，关系数据库将数据保存在不同的表中，而不是将所有数据放在一个大仓库内，这样就增加了速度并提高了灵活性。

MySQL所使用的 SQL 语言是用于访问数据库的最常用标准化语言。MySQL 软件采用了双授权政策，分为社区版和商业版，由于其体积小、速度快、总体拥有成本低，尤其是开放源码这一特点，一般中小型网站的开发都选择 MySQL 作为网站数据库。

MySQL这个名字，起源不是很明确。一个比较有影响的说法是，基本指南和大量的库和工具带有前缀“my”已经有10年以上，而且不管怎样，MySQL AB创始人之一的Monty Widenius的女儿也叫My。这两个到底是哪一个给出了MySQL这个名字至今依然是个迷，包括开发者在内也不知道。

MySQL的海豚标志的名字叫“sakila”，它是由MySQL AB的创始人从用户在“海豚命名”的竞赛中建议的大量的名字表中选出的。获胜的名字是由来自非洲斯威士兰的开源软件开发者Ambrose Twebaze提供。根据Ambrose所说，Sakila来自一种叫SiSwati的斯威士兰方言，也是在Ambrose的家乡乌干达附近的坦桑尼亚的Arusha的一个小镇的名字。

MySQL，虽然功能未必很强大，但因为它的开源、广泛传播，导致很多人都了解到这个数据库。它的历史也富有传奇性。


# MySQL优点:

运行速度快，MySQL体积小，命令执行的速度快。

使用成本低。MySQL是开源的，且提供免费版本，对大多数用户来说大大降低了使用成本。

使用容易。与其他大型数据库的设置和管理相比，其复杂程度较低，易于使用。

可移植性强。MySQL能够运行与多种系统平台上，如windouws，Linux，Unix等。

适用更多用户。MySQL支持最常用的数据管理功能，适用于中小型企业甚至大型网站应用。

# 常用命令
### 使用SHOW语句找出在服务器上当前存在什么数据库：
```sql
mysql> SHOW DATABASES;
```
### 创建一个数据库MYSQLDATA
```sql
mysql> CREATE DATABASE MYSQLDATA;
```
### 选择你所创建的数据库
```sql
mysql> USE MYSQLDATA; (按回车键出现Database changed 时说明操作成功！)
```
### 查看现在的数据库中存在什么表
```sql
mysql> SHOW TABLES;
```
### 创建一个数据库表
```sql
mysql> CREATE TABLE MYTABLE (name VARCHAR(20), sex CHAR(1));
```
### 显示表的结构：
```sql
mysql> DESCRIBE MYTABLE;
```
### 往表中加入记录
```sql
mysql> insert into MYTABLE values (”hyq”,”M”);
```
### 用文本方式将数据装入数据库表中（例如D:/mysql.txt）
```sql
mysql> LOAD DATA LOCAL INFILE “D:/mysql.txt” INTO TABLE MYTABLE;
```
### 导入.sql文件命令（例如D:/mysql.sql）
```sql
mysql>use database;
mysql>source d:/mysql.sql;
```
### 删除表
```sql
mysql>drop TABLE MYTABLE;
```
### 清空表
```sql
mysql>delete from MYTABLE;
```
### 更新表中数据
```sql
mysql>update MYTABLE set sex=”f” where name=’hyq’;
```