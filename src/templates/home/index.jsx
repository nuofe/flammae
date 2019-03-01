import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import staticData from '../../static-data'
import './style.css'
class Index extends Component {
    render() {
        return (
            <div>
                <h1>页面：</h1>
                <div className='page-routers'>
                    {
                        staticData.pages.map(page => (
                            <Link
                                className='route-link'
                                key={page.path}
                                to={page.path} >
                                {page.path}
                            </Link>
                        ))
                    }
                </div>
                <h1>文档：</h1>
                <div className='page-routers'>
                    {
                        staticData.docs.map(page => (
                            <Link
                                className='route-link'
                                key={page.path}
                                to={page.path} >
                                {page.path}
                            </Link>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default Index;