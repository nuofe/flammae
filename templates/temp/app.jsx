import React from 'react';
import {
    Switch,
    HashRouter,
    Route,
    Redirect,
} from 'react-router-dom';
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
