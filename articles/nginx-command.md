## Nginx 常用命令

首先配置nginx路径

打开/etc/profile 文件
```txt
vim /etc/profile
```

在里加入一行:
```txt
PATH=$PATH:/usr/local/nginx/sbin
```

让配置文件重新生效:
```
source /etc/profile
```         

nginx -v 查看当前版本:
```txt
nginx version: nginx/1.14.1
```

到这里说明已经配置成功可以放心使用以下nginx 常用命令了。

---

查看帮助信息:
```txt
nginx -v
```

启动nginx
```txt
start nginx
```

指定配置文件启动nginx
```txt
start nginx -c filename
```

关闭nginx，完整有序的停止nginx，保存相关信息
```txt
nginx -s quit
```

关闭nginx，快速停止nginx，可能并不保存相关信息
```txt
nginx -s stop
```

重新载入nginx，当配置信息修改需要重新加载配置是使用
```txt
nginx -s reload
```

重新打开日志文件
```txt
nginx -s reopen
```

测试nginx配置文件是否正确
```txt
nginx -t -c filename
```