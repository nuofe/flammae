import React, { Component } from 'react';
import PropTypes from 'prop-types';
import marked from './marked';
import jsxRender from '../../packages/flammae-jsx-plugin/render'; /* eslint-disable-line */
import './markdown.less';

const renderMap = {};

class Markdown extends Component {
    state = {
        opacity: 0,
    }

    componentDidMount() {
        this.genHTML(this.props.md.text);
    }

    componentDidUpdate(prevProps) {
        if (this.props.md !== prevProps.md) {
            this.genHTML(this.props.md.text);
        }
    }

    /**
     * 根据markdown文本生成html，待更新后渲染demo
     * @param {string} str
     */
    genHTML(str) {
        // 解析markdown
        this.html = marked(str);
        // 执行demo
        this.forceUpdate(() => {
            this.renderDemo();
            this.setState({ opacity: 1 });
        });
    }

    /**
     * 渲染demo
     */
    renderDemo() {
        this.props.md.demos.forEach((demo) => {
            /**
             * markdown style
             */
            if (demo.isStyle) {
                demo.fn();
                return;
            }

            /**
             * 匹配正确的语言render
             */
            const codeHtml = demo.code && marked(demo.code);
            const codeNoteHtml = codeHtml && marked(demo.codeNote);
            let render = null;
            if (demo.lang === 'jsx') {
                render = jsxRender;
            } else {
                render = renderMap[demo.lang];
            }

            /**
             * 动态渲染代码块
             */
            if (render) {
                render({
                    codeHtml,
                    codeNoteHtml,
                    loader: demo.loader,
                });
            }
        });
    }

    render() {
        return (
            <div
                className='markdown-content'
                dangerouslySetInnerHTML={{ __html: this.html }}
                style={{ opacity: this.state.opacity }}
            />
        );
    }
}


Markdown.propTypes = {
    md: PropTypes.shape({
        text: PropTypes.string,
        demos: PropTypes.array,
    }).isRequired,
};

export default Markdown;
