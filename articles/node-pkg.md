# 使用pkg打包应用

将Node.js打包为可执行文件的工具有pkg、nexe、node-packer、enclose等，面对项目需要，所以在学习pkg,看到相关文章，觉得这个很不错，自己记录下，以便下次使用便捷。
pkg的打包原理简单来说，就是将js代码以及相关的资源文件打包到可执行文件中，然后劫持fs里面的一些函数，使它能够读到可执行文件中的代码和资源文件。例如，原来的require(’./a.js’)会被劫持到一个虚拟目录require(’/snapshot/a.js’)。

### 安装
```js
npm install pkg --save-dev
```

### 使用
pkg使用比较简单，执行下pkg -h
```js
pkg --help
```

就可以基本了解用法，基本语法是：pkg [options] <input>
会出现下面这些内容：

```txt
Options:

    -h, --help       output usage information  帮助输出使用信息
    -v, --version    output pkg version --版本输出包装版本
    -t, --targets    comma-separated list of targets (see examples)
    -c, --config     package.json or any json file with top-level config
    --options        bake v8 options into executable to run with them on
    -o, --output     output file name or template for several files
    --out-path       path to save output one or more executables
    -d, --debug      show more information during packaging process [off]
    -b, --build      don't download prebuilt base binaries, build them
    --public         speed up and disclose the sources of top-level project

  Examples:

  – Makes executables for Linux, macOS and Windows
    $ pkg index.js
  – Takes package.json from cwd and follows 'bin' entry
    $ pkg .
  – Makes executable for particular target machine
    $ pkg -t node6-alpine-x64 index.js
  – Makes executables for target machines of your choice
    $ pkg -t node4-linux,node6-linux,node6-win index.js
  – Bakes '--expose-gc' into executable
    $ pkg --options expose-gc index.js

```

-t，–目标逗号分隔的目标列表，指定打包的目标平台和Node版本，如-t node6-win-x64,node6-linux-x64,node6-macos-x64可以同时打包3个平台的可执行程序

-c，–config package.json 或任何具有顶级配置的json文件，指定一个JSON配置文件，用来指定需要额外打包脚本和资源文件，通常使用package.json配置。

–option 将V8选项烘焙到可执行文件中以在其上运行

-o，–指定输出可执行文件的名称，但如果用-t指定了多个目标，那么就要用–out-path指定输出的目录；

----out-path 输出一个或多个可执行文件的输出路径

-d，–debug 在打包过程中显示更多信息[off]

-build 不要下载预构建的基本二进制文件，构建它们。

–public 加速并披露顶级项目的来源

```txt
<input>可以通过三种方式指定：

1.一个脚本文件，例如pkg index.js;
2.package.json，例如pkg package.json，
这时会使用package.json中的bin字段作为入口文件；
3.一个目录，例如pkg .，这时会寻找指定目录下的package.json文件，
然后在找bin字段作为入口文件。

```
使用pkg的最佳实践是：在package.json中的pkg字段中指定打包参数，使用npm scripts来执行打包过程，

{
  ...
  "bin": "./bin/www",
  "scripts": {
    "pkg": "pkg . --out-path=dist/"
  },
  "pkg": {
    "scripts": "build/**/*.js",
    "assets": "views/**/*",
    "targets": [...]
  },
  ...
}
scripts和assets用来配置未打包进可执行文件的脚本和资源文件，文件路径可以使用glob通配符*。

## pkg打包文件的机制
pkg只会自动地打包相对于__dirname、__filename的文件，例如path.join(__dirname, '../path/to/asset')。至于require()，因为require本身就是相对于__dirname的，所以能够自动打包。假设文件中有以下代码：

```js
require('./build/' + cmd + '.js')
path.join(__dirname, 'views/' + viewName)
```
cmd和viewname这些路径都不是常量，pkg没办法帮你自动识别要打包哪个文件，所以文件就丢失了，所以这时候就使用scripts和assets来告诉pkg，这些文件要打包进去

#### pkg可以根据package.json下的配置进行打包，默认入口文件为bin指向的文件。
执行
```js
pkg .
```
或是
```js
pkg package.json
```
即可自动按照package.json的配置打包。
```js
//package.json
{
    //其他配置项
    "bin": "service.js",//入口文件
    "pkg": {
        "scripts": [
            "build/**/*.js"//需要打包进来的其他js文件，可添加多个
        ],
        "assets": [
            "dist/**/*"//静态文件的目录，可添加多个
        ]
    }
}    
```
#### 也可以根据入口文件打包
```txt
pkg index.js
```
即可打包linux,macos,win3个平台的可执行文件。index.js为你node项目的入口文件。

如果只想打包windows下的exe，则加上-t参数。win即为打包成windows平台下的exe文件，具体可选参数参见项目目录
```
pkg -t win index.js
```

稍等片刻后项目目录下就会生成打包好的index.exe文件。

pkg会自动从入口文件开始查找依赖的文件并全数打包进去，无须修改项目里的任何代码。