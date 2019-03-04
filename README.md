# site-flame
静态网页创建工具--(react、markdown)

## 注意

github: https://github.com/LiZ2z/site-flame

site-flame 还在开发阶段，此包为测试样例，不要依赖它

site-flame 可能改名为 flamma


Site-flame is still in the development phase. this package is a test sample. don't rely on it.

Site-flame may change its name to flamma

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



## markdown 编写规范

如果代码想要被演示（根据markdown中的代码块动态渲染内容，目前仅支持`jsx`）， 需要在代码标识符后加`lang`（根据不同的语言）和`demo`字符串 ，例如，我们想演示一个`React`组件，需要这样写：

```
``` jsx demo
code here...
`` `
```
这样，当加载到这个markdown文件时，解析器就会知道该代码片段需要展示出来，且需要使用能解析`jsx`语法的loader来处理这段代码。

根据`jsx-loader`规定，任何在demo代码块中使用到的`module`都需要在markdown头部的`frontmatter`块中声明：

``` frontmatter
---
modules: ['React', 'Component', 'Button']
---
```


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



## TODO: 
- 文件夹解析优化
- 自动化监听文件修改优化
- markdown文件loader优化
