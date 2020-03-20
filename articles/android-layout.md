Android中六种布局方式分别是:线性布局（LiearLayout），相对布局（RelativeLayout），
帧布局（FrameLayout），绝对布局（AbsoluteLayout），表格布局（TableLayout），网格布局（GridLayout）。

- 线性布局（LiearLayout）: 屏幕垂直或水平方向布局。
- 相对布局（RelativeLayout）: 以其他控件为参照布局。
- 帧布局（FrameLayout）：控件从屏幕左上角开始布局。
- 表格布局（TableLayout）：按照行列方式布局。
- 网格布局（GridLayout）：按照行列方式布局
- 绝对布局（AbsoluteLayout）：以屏幕坐标布局。


## 线性布局（LiearLayout）
线性布局在开发中使用最多，具有垂直方向与水平方向的布局方式，通过设置属性“android:orientation”控制方向，属性值垂直（vertical）和水平(horizontal)，默认水平方向。

### 常用的属性：
- android:orientation  可以设置布局的方向
    - vertical: 垂直方向
    - horizontal: 水平方向
- android:gravity  用来控制子组件的对齐方式
    - center: 居中对齐
    - center_vertical: 垂直居中
    - center_horizontal: 不平居中
    - top: 顶对齐
    - bottom: 底对齐
    - left: 左齐
    - rigth: 右对齐
- layout_weight：控制各个组件在布局中的权重
  
```xml
<LinearLayout
 android:layout_width="match_parent"
 android:layout_height="100dp"
 android:orientation="horizontal"
 android:gravity="center"> 
 <Button
  android:layout_height="wrap_content"
  android:layout_width="wrap_content"
  android:text="确定"
  /> 
 <Button
  android:layout_height="wrap_content"
  android:layout_width="wrap_content"
  android:text="取消"
  /> 
</LinearLayout>
```
---

## 相对布局（RelativeLayout)
相对布局是通过相对定位的方式让控件出现在布局任意位置。在相对布局中如果不指定控件摆放的位置，那么控件都会被默认放在RelativeLayout的左上角。因此要先指定第一个控件的位置，再根据一个控件去给其他控件布局。

### RelativeLayout常见属性：
#### 相对于父元素给控件布局
- android:layout_centerHrizontal  水平居中 
- android:layout_centerVertical 垂直居中 
- android:layout_centerInparent    相对于父元素完全居中 
- android:layout_alignParentBottom 位于父元素的下边缘 
- android:layout_alignParentLeft   位于父元素的左边缘 
- android:layout_alignParentRight  位于父元素的右边缘 
- android:layout_alignParentTop    位于父元素的上边缘 
- android:layout_alignWithParentIfMissing  如果对应的兄弟元素找不到的话就以父元素做参照物 


#### 属性值必须为id的引用名“@id/id-name” 
- android:layout_below      位于元素的下方 
- android:layout_above      位于元素的的上方 
- android:layout_toLeftOf   位于元素的左边 
- android:layout_toRightOf  位于元素的右边 

- android:layout_alignTop   该元素的上边缘和某元素的的上边缘对齐 
- android:layout_alignLeft  该元素的左边缘和某元素的的左边缘对齐 
- android:layout_alignBottom 该元素的下边缘和某元素的的下边缘对齐 
- android:layout_alignRight  该元素的右边缘和某元素的的右边缘对齐

---

## 帧布局（FrameLayout）
帧布局会默认把控件放在屏幕上的左上角的区域,后续添加的控件会覆盖前一个,如果控件的大小一样大的话,那么同一时刻就只能看到最上面的那个控件

### FrameLayout常用属性：
- android:foreground  设置改帧布局容器的前景图像 
- android:foregroundGravity  设置前景图像显示的位置

---

## TableLayout(表格布局)
表格形式的布局，是由多个TableRow对象组成，每个TableRow可以有0个或多个单元格，每个单元格就是一个view,这些单元格不能定义宽度（默认match_parent），只能定义高度

TableLayout继承了 LinearLayout，因此它的本质依然是线性布局管理器。每次向TableLayout中添加一个TableRow，该TableRow就是一个表格行，TableRow也是容器，因此它也可以不断地添加其他组件，每添加一个子组件该表格就增加一列。如果直接向TableLayout中添加组件，那么这个组件将直接占用一行。

### TableLayout三种属性
- android:collapseColumns 设置需要被隐藏的列的序号
- android:shrinkColumns 设置允许被收缩的列的列序号
- android:stretchColumns 设置运行被拉伸的列的列序号

以上这三个属性的列号都是从0开始算的,比如shrinkColunmns = "2",对应的是第三列！
可以设置多个,用逗号隔开比如"0,2",如果是所有列都生效,则用"*"号即可

除了这三个常用属性,还有两个属性,分别就是跳格子以及合并单元格,这和HTML中的Table类似:
- android:layout_column="2":表示的就是跳过第二个,直接显示到第三个格子处,从1开始算的!
- android:layout_span="4":表示合并4个单元格,也就说这个组件占4个单元格

---
## 网格布局（GridLayout）
GridLayout是Android4.0引入的网格布局，使用它可以减少布局嵌套，和 TableLayout(表格布局) 有点类似，不过它功能更多，也更加好用
- 可以自己设置布局中组件的排列方式
- 可以自定义网格布局有多少行,多少列
- 可以直接设置组件位于某行某列
- 可以设置组件横跨几行或者几列

### GridLayout常用属性
- android:columnCount	最大列数
- android:rowCount	最大行数
- android:orientation	GridLayout中子元素的布局方向
- android:alignmentMode	alignBounds：对齐子视图边界 alignMargins ：对齐子视距内容，默认值
- android:columnOrderPreserved	使列边界显示的顺序和列索引的顺序相同，默认是true
- android:rowOrderPreserved	使行边界显示的顺序和行索引的顺序相同，默认是true
- android:useDefaultMargins	没有指定视图的布局参数时使用默认的边距，默认值是false

### item属性
- android:layout_column	指定该单元格在第几列显示
- android:layout_row	指定该单元格在第几行显示
- android:layout_columnSpan	指定该单元格占据的列数
- android:layout_rowSpan	指定该单元格占据的行数
- android:layout_gravity	指定该单元格在容器中的位置
- android:layout_columnWeight	（API21加入）列权重
- android:layout_rowWeight	（API21加入） 行权重

使用layout_columnSpan 、layout_rowSpan时要加上layout_gravity属性，否则没有效果；另外item在边缘时宽高计算会出现错误，需要我们手动设置宽高，否则达不到想要的效果

### 平分问题
GridLayout在API21时引入了android:layout_columnWeight和android:layout_rowWeight来解决平分问题

那么在API21以前的，想要平分的话：引用兼容包
```java
compile 'com.android.support:gridlayout-v7:25.+'
```

注意：
- 使用该控件，命名空间使用app
- 单独设置app:layout_columnWeight时，这一列的所有item都设置为这个属性，才能达到预期效果，否则这一列中设置了该属性的item，都会被隐藏，显示不出来
- 单独设置app:layout_rowWeight时，没有问题

---

## 绝对布局（AbsoluteLayout）
主要是通过坐标来进行控制控件的位置，因为在4寸手机上可以正常使用，在其他尺寸上会变形，所以这个布局，已经不建议使用。