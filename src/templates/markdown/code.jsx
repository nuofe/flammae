import React, { Component } from 'react';

class CodeDemo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showCode: false
        }
        this.toggle = this.toggle.bind(this)
    }
    toggle() {
        this.setState({
            showCode: !this.state.showCode
        })
    }
    render() {
        const show = this.state.showCode
        return (
            <React.Fragment>
                <div className='code-demo'>
                    {this.props.demoComp}
                </div>
                <div className='code-text-wrapper'>
                    {
                        show && <div className='code-text' dangerouslySetInnerHTML={{ __html: this.props.codeHtml }}></div>
                    }
                    <div className='toggle-btn' onClick={this.toggle}>
                        {show ? '隐藏代码' : '显示代码'}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default CodeDemo;