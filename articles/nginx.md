
# Nginx源码下载、编译和安装
Nginx下载地址：http://nginx.org/en/download.html
选择好下载的版本后，如果有浏览器可以直接点击下载，如果在终端可以选择命令下载：

由于之前安装过1.15.9 有BUG
推荐安装1.14.1

```txt
wget http://nginx.org/download/nginx-1.14.1.tar.gz
```

下载完成后解压
```txt
tar -zxvf nginx-1.14.1.tar.gz 
```

Linux系统分为两种：
- 1.RedHat系列：Redhat、Centos、Fedora等
- 2.Debian系列：Debian、Ubuntu等

RedHat系列的包管理工具是yum

Debian系列的包管理工具是apt-get


安装openssl库
```txt
sudo yum install openssl libssl-dev
```

安装pcre库
```txt
sudo yum install libpcre3 libpcre3-dev
```

安装zlib库
```txt
sudo yum install zlib1g-dev
```

安装完成后进入到nginx-1.14.1目录再次执行命令：
```txt
./configure --prefix=/usr/local/nginx
```

然后执行以下命令开始编译和安装nginx：
```txt
sudo make
```
```
sudo make install
```

安装完之后可以看到/usr/local/nginx目录下有以下文件：
```txt
cert  client_body_temp  conf  fastcgi_temp  html  logs  proxy_temp  sbin  scgi_temp  uwsgi_temp
```

进入到/usr/local/nginx目录，启动nginx：
```txt
sudo ./sbin/nginx
```

如果没有报错查看进程信息：
```txt
ps -e | grep nginx
```

```txt
11943 ?        00:00:00 nginx
15194 ?        00:00:00 nginx
```

在浏览器中直接输入127.0.0.1便可访问nginx