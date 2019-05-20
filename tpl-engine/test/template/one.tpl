import React from 'react';
import {
    Switch,
    HashRouter,
    Route,
    Redirect,
} from 'react-router-dom';

<%
$data.map(item=>(
    item.name
    ?`import ${item.name} from '${item.path}';`
    : `import '${item.path}';`
))
%>

export default function App() {
    return (
        <HashRouter>
            <Switch>
<% 
$data.map(item=>(
    item.name
    ? `<Route path={'${item.path}'} component={${item.name}}/>`
    : null
)).filter(Boolean)
%>
                <Route path={'/index'} component={Index} />
                <Redirect from='*' to='/index' />
            </Switch>
        </HashRouter>
    );
}
