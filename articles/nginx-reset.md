# Nginx服务器301跳转到带www的域名的方法

为什么要这么做？

    我们的域名在做解析时经常会解析2个域名，即带www的和不带www的。这样做的目的是，当用户使用不带www的域名时，也可以正常访问你的网站。但是这样做的后果是，你站点主域名的PR值分散到其他几个URL上了。因为在搜索引擎看来，带www和不带www的URL是2个完全不同的URL，当它们指向同一个网站时，会让搜索引擎不懂应该选择哪一个URL作为主要的域名。如果你用301重定向把其他几个URL如baidu.com转到www.baidu.com时，相应的PR也就集中在主域名：www.baidu.com上了。

永久跳转和临时跳转

    301永久跳转，当用户或搜索引擎向网站服务器发出浏览请求时，服务器返回的HTTP数据流中头信息中的状态码的一种，表示本网页永久性转移到另一个地址。

    302临时跳转，也是状态码的一种，意义是暂时转向到另外一个网址。

    二者的区别主要是，一句话，302容易被搜索引擎视为spam，301则不会。permanent代表301永久跳转，改为redirect则为302临时跳转。

如何实现配置？

```js
server {
　　listen 80;
　　server_name test.cn;
　　return 301 http://www.test.cn$request_uri;
}

server {
　　listen 80;
　　server_name www.test.cn;
　　root /var/www/test.cn/test_shop/public_html;
　　index index.html index.php;

　　location ~ .*\.(php|php5)?$
　　{
　　　　#fastcgi_pass unix:/tmp/php-cgi.sock;
　　　　fastcgi_pass 127.0.0.1:9000;
　　　　fastcgi_index index.php;
　　　　include fastcgi.conf;
　　}

　　location ~ .*/.(gif|jpg|jpeg|png|bmp|swf|ico) {
　　　　expires 1d;
　　}
　　location ~ .*\.(js|css)?$ {
　　 　　expires 1d;
　　}

}
```

1、不加www有哪些好处和坏处？
不加 www 的裸域名好处主要是域名更加简短、容易记忆。坏处就多了，讲几个主要的技术原因：

①、裸域名只能绑定 DNS 的 A 记录，不能绑定 CNAME 记录。也就是说你不能把裸域设定为另外域名的别名。很多时候这对管理不是很方便，特别是使用第三方托管服务的时候。如果第三方迁移服务器导致 IP 地址变更，你必须自己去更改 DNS 的 A 记录。

比如你的个人博客采用 Tumblr 的服务，如果使用裸域，你需要手动将你域名的 A 地址指向 Tumblr 指定的 IP 地址。Tumblr 如果迁移了机房，所有通过这种方式设定个人域名的用户都必须更改自己的 DNS 才能继续使用，否则服务就会中断。使用子域名的 CNAME 记录就相对简单很多，只需要将 www 子域名的 CNAME 字段指向 http://domains.tumblr.com 这个域名，之后如果 Tumblr 更改 IP 地址，他们只需要重新设置 http://domains.tumblr.com 这个域名的 A 记录，而无需要求每个用户去更改 DNS 记录。

这个技术上的限制导致许多大型的第三方服务商不支持使用裸域。典型的如 Google 的服务，现在都不能使用裸域。Google 的服务用户基数大，不得不采用 DNS 级别的分布式，使用到的 IP 地址太多，而且变动大。让用户绑定 A 记录的话不利于负载均衡，维护起来也是几乎不可能完成的任务。同理，大部分 CDN 也不支持裸域（PS：现在的CDN已经支持裸域了）。

②、裸域的 cookie 的作用范围太大。假如知乎也采用裸域，那么知乎所有 cookie 的作用范围就包括 http://zhihu.com 下的所有子域名。也就是说访问 http://foo.zhihu.com 和 http://bar.zhihu.com 的时候都会带上 http://zhihu.com 裸域页面设置的 cookie。从安全、隐私、可扩展性、以及管理的角度而言，这对很多大型网站来说是不可接受的。

③、URL 的正则匹配，如果带 www 前缀的并且以 .com/.net/.org 结尾的，通常成功的机会要大很多。这个你会在许多文本编辑器里面遇到。如果 URL 不是 www 开头，并且也不是三大顶级域名结尾的，匹配成功的概率就要小很多。这是使用过程中有时候会让人很抓狂的点，重不重要全看你的用途和场合了。

另外一点非技术上的考量：用 www 子域名的好处体现在线下的环境，比如户外广告、报纸杂志、语音广播、语音电话等使用场合，www 这个前缀（不管是视觉的还是听觉的）能够很明确的提醒受众，这个信息片段是一个网站。有人会说加上 http:// 前缀也能解决这个问题，但现在随着以 Chrome/Safari 为首的浏览器都开始在地址栏里隐藏 http:// 协议前缀了，普通用户对于 http:// 这几个字符的理解会越来越模糊，所以如果是线下的话，保留 www 这个 visual/vocal cue 还是有一定意义的。

总的来说对于大访问量或多子域名的网站来说，不建议使用裸域。小流量或子域名少的网站的话就看个人爱好了。我挺喜欢裸域的。最近几年流行起来的「单页网页应用」(Single Page Web App) 也是以采用裸域的居多，Twitter 算是一例。

2、去掉www是否会影响网站的SEO（主要是排名和收录）？（前提是过去有加www）
早先裸域刚开始流行的时候确实有传闻说不利于 SEO，但现在看来似乎并无任何问题。如果有的话也是搜索引擎的 bug，给他们提一下他们应该会很乐意去改。Google 的站长工具里面有工具可以帮助你做 URL 迁移的，可以有效的解决这个问题，再配合下一部分的跳转，不用担心对 SEO 有任何负面影响。

3、用什么方式去跳转最好？（如301）
不管你决定使用还是不使用裸域，最好不要在同时保留 www 前缀和裸域的 URL，这样既不方便用户的浏览器区分访问历史，也会对你做访问统计带来不少麻烦。最佳的方式是采用 301 跳转，并且跳转的时候保留 URL 里域名后的全部内容。

比如，如果你决定使用裸域http://example.com，那么请务必将

http://www.example.com/foo/bar?spam=egg

301 跳转到

http://example.com/foo/bar?spam=egg 去。

或者反过来，如果你决定不使用裸域，那么请务必将

http://example.com/foo/bar?spam=egg

301 跳转到

http://www.example.com/foo/bar?spam=egg

这样的跳转需要在 web 服务器里单独配置，很多 DNS 管理界面提供的简单的跳转到新域名的根目录无法实现这样的功能（仅仅跳到 http://example.com/ )，对用户体验和搜索引擎 SEO 而言都是非常糟糕的。

下面给出如何在 nginx 里面实现上述的跳转：

```js
# redirect http(s)://www.example.com to http(s)://example.com
server {
    server_name www.example.com;
    return 301 $scheme://example.com$request_uri;
}
# redirect http(s)://example.com to http(s)://www.example.com
server {
    server_name example.com;
    return 301 $scheme://www.$host$request_uri;
}
```

## Nginx下 return 和 rewrite在 301重定向上的区别

唯一区别：正则匹配的性能区别
```js
rewrite ^/(.*)$ https://example.com/$1;
rewrite ^ https://example.com$request_uri? permanent;
return 301 https://example.com$request_uri;
```
第一种 rewrite 写法是抓取所有的 URI 再减去开头第一个 / (反斜线)。

第二种写法用了$request_uri 省去了减去开头第一个反斜线的过程，正则匹配上性能更优。但仍不如第三种写法，因为 rewrite 有很多写法和规则，执行到最后 nginx 才知道这是一个 301 永久重定向。

第三种则直接 return 301 + $request_uri，直接告诉 nginx 这是个 301重定向，直接抓取指定URI。

所以以上三种写法，第三种性能更优一些。当然，一般情况下快那么一点点，作为普通业余站长来说，我们也感觉不到。