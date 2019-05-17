/*
 * @Author: L.S
 * @Email: fitz-i@foxmail.com
 * @Description:
 * @Date: 2019-03-18 09:09:36
 * @LastEditTime: 2019-04-16 10:33:30
 */

import React, { Component } from 'react';
import './style.css';

class CodeDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCode: false,
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            showCode: !this.state.showCode,
        });
    }

    render() {
        const show = this.state.showCode;
        const codeNote = this.props.codeNoteHtml;
        return (
            <React.Fragment>
                <div className='code-running-demo'>
                    {this.props.demoComp}
                </div>
                {
                    this.props.codeHtml && (
                        <div className={`code-text-demo-wrapper${show ? ' _active' : ''}`}>
                            {
                                show && (
                                    <React.Fragment>
                                        {
                                            codeNote && (
                                                <div className='code-text-demo-note'
                                                    dangerouslySetInnerHTML={{ __html: codeNote }}>
                                                </div>
                                            )
                                        }
                                        <div className='code-text-demo'
                                            dangerouslySetInnerHTML={{ __html: this.props.codeHtml }}>
                                        </div>
                                    </React.Fragment>
                                )
                            }
                            <div className='toggle-btn-wrapper' >
                                <span className='toggle-btn' onClick={this.toggle}>{show ? '隐藏代码' : '显示代码'}</span>
                            </div>
                        </div>
                    )
                }

            </React.Fragment>
        );
    }
}

export default CodeDemo;
