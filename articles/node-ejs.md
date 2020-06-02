# Node.js 服务端渲染－EJS框架

EJS是一套简单的模板语言，可以利用EJS实现前端后端交互，仅仅用简单JavaScript代码即可生成HTML页面。

可以作为快速开发使用。一般用来和express一起用。

# 标签介绍
- <% .. %> ：用于控制流，即直接使用JavaScript语言
- <%= .. %> ：用于转义输出值，即在后端定义的变量，可以再前端显示输出
- <%- .. %> ：向模板输出没有转义的值 。
- <%# .. %>：注释标签，不执行。
- <%% ：输出'<%'。
- -%>：用于换行移除模式 。

# 具体用法
### index.ejs
```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <p>EJS渲染后端数据到前端</p>
    <h1><%= name %></h1>
</body>
</html>
```

### app.js
```js
//创建Express模块
const express = require('express');
const app=express();

//创建ejs模块
const ejs = require('ejs');

//设置ejs模板引擎
app.set("view engine", "ejs");

let name = '刘备';
//express框架
app.get('/',function(req,res){
    res.render('index',{
        'name': name
        //可以看出'name'是前端的
    });
});

app.listen(3003);
```

#### 这里 app.js 调用express的render方法传递变量name，通过ejs的<%= name %>实现替换。

## render() 用于渲染 HTML 视图
```js
app.render(view, [locals], callback)
```
- view 就是模板的文件名
- callback 用来处理返回的渲染后的字符串
- locals 可以为其模板传入变量值


## 循环渲染
### index.ejs
```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <p>EJS渲染后端数据到前端</p>
    <h4>循环渲染:</h4>
    <ul>
        <% for(var i=0;i<names.length;i++) {%>
        <li><%= names[i] %></li>
        <% } %>
    </ul>
    <h4>总共有 <%= names.length %> 个名字</h4>
</body>
</html>
```

### app.js
```js
//创建ejs模块
const ejs = require('ejs');

//创建Express模块
const express = require('express');
const app = express();

app.set("view engine", "ejs");

const names = ['刘备', '关羽', '张飞'];

app.get('/',function(req,res){
    res.render('index',{
        names:names
    });
});

app.listen(3003);
```

## 加入css样式

express框架下使用:
```js
app.use(express.static('public'));
```

将css文件放入public文件中，在ejs文件读取css即可(默认会搜索public目录下的文件)

### sample.css
```css
li {
    color: red;
}
```

### index.ejs
在head标签中引入sample.css
```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="sample.css">
</head>
<body>
    <p>接下来我要用ejs渲染后端数据到前端</p>
    <h4>升级版：循环渲染？</h4>
    <ul>
        <% for(var i=0;i<names.length;i++) {%>
        <li><%= names[i] %></li>
        <% } %>
    </ul>
    <h4>总共有 <%= names.length %> 个学生</h4>
</body>
</html>
```