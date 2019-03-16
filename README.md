# flammae
基于React的静态网页创建工具(markdown)

## 注意

flammae 还在开发阶段，可能存在bug，发现bug请及时反馈，多谢！

issues: https://github.com/LiZ2z/flammae/issues

## 安装及使用

```cmd
npm install flammae -g
```

```cmd
flammae create <project-name>

cd <project-name>

flammae run dev
```


## 项目目录

项目目录一般为：
```
|-node_modules
|-src
|-package.json
|-flame.config.js
```
src目录下又包括（_这些文件夹将被`flammae`解析，其他命名文件夹不会被解析_）：
```
|-templates     用于存放 .jsx 文件
|-docs          用于存放 .md  文件
|-pages         用于存放 .jsx 文件
|-styles        用于存放 .css 文件
```


#### 1. `templates`
`templates`用于存放模板文件，目前可选的有`index.js`和`content.js`。

`index.js`将会作为网站的首页，可通过`#/index`访问到。

`content.js`将被用作每个`.md`文件的渲染模板。
例如：
```jsx
import React, { Component } from 'react';
import {
   siteData
} from 'flammae'

class Content extends Component {
    render() {
        return (
            <div>
                {/* 其他的一些代码 */}
                {this.props.renderMarkdown()}
                {/* 其他的一些代码 */}
            </div>
        );
    }
}

export default Content;
```

#### 2. `pages`和`docs`
其中`pages`和`docs`目录下的每个文件都会作为一个单独的页面进行处理，且都需要在文件的头部做信息的声明。

对于`.md`文件，需要在头部使用类似`yaml`语言的方式书写信息：
``` frontmatter
---
path: '/router'
title: 'My first flammae page'
---
```
这样，我们就可以在上面说到的`templates/content.js`中通过`this.props.data`来访问这些信息。

对于`.jsx`文件，需要在头部使用行级注释（`//`）的方式书写信息：
```jsx
// path: '/router'
// title: 'My first flammae page'
```
同样，这些信息可以在`this.props.data`中访问到。

>注意： path是必须的，path声明的值将作为访问这个页面的路由地址，如果没有path，该文件将不被显示。

>在flammae的项目中你可以通过`import {siteData} from 'flammae'`的方式访问到全部文件的头部数据



#### 3. `styles`
`styles`下只能用来存放样式文件（`.css`、`.less`或`.scss`），否则会导致错误。这些文件将会作为全局的样式文件，放在项目的入口处。对于`.less`或`.scss`之类的文件，需要在`root/flammae.config.js`中添加配置，并安装相应的`loader`。

## `flammae.config.js`的配置

_待续。。。_

## markdown 编写规范

### 为markdown引入样式

在markdown文件中这样写：
```
::: style
``` javascript
require('./style.css')
`` `
:::
```

### 代码演示
如果代码想要被演示（根据markdown中的代码块动态渲染内容，目前仅支持`jsx`），需要用`:::`将代码块包起来， 并在代码标识符（```）后加`lang`字符串 ，例如，我们想演示一个`React`组件，要像下面这样写：

```
:::
``` jsx
class Demo extends Component {
    ...code here
}
`` `
:::
```
这样，当加载到这个markdown文件时，解析器就会知道该代码片段需要展示出来，且需要使用能解析`jsx`语法的编译器（即flame的代码插件，flame默认提供针对`jsx`的解析插件）来处理这段代码。

注意，必须指定代码块的语言（上方的`jsx`），不然flame不知道用什么编译器来处理该段代码。

### 代码演示的指令

此外我们还可以在`:::`符号后面加入一些指令或说明，就像下面这样

```
::: only

这里是代码的一些说明
here is some note for code

``` jsx
class Demo extends Component {
    ...code here
}
`` `
:::
```

`:::`内部的内容（不包括代码块）将被当作对代码的说明传给插件。

`:::`后面的字符将被当作指令传递给插件，具体的指令由不同的插件规定。

如上所示，当我们使用了`only`指令，该段代码将只会被执行演示，而不会作为html渲染出来。


还可以通过flammae自带指令：`style`，为每个`.md`文件编写样式。
```
::: style
``` (可不用指定语言)
    require('./style.css')
`` `
:::
```


### `jsx`解析插件的规则

**class 的名称必须为 `Demo`。如果写成函数式的组件，那么函数名也必须为 `Demo`。**

假如我们有如下需要演示的代码（当然，要使用`:::`包裹住。）：

```jsx
import {Component} from 'react'
import {Button} from 'ui'
//   must be Demo
class Demo extends Component {
    handleClick() {
        console.log('clicked')
    }
    render() {
        return (
            <div>
                <Button onClick={this.handleClick.bind(this)}>click</Button>
                <Button>click</Button>
            </div>
        );
    }
}
```




## TODO: 
- 完善可配置项
- 自动化监听文件部分功能代码优化

## CONCEPT
- 将flammae改成webpack的插件
- 提取loader跟模板，要求每个loader自带一套模板