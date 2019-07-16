import React from 'react';
import {
    Switch,
    HashRouter,
    Route,
    Redirect,
} from 'react-router-dom';
import { isValidElementType } from 'react-is';
<%
[...$data.siteData.pages,...$data.siteData.docs].map((item,i)=>{
    const __DOC__ = item.type === 'doc';
    const moduleName = __DOC__ ? `Markdown${i}` : `Page${i}`;
    return `import ${moduleName} from '${item.filePath}';`;
})
%>
<%
$data.siteData.docs.length 
? `import getMarkdownRender from './markdown-render';`
: null
%>

export default function Routes() {
    return (
        <HashRouter>
            <Switch>
<%
[...$data.siteData.pages,...$data.siteData.docs].map((item,i)=>{
    const __DOC__ = item.type === 'doc';
    const moduleName = __DOC__ ? `Markdown${i}` : `Page${i}`;
    return __DOC__ 
        ?`                <Route exact path={'${item.routePath}'} render={getMarkdownRender(${moduleName})}  />`
        : `                { isValidElementType(${moduleName}) && <Route exact path={'${item.routePath}'} component={${moduleName}}/> }`;
})
%>
                <Redirect from='*' to='/index' />
            </Switch>
        </HashRouter>
    );
}
