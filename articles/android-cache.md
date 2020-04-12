# Android 数据存储
Android提供了5种方式来让用户保存持久化应用程序数据。根据自己的需求来做选择，比如数据是否是应用程序私有的，是否能被其他程序访问，需要多少数据存储空间等，分别是：　 　　 
- 使用SharedPreferences存储数据　
- 文件存储数据
- SQLite数据库存储数据
- 使用ContentProvider存储数据
- 网络存储数据　

Android提供了一种方式来暴露你的数据（甚至是私有数据）给其他应用程序 - ContentProvider。它是一个可选组件，可公开读写你应用程序数据。

## SharedPreferences存储
SharedPreference类提供了一个总体框架，使您可以保存和检索的任何基本数据类型（ boolean, float, int, long, string）的持久键-值对（基于XML文件存储的“key-value”键值对数据）。

通常用来存储程序的一些配置信息。其存储在“data/data/程序包名/shared_prefs“目录下。

我们可以通过以下两种方法获取SharedPreferences对象:

如果你的Activity中只需要一个SharedPreferences的时候使用。
```java
getPreferences (int mode)
```

当我们有多个SharedPreferences的时候，根据第一个参数name获得相应的SharedPreferences对象。
```java
getSharedPreferences (String name, int mode)
```

#### 这里的mode有四个选项：
- Context.MODE_PRIVATE: 该SharedPreferences数据只能被本应用程序读、写。
- Context.MODE_WORLD_READABLE: 该SharedPreferences数据能被其他应用程序读，但不能写。
- Context.MODE_WORLD_WRITEABLE: 该SharedPreferences数据能被其他应用程序读和写。
- Context.MODE_MULTI_PROCESS: sdk2.3后添加的选项，当多个进程同时读写同一个SharedPreferences时它会检查文件是否修改。

### Shared Preferences读写
```java
SharedPreferences settings = getSharedPreferences("fanrunqi", 0);
SharedPreferences.Editor editor = settings.edit();
/* 写操作 */
editor.putBoolean("isAmazing", true); 
// 提交本次编辑
editor.commit();

/*  读操作 */
boolean isAmazing= settings.getBoolean("isAmazing",true);
```

同时Edit还有两个常用的方法：
```java
/* 下一次commit的时候会移除key对应的键值对 */
editor.remove(String key) 

/* 移除所有键值对 */
editor.clear()
```


## 文件存储
>文件存储分为内部存储和外部存储

### 内部存储
当文件被保存在内部存储中时，默认情况下，文件是应用程序私有的，其他应用不能访问。当用户卸载应用程序时这些文件也跟着被删除。

文件默认存储位置：/data/data/包名/files/文件名。

创建和写入一个内部存储的私有文件:
```java
String FILENAME = "a.txt";
String string = "fanrunqi";
try {
    FileOutputStream fos = openFileOutput(FILENAME, Context.MODE_PRIVATE);
    fos.write(string.getBytes());
    fos.close();
} catch (Exception e) {
    e.printStackTrace();
}
```
#### mode参数：用于指定操作模式，分为四种：
- Context.MODE_PRIVATE = 0
    - 为默认操作模式，代表该文件是私有数据，只能被应用本身访问，在该模式下，写入的内容会覆盖原文件的内容。
- Context.MODE_APPEND = 32768
   - 该模式会检查文件是否存在，存在就往文件追加内容，否则就创建新文件。　
- Context.MODE_WORLD_READABLE = 1
   - 表示当前文件可以被其他应用读取。
- MODE_WORLD_WRITEABLE
   - 表示当前文件可以被其他应用写入。

读取一个内部存储的私有文件:
```java
String FILENAME = "a.txt";
try {
    FileInputStream inStream = openFileInput(FILENAME);
    int len = 0;
    byte[] buf = new byte[1024];
    StringBuilder sb = new StringBuilder();
    while ((len = inStream.read(buf)) != -1) {
        sb.append(new String(buf, 0, len));
    }
    inStream.close();
} catch (Exception e) {
    e.printStackTrace();
}
```
#### 其他一些经常用到的方法：
- getFilesDir(): 得到内存储文件的绝对路径
- getDir(): 在内存储空间中创建或打开一个已经存在的目录
- deleteFile(): 删除保存在内部存储的文件
- fileList(): 返回当前由应用程序保存的文件的数组(内存储目录下的全部文件)

#### 保存编译时的静态文件
如果你想在应用编译时保存静态文件，应该把文件保存在项目的　res/raw/　目录下，你可以通过 openRawResource()方法去打开它（传入参数R.raw.filename），这个方法返回一个 InputStream流对象你可以读取文件但是不能修改原始文件。
```java
InputStream is = this.getResources().openRawResource(R.raw.filename);
```

#### 保存内存缓存文件
有时候我们只想缓存一些数据而不是持久化保存，可以使用getCacheDir（）去打开一个文件，文件的存储目录（ /data/data/包名/cache ）是一个应用专门来保存临时缓存文件的内存目录。

当设备的内部存储空间比较低的时候，Android可能会删除这些缓存文件来恢复空间，但是你不应该依赖系统来回收，要自己维护这些缓存文件把它们的大小限制在一个合理的范围内，比如1ＭＢ．当你卸载应用的时候这些缓存文件也会被移除。

### 外部存储（sdcard）
因为内部存储容量限制，有时候需要存储数据比较大的时候需要用到外部存储，使用外部存储分为以下几个步骤：
- 添加外部存储访问限权
- 检测外部存储的可用性
- 访问外部存储器中的文件

```java
/* 首先，要在AndroidManifest.xml中加入访问SDCard的权限 */
<!-- 在SDCard中创建与删除文件权限 --> 
<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS"/> 

<!-- 往SDCard写入数据权限 --> 
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>

/* 获取外存储的状态 */
String state = Environment.getExternalStorageState();
if (Environment.MEDIA_MOUNTED.equals(state)) {
    // 可读可写
    mExternalStorageAvailable = mExternalStorageWriteable = true;
} else if (Environment.MEDIA_MOUNTED_READ_ONLY.equals(state)) {
    // 可读
} else {
    // 可能有很多其他的状态，但是我们只需要知道，不能读也不能写  
}

/*
打开一个外存储目录，此方法需要一个类型，指定你想要的子目录，如类型参数DIRECTORY_MUSIC和 DIRECTORY_RINGTONES（传null就是你应用程序的文件目录的根目录）。通过指定目录的类型，确保Android的媒体扫描仪将扫描分类系统中的文件（例如，铃声被确定为铃声）。如果用户卸载应用程序，这个目录及其所有内容将被删除。
**/
File file = new File(getExternalFilesDir(null), "fanrunqi.jpg");
if(Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED){     File sdCardDir = Environment.getExternalStorageDirectory();//获取SDCard目录  "/sdcard"        
    File saveFile = new File(sdCardDir,"a.txt"); 
    //写数据
    try {
        FileOutputStream fos= new FileOutputStream(saveFile); 
        fos.write("fanrunqi".getBytes()); 
        fos.close();
    } catch (Exception e) {
        e.printStackTrace();
    } 
				
    //读数据
    try {
        FileInputStream fis= new FileInputStream(saveFile); 
        int len =0;
        byte[] buf = new byte[1024];
        StringBuffer sb = new StringBuffer();
        while((len=fis.read(buf))!=-1){
            sb.append(new String(buf, 0, len));
        }
        fis.close();
    } catch (Exception e) {
        e.printStackTrace();
    }
}  
```


## 网络存储
网络存储方式，需要与Android 网络数据包打交道，Android提供了HttpUrlConnection。
HttpUrlConnection是Java.net包中提供的API，我们知道Android SDK是基于Java的，所以当然优先考虑HttpUrlConnection这种最原始最基本的API，其实大多数开源的联网框架基本上也是基于JDK的HttpUrlConnection进行的封装

HttpClient是开源组织Apache提供的Java请求网络框架，其最早是为了方便Java服务器开发而诞生的，是对JDK中的HttpUrlConnection各API进行了封装和简化，提高了性能并且降低了调用API的繁琐，Android因此也引进了这个联网框架，我们再不需要导入任何jar或者类库就可以直接使用，值得注意的是Android官方已经宣布不建议使用HttpClient了。
