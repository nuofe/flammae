import React, { Component } from 'react';
import Markdown from '../markdown'


class Content extends Component {

    render() {
        const data = this.props.data
        const modules = data.frontmatter.modules.map(item=>{
            switch(item) {
                case 'React':
                return React
                case 'Component':
                return Component
                default:
                console.log(new Error('你在Demo中使用了自定义的组件，请自定义Content组件来完成渲染'))
                return null
            }
        })
        return (
            <div>
                <Markdown md={data} modules={modules}/>
            </div>
        );
    }
}

export default Content;