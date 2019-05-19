/* eslint-disable */
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
    ?`import ${item.name} from ${item.path};`
    : `import ${item.path};`
));

%>
/* import */

export default function App() {
    return (
        <HashRouter>
            <Switch>
                {/* route */}

                <Route path={'/index'} component={Index} /> {/* eslint-disable-line */}
                <Redirect from='*' to='/index' />
            </Switch>
        </HashRouter>
    );
}
