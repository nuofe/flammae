import React from 'react';
import { Switch, HashRouter, Route, Redirect } from 'react-router-dom';
import routes from './routes-data';

export default function App() {
    return (
        <HashRouter>
            <Switch>
                {routes.map(route => (
                    <Route
                        exact
                        path={route.path}
                        component={route.component}
                    />
                ))}
                <Redirect from="*" to="/index" />
            </Switch>
        </HashRouter>
    );
}
