# site-flame
基于React的静态网页创建工具(markdown)

## 注意

site-flame 还在开发阶段，可能存在bug，发现bug请及时反馈，多谢！

issues: https://github.com/LiZ2z/site-flame/issues

## 安装

```
npm install site-flame
```
在`package.json'中添加
```json
 "scripts": {
    "start": "node node_modules/site-flame/scripts/start -dev",
    "build": "node node_modules/site-flame/scripts/start -build"
  },
  "eslintConfig": {
    "extends": "@78d6/eslint-config-react-app"
  }
```

## 项目目录

项目目录一般为：
```
|-node_modules
|-src
|-package.json
|-flame.config.js
```
src目录下又包括（_这些文件夹将被`flame`解析，其他命名文件夹不会被解析_）：
```
|-templates     用于存放 .jsx 文件
|-docs          用于存放 .md  文件
|-pages         用于存放 .jsx 文件
|-styles        用于存放 .css 文件
```


#### 1. `templates`
`templates`用于存放模板文件，目前可选的有`index.js`和`content.js`。

`index.js`将会作为网站的首页，可通过`#\index`访问到。

`content.js`将被用作每个`.md`文件的渲染模板。
例如：
```jsx
import React, { Component } from 'react';
import {
    // siteData,
    Markdown  // 默认的site-flame提供的默认Markdown渲染组件，以后将提供可配置接口
} from 'site-flame'
import * as UI from '../ui' // 一些组件库，如果你想使用Demo的话

class Content extends Component {
    render() {
        const data = this.props.data // 包含着一个 .md 文件的所有信息

        // 我们将根据在 .md 头部声明的modules来将对应的 modules传递给Demo
        // 你可以暂时不用管这里，继续往下看
        const modules = data.frontmatter.modules.map(item=>{
            switch(item) {
                case 'React':
                return React
                case 'Component':
                return Component
                default:
                return UI[item]
            }
        })
        return (
            <div>
                {/* 其他的一些代码 */}
                <Markdown md={data} modules={modules}/>
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
title: 'My first flame page'
modules: ['React', 'Component', 'Button']
---
```
这样，我们就可以在上面说到的`templates/content.js`中通过`this.props.data`来访问这些信息。

对于`.jsx`文件，需要在头部使用行级注释（`//`）的方式书写信息：
```jsx
// path: '/router'
// title: 'My first flame page'
```
同样，这些信息可以在`this.props.data`中访问到。

>注意： path是必须的，path声明的值将作为访问这个页面的路由地址，如果没有path，该文件将不被显示。

>在flame的项目中你可以通过`import {siteData} from 'site-flame'`的方式访问到全部文件的头部数据



#### 3. `styles`
`styles`下只能用来存放样式文件（`.css`、`.less`或`.scss`），否则会导致错误。这些文件将会作为全局的样式文件，放在项目的入口处。对于`.less`或`.scss`之类的文件，需要在`root/flame.config.js`中添加配置，并安装相应的`loader`。

## `flame.config.js`的配置

待续。。。

## markdown 编写规范

#### 1. 代码演示
如果代码想要被演示（根据markdown中的代码块动态渲染内容，目前仅支持`jsx`）， 需要在代码标识符后加`lang`（根据不同的语言）和`demo`字符串 ，例如，我们想演示一个`React`组件，需要在markdown中这样写：

```
``` jsx demo
class Demo extends Component {
    ...code here
}
`` `
```
这样，当加载到这个markdown文件时，解析器就会知道该代码片段需要展示出来，且需要使用能解析`jsx`语法的loader来处理这段代码。

> 注意： class 的名称必须为 `Demo`

#### 2. 代码演示中的模块
假如我们有如下需要演示的代码：

```jsx demo
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
我们在这段代码中使用到了`React`、`Component`和`Button`模块。
根据`jsx-loader`规定，任何在demo代码块中使用到的`module`都需要在markdown头部的`frontmatter`块中声明：

``` frontmatter
---
modules: ['React', 'Component', 'Button']
---
```


## TODO: 
- 自动化监听文件修改优化
- markdown文件loader优化
- 完善可配置项
