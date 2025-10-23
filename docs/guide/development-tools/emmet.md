# Emmet语法详解

Emmet是一套用于快速编写HTML、CSS和其他结构化代码的工具和语法，能极大提高前端开发效率。它可以将简短的缩写表达式扩展为完整的HTML或CSS代码。

## 1. 基础语法

### 1.1 HTML标签展开

下面是一些基本HTML标签的Emmet缩写示例：

#### `div`
```html
<div></div>
```

#### `p`
```html
<p></p>
```

#### `a`
```html
<a href=""></a>
```

#### `img`
```html
<img src="" alt="">
```

### 1.2 嵌套操作符

嵌套操作符用于构建HTML元素之间的层次关系：

#### 子元素操作符(`>`) - 创建父子关系
**缩写**：`div>p`
```html
<div>
  <p></p>
</div>
```

#### 兄弟元素操作符(`+`) - 创建兄弟关系
**缩写**：`div+p`
```html
<div></div>
<p></p>
```

#### 组合使用
**缩写**：`div>p+a`
```html
<div>
  <p></p>
  <a href=""></a>
</div>
```

#### 上一级操作符(`^`) - 提升到父级的兄弟级别
**缩写**：`div>p^a`
```html
<div>
  <p></p>
</div>
<a href=""></a>
```

#### 分组操作符(`()`) - 用于复杂嵌套结构
**缩写**：`div>(p>a)+ul>li`
```html
<div>
  <p><a href=""></a></p>
  <ul>
    <li></li>
  </ul>
</div>
```

### 1.3 乘法和编号

#### 乘法操作符(`*`) - 重复元素
**缩写**：`ul>li*3`
```html
<ul>
  <li></li>
  <li></li>
  <li></li>
</ul>
```

#### 编号操作符(`$`) - 自动编号
**缩写**：`ul>li.item$*3`
```html
<ul>
  <li class="item1"></li>
  <li class="item2"></li>
  <li class="item3"></li>
</ul>
```

#### 双$生成两位数字编号
**缩写**：`ul>li.item$$*3`
```html
<ul>
  <li class="item01"></li>
  <li class="item02"></li>
  <li class="item03"></li>
</ul>
```

#### `@-` 倒序编号
**缩写**：`ul>li.item$@-*3`
```html
<ul>
  <li class="item3"></li>
  <li class="item2"></li>
  <li class="item1"></li>
</ul>
```

#### `@数字` 从指定数字开始编号
**缩写**：`ul>li.item$@3*5`
```html
<ul>
  <li class="item3"></li>
  <li class="item4"></li>
  <li class="item5"></li>
  <li class="item6"></li>
  <li class="item7"></li>
</ul>
```

### 1.4 属性操作符

#### 类操作符(`.`) - 添加class属性
**缩写**：`div.class`
```html
<div class="class"></div>
```

#### ID操作符(`#`) - 添加id属性
**缩写**：`div#id`
```html
<div id="id"></div>
```

#### 多个class
**缩写**：`div.class1.class2`
```html
<div class="class1 class2"></div>
```

#### 组合id和class
**缩写**：`div#header.content`
```html
<div id="header" class="content"></div>
```

#### 自定义属性(`[]`)
**缩写**：`a[href="http://example.com" target="_blank"]`
```html
<a href="http://example.com" target="_blank"></a>
```

#### 多属性定义
**缩写**：`input[type="text" name="username" placeholder="请输入用户名"]`
```html
<input type="text" name="username" placeholder="请输入用户名">
```

### 1.5 文本内容

#### 文本操作符(`{}`) - 添加文本内容
**缩写**：`div{文本内容}`
```html
<div>文本内容</div>
```

#### 带文本的嵌套结构
**缩写**：`div>p{段落内容}+span{额外文本}`
```html
<div>
  <p>段落内容</p>
  <span>额外文本</span>
</div>
```

#### 文本与编号结合
**缩写**：`ul>li{item $}*3`
```html
<ul>
  <li>item 1</li>
  <li>item 2</li>
  <li>item 3</li>
</ul>
```

## 2. CSS缩写

### 2.1 属性缩写

#### 简单数值属性
**缩写**：`m10`
```css
margin: 10px;
```

#### 百分比值
**缩写**：`m10p`
```css
margin: 10%;
```

#### 多值属性，空格分隔
**缩写**：`m10-20`
```css
margin: 10px 20px;
```

#### 3个值的简写
**缩写**：`m10-20-30`
```css
margin: 10px 20px 30px;
```

#### 4个值的简写
**缩写**：`m10-20-30-40`
```css
margin: 10px 20px 30px 40px;
```

### 2.2 常用CSS属性缩写

以下是一些最常用的CSS属性缩写示例：

```css
/* 尺寸相关 */
w100  /* width: 100px; */
h100  /* height: 100px; */

/* 边距相关 */
p10   /* padding: 10px; */
m10   /* margin: 10px; */

/* 定位相关 */
t0    /* top: 0; */
l0    /* left: 0; */
b0    /* bottom: 0; */
r0    /* right: 0; */
pos:a /* position: absolute; */
pos:r /* position: relative; */
pos:f /* position: fixed; */

/* 显示相关 */
d:block /* display: block; */
d:flex  /* display: flex; */
d:grid  /* display: grid; */

/* 字体相关 */
fz14    /* font-size: 14px; */
fw:bold /* font-weight: bold; */
c:red   /* color: red; */

/* 背景和边框 */
bg:blue /* background-color: blue; */
op:0.5  /* opacity: 0.5; */
bd      /* border: 1px solid #000; */
bdr5    /* border-radius: 5px; */
sh:1-2-3-#000 /* box-shadow: 1px 2px 3px #000; */
```

### 2.3 颜色值缩写

Emmet提供了颜色值的简写方式，让你可以快速输入常用颜色：

```css
/* 单字符颜色值扩展 */
c:#3    /* color: #333; */

/* 双字符颜色值扩展(带透明度) */
c:#ab   /* color: #aabb; */

/* 三字符颜色值扩展 */
c:#123  /* color: #112233; */

/* 四字符颜色值扩展(带透明度) */
c:#1234 /* color: #11223344; */
```

### 2.4 Flexbox和Grid布局

现代布局技术的Emmet缩写：

```css
/* Flexbox布局 */
df              /* display: flex; */
dfc             /* display: flex;
                  flex-direction: column; */
jc:center       /* justify-content: center; */
jc:space-between /* justify-content: space-between; */
ai:center       /* align-items: center; */
fd:column       /* flex-direction: column; */
fg:1            /* flex-grow: 1; */
fb:200px        /* flex-basis: 200px; */

/* Grid布局 */
dg              /* display: grid; */
gap:10          /* gap: 10px; */
g-cols:3        /* grid-template-columns: repeat(3, 1fr); */
g-rows:2        /* grid-template-rows: repeat(2, 1fr); */
```

## 3. 高级功能

### 3.1 隐式标签

Emmet能够根据上下文自动推断标签类型：

#### 无标签时默认展开为div
**缩写**：`.class`
```html
<div class="class"></div>
```

#### 在em内默认展开为span
**缩写**：`em>.class`
```html
<em><span class="class"></span></em>
```

#### 在ul内默认展开为li
**缩写**：`ul>.item*3`
```html
<ul>
  <li class="item"></li>
  <li class="item"></li>
  <li class="item"></li>
</ul>
```

#### 在select内默认展开为option
**缩写**：`select>.option*3`
```html
<select>
  <option></option>
  <option></option>
  <option></option>
</select>
```

### 3.2 HTML文档初始化

| 缩写表达式 | 功能 |
|-----------|------|
| `!` | 生成HTML5文档结构，包含doctype、html、head和body等 |
| `html:5` | 等同于 `!`，生成HTML5文档结构 |
| `html:4t` | 生成HTML4过渡型文档结构 |
| `html:4s` | 生成HTML4严格型文档结构 |
| `html:xml` | 生成XHTML文档结构 |

### 3.3 自定义片段

Emmet支持自定义代码片段，可以通过编辑器配置或插件扩展来添加自定义缩写。

## 4. 实际应用示例

### 4.1 快速创建页面结构

**缩写表达式:**
```
!>header#main-header>nav>ul>li*5>a{导航项 $}+main>section#content>h1{主标题}+p{段落内容}+div.grid>div.item*4>img[src="image$.jpg" alt="图片 $"]+h3{项目标题 $}+p{项目描述内容}
```

**展开结果:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <header id="main-header">
    <nav>
      <ul>
        <li><a href="">导航项 1</a></li>
        <li><a href="">导航项 2</a></li>
        <li><a href="">导航项 3</a></li>
        <li><a href="">导航项 4</a></li>
        <li><a href="">导航项 5</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <section id="content">
      <h1>主标题</h1>
      <p>段落内容</p>
      <div class="grid">
        <div class="item">
          <img src="image1.jpg" alt="图片 1">
          <h3>项目标题 1</h3>
          <p>项目描述内容</p>
        </div>
        <div class="item">
          <img src="image2.jpg" alt="图片 2">
          <h3>项目标题 2</h3>
          <p>项目描述内容</p>
        </div>
        <div class="item">
          <img src="image3.jpg" alt="图片 3">
          <h3>项目标题 3</h3>
          <p>项目描述内容</p>
        </div>
        <div class="item">
          <img src="image4.jpg" alt="图片 4">
          <h3>项目标题 4</h3>
          <p>项目描述内容</p>
        </div>
      </div>
    </section>
  </main>
</body>
</html>
```

### 4.2 快速创建表单

**缩写表达式:**
```
form[action="/submit" method="post"]>div.form-group*3>label{${label $}}+input[type="text" name="field$" placeholder="请输入${label $"]+div.form-group>label{密码}+input[type="password" name="password" placeholder="请输入密码"]+button[type="submit" class="btn btn-primary"]{提交}
```

**展开结果:**
```html
<form action="/submit" method="post">
  <div class="form-group">
    <label>label 1</label>
    <input type="text" name="field1" placeholder="请输入label 1">
  </div>
  <div class="form-group">
    <label>label 2</label>
    <input type="text" name="field2" placeholder="请输入label 2">
  </div>
  <div class="form-group">
    <label>label 3</label>
    <input type="text" name="field3" placeholder="请输入label 3">
  </div>
  <div class="form-group">
    <label>密码</label>
    <input type="password" name="password" placeholder="请输入密码">
  </div>
  <button type="submit" class="btn btn-primary">提交</button>
</form>
```

## 5. 编辑器支持情况

### 5.1 内置支持的编辑器

- Visual Studio Code
- Sublime Text (需要安装Emmet插件)
- Atom (需要安装Emmet插件)
- WebStorm
- Brackets
- Dreamweaver CC
- Notepad++ (需要安装相关插件)

### 5.2 浏览器扩展

- Emmet LiveStyle
- Emmet Re:view

## 6. 最佳实践

### 6.1 效率提升技巧

1. **记住常用缩写**：掌握基本的嵌套、属性和CSS缩写，可以显著提高编码速度
2. **结合编辑器功能**：利用编辑器的代码补全和Emmet的缩写功能
3. **自定义片段**：为项目中常用的结构创建自定义Emmet片段
4. **批量操作**：使用乘法操作符快速创建重复结构，然后进行微调

### 6.2 注意事项

1. **不要过度依赖**：Emmet是工具，理解HTML/CSS的结构和语义仍然重要
2. **结构复杂性**：过于复杂的缩写可能降低可读性，影响团队协作
3. **定期练习**：通过练习熟悉更多Emmet语法，提高使用效率
4. **检查输出**：生成代码后检查输出，确保符合预期

Emmet是前端开发中非常实用的工具，通过掌握其语法，可以大幅提高HTML和CSS的编写效率。建议开发者花时间熟悉常用的Emmet语法，将其融入到日常的开发工作中。