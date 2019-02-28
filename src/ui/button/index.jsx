import React, { Component } from 'react';
import './style.scss'
import cn from 'classnames'

class Button extends Component {
    render() {
        const { htmlType, children, className, type, size, ...rest } = this.props
        return (
            <button
                {...rest}
                type={htmlType || 'button'}
                className={cn('n-btn',className, type && `_${type}`, size && `_${size}`)}
            >{children}</button>
        );
    }
}

export default Button;