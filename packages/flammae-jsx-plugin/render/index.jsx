import React from 'react';
import ReactDOM from 'react-dom'
import CodeDemo from './code'


export default function ({ codeHtml, codeNoteHtml, loader }) {
    const Comp = loader.fn()
    ReactDOM.render(
        <CodeDemo
            demoComp={<Comp />}
            codeHtml={codeHtml}
            codeNoteHtml={codeNoteHtml}
        />,
        document.getElementById(loader.elId)
    )
}