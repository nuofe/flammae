import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {siteData} from 'flammae'
import './style.css'

const pages = siteData.pages
const docs = siteData.docs

function Content() {
    return (
        <div>
            <h1>页面：</h1>
            <div className='page-routers'>
                {
                    pages.length ? pages.map(page => (
                        <Link
                            className='route-link'
                            key={page.path}
                            to={page.path} >
                            {page.path}
                        </Link>
                    ))
                        : <p>未查找到页面</p>
                }
            </div>
            <h1>文档：</h1>
            <div className='page-routers'>
                {
                    docs.length ? docs.map(page => (
                        <Link
                            className='route-link'
                            key={page.path}
                            to={page.path} >
                            {page.path}
                        </Link>
                    ))
                        : <p>未查找到文档</p>
                }
            </div>
        </div>
    )
}

function Empty() {
    return (
        <div className='jumbotron'>
            <div className='dir-emtpy-tip'>
                <p>
                    flame 依赖<span className='_yellow'>src/docs</span>文件夹下的markdown文件（以<span className='_yellow'>.md</span>做后缀的文件），
            </p>
                <p>
                    或<span className='_yellow'>src/pages</span>文件夹下的jsx文件（以 <span className='_yellow'>.jsx</span>做后缀的文件）以生成页面，
            </p>
                <p>
                    请确保至少有一个上述文件夹存在，且文件夹内部存在有效文件。
            </p>
            </div>
        </div>

    )
}

class Index extends Component {
    render() {
        return (
            (pages.length || docs.length)
                ? <Content />
                : <Empty />
        );
    }
}

export default Index;