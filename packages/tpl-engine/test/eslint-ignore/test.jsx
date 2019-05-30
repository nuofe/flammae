/* eslint-disable */
import React from 'react';
import {
    Switch,
    HashRouter,
    Route,
    Redirect,
} from 'react-router-dom';

import MD1 from '../MD1';
import Comp1 from '../Comp1';
import '../Style1';

export default function App() {
    return (
        <HashRouter>
            <Switch>
                <Route path={'../MD1'} component={MD1} />
                <Route path={'../Comp1'} component={Comp1} />
                <Route path={'/index'} component={Index} />
                <Redirect from='*' to='/index' />
            </Switch>
        </HashRouter>
    );
}
