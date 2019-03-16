---
path: '/example'
title: 'Example'
---

# Example

这只一个示例文档


## 给Markdown引入样式

::: style
```javascript
require('./style.css')
```
:::

## demo展示
::: 

```jsx
import React from 'react'
// class的类名必须为 Demo
class Demo extends React.Component {
    handleClick() {
        console.log('clicked')
    }
    render() {
        return (
            <div>
                <button onClick={this.handleClick.bind(this)}>click me!</button>
            </div>
        );
    }
}
```
:::

## 只展示demo，不显示代码
::: only

```jsx
import React from 'react'
// class的类名必须为 Demo
class Demo extends React.Component {
    handleClick() {
        console.log('clicked')
    }
    render() {
        return (
            <div>
                <button onClick={this.handleClick.bind(this)}>click me!</button>
            </div>
        );
    }
}
```
:::