import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import marked from './marked'
import PropTypes from 'prop-types'


class Markdown extends Component {

    componentDidMount() {
        this.genHTML(this.props.md.text)
    }
    UNSAFE_componentWillReceiveProps(nextP) {
        if (this.props.md.text !== nextP.md.text) {
            this.genHTML(nextP.md.text)
        }
    }
    genHTML(str) {
        this.__html = marked(str)
        this.forceUpdate(() => {
            setTimeout(()=>{this.renderDemo()})
        })
    }
    renderDemo() {
        this.props.md.demos.forEach(demo=>{
            const Comp = demo.code(...this.props.modules)
            ReactDOM.render(<Comp/>, document.getElementById(demo.id))
        })
    }
    render() {
        return (
            <div className='markdown-content' dangerouslySetInnerHTML={{ __html: this.__html }}></div>
        );
    }
}


Markdown.propTypes = {
    md: PropTypes.shape({
        text: PropTypes.string,
        demos: PropTypes.array
    }).isRequired,
    modules: PropTypes.array
}

export default Markdown;