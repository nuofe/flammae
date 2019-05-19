/*
 * @Author: L.S
 * @Email: fitz-i@foxmail.com
 * @Description:
 * @Date: 2019-03-18 09:09:36
 * @LastEditTime: 2019-04-16 10:33:35
 */

import React from 'react';
import ReactDOM from 'react-dom';
import CodeDemo from './code.jsx';


export default function ({ codeHtml, codeNoteHtml, loader }) {
    const Comp = loader.fn();
    ReactDOM.render(
        <CodeDemo
            demoComp={<Comp />}
            codeHtml={codeHtml}
            codeNoteHtml={codeNoteHtml}
        />,
        document.getElementById(loader.elId),
    );
}
