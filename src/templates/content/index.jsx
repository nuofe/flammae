import React, { Component } from 'react';
import Markdown from '../markdown'

class Content extends Component {
    render() {
        return (
            <div className='container'>
                <Markdown md={this.props.data}/>
            </div>
        );
    }
}

export default Content;