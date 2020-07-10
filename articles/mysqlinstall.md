# MySQL zip包的卸载与安装

## 卸载已安装的mysql5.6.31
可以通过Windows的服务管理器查看。"开始"->"运行"，输入“services.msc”，回车。弹出Windows的服务管理器，然后就可以看见服务名为“mysql”的服务项了.

doc命令下进入到D:\mysql5.6.31\bin>输入"mysqld -remove"或者"sc delete mysql"卸载服务；

### 清理注册表
在Win7开始菜单栏搜索 regedit 进入注册表编辑器
```txt
\HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\services\eventlog\Application\MySQL
\HKEY_LOCAL_MACHINE\SYSTEM\ControlSet002\services\eventlog\Application\MySQL
```
删除整个MySQL文件夹即可


# 安装mysql5.7.30.zip
## 解压放到指定盘中 D:\mysql-5.7.30-winx64

##  新建my.ini文件放在D:\mysql-5.7.30-winx64文件夹下，将如下代码放入my.ini文件中

#### basedir和datadir，请根据自己的实际安装目录进行修改
```txt
#########################################################
  [client]
  port=3306
  default-character-set=utf8
  [mysqld]
  port=3306
  character_set_server=utf8
  collation_server=utf8_general_ci
  #安装路径
  basedir=D:\\mysql-5.7.30-winx64
  #数据路径
  datadir=D:\\mysql-5.7.30-winx64\data
  sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES
  [WinMySQLAdmin]
  D:\\mysql-5.7.30-winx64\bin\mysqld.exe
#########################################################
```

## 配置环境变量
MYSQL_HOME:D:\mysql-5.7.21-winx64
在系统环境path后面添加 ;%MYSQL_HOME%\bin，不是win10的小伙伴要注意加分号(";")

## 打开cmd.exe,必须以管理员的身份运行
在路径C:\Windows\System32下找到cmd.exe，点击右键以管理员身份运行（win 7下面严格区分权限，必须以管理员身份）

```txt
mysqld --initialize --user=mysql --console
```

## 安装服务
```txt
mysqld -install MySQL --defaults-file="D:\mysql-5.7.30-winx64\my.ini"
```

## 启动服务
```txt
net start mysql
```

## 停止服务
```txt
net stop mysql
```

## 修改密码
```txt
SET PASSWORD = PASSWORD('新密码');
ALTER USER 'root'@'localhost' PASSWORD EXPIRE NEVER;
FLUSH PRIVILEGES;
```