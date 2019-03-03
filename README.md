# site-flame
静态网页创建工具--(react、markdown)

github: https://github.com/LiZ2z/site-flame

site-flame 还在开发阶段，此包为测试样例，不要依赖它

Site-flame is still in the development phase. this package is a test sample. don't rely on it.


## markdown 编写规范

如果代码想要被演示， 需要在代码标识符后加`lang`（根据不同的语言）和`demo`字符串 ，例如，我们想演示一个`React`组件，需要这样写：

```
``` jsx demo

```
这样，当加载到这个markdown时，解析器就会知道该代码片段需要展示出来，且需要使用能解析`jsx`语法的loader来处理这段代码。

根据`jsx-loader`规定，任何在demo代码块中使用到的module都需要在markdown头部的frontmatter中声明：
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
