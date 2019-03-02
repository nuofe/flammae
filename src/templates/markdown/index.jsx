import React, { Component } from 'react';
import marked from 'marked'
import renderer from './config'
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
        this.__html = marked(str, {
            renderer: renderer
        })
        this.forceUpdate()
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
        frontmatter: PropTypes.object,
        codeSplit: PropTypes.array,
        headings: PropTypes.array
    }).isRequired
}

export default Markdown;