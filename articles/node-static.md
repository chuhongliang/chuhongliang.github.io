# Node 实现简单的静态服务器

>Node里面是没有Web容器的概念, 所以URL上的路径跟实际文件的路径并不一致。

这里我们手动实现一个简单的原生静态服务，让Node能够找到路径的文件，实现静态服务器功能。文件夹的任何文件都能被找到。

```js
const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

http.createServer(function (req, res) {
	//得到用户的路径
	let pathname = url.parse(req.url).pathname;
	if (pathname == "/") {
		pathname = "index.html";
	}
	//拓展名
	let extname = path.extname(pathname);
	//读取文件
	fs.readFile("./public/" + pathname, function (err, data) {
		//data是一个Buffer，二进制的数据流
		if (err) {
			//如果文件不存在，就返回404
			fs.readFile("./public/404.html", function (err, data) {
				res.writeHead(404, { "Content-type": "text/html;chaset=utf-8" });
				res.end(data);
			});
			return;
		}
		//MIME类型，就是
		let mime = getMIME(extname)
		res.writeHead(200, { "Content-type": mime });
		res.end(data);
	})
}).listen(3000, "127.0.0.1", function () {
	console.log('http://127.0.0.1:3000');
});
```

#### 对不同的文件进行不同的响应头处理

```js
function getMIME(extname) {
	switch (extname) {
		case ".html":
			return "text/html;chaset=utf-8";
		case ".jpg":
			return "image/jpg";
		case ".css":
			return "text/css";
	}
}
```
