import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import marked from '../../marked'
import PropTypes from 'prop-types'
import CodeDemo from './code'
import './style.css'

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
            setTimeout(() => { this.renderDemo() })
        })
    }
    renderDemo() {

        this.props.md.demos.forEach(demo => {
            const Comp = demo.fn(...this.props.modules)
            const codeHtml = demo.code && marked(demo.code)
            const codeNoteHtml = codeHtml && marked(demo.codeNote) 
            ReactDOM.render(
                <CodeDemo
                    demoComp={<Comp />}
                    codeHtml={codeHtml}
                    codeNoteHtml = {codeNoteHtml}
                />,
                document.getElementById(demo.elId)
            )
        })
    }
    render() {
        return (
            <div
                className='markdown-content'
                dangerouslySetInnerHTML={{ __html: this.__html }}
            />
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