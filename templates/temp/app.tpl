import React from 'react';
import {
    Switch,
    HashRouter,
    Route,
    Redirect,
} from 'react-router-dom';
<%
`import Index from '${$data.modulesPathMap.Index}';`
%>
// 不存在$data.siteData.docs时，不需要引入
<%
$data.siteData.docs.length 
? (
    `import Content from '${$data.modulesPathMap.Content}';
    import Markdown from '${$data.modulesPathMap.Markdown}';`
)
: null;
%>
<%
[...$data.siteData.pages,...$data.siteData.docs].map((item,i)=>{
    const isDoc = item._type === 'doc';
    const moduleName = isDoc ? `Md${i}` : `Comp${i}`;
    return `import ${moduleName} from '${$data.resolvePath(item.filePath)}';`;
})
%>

export default function App() {
    return (
        <HashRouter>
            <Switch>
<%
[...$data.siteData.pages,...$data.siteData.docs].map((item,i)=>{
    const isDoc = item._type === 'doc';
    const moduleName = isDoc ? `Md${i}` : `Comp${i}`;
    return isDoc 
        ?`<Route path={'${item.path}'} render={()=><Content renderMarkdown={()=><Markdown md={${moduleName}}/>} data={${moduleName}}/>}  />`;
        : `<Route path={'${item.path}'} component={${moduleName}}/>`;
})
%>
                <Route path={'/index'} component={Index} /> {/* eslint-disable-line */}
                <Redirect from='*' to='/index' />
            </Switch>
        </HashRouter>
    );
}
