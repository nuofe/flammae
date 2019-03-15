import React, { Component } from 'react';
import marked from '../../marked'
import PropTypes from 'prop-types'
import jsxRender from './plugin-render'
const renderMap = {}

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
            if (demo.isStyle) {
                demo.fn()
                return
            }
            const codeHtml = demo.code && marked(demo.code)
            const codeNoteHtml = codeHtml && marked(demo.codeNote)
            let render = () => { }
            if (demo.lang === 'jsx') {
                render = jsxRender
            } else {
                render = renderMap[demo.lang]
            }
            render && render({
                modules: this.props.modules,
                codeHtml,
                codeNoteHtml,
                loader: demo.loader
            })
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