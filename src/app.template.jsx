import React, { Component } from 'react';
import {
    Switch,
    HashRouter,
    Route,
    Redirect
} from 'react-router-dom';
import Index from './templates/home'
import Markdown from './templates/markdown';
/* import */

class App extends Component {
    
    render() {
        return (
            <HashRouter>
                <Switch>
                    {/* route */}
                    
                     <Route path={'/index'} component={Index}/>
                     <Redirect from='*' to='/index'/>
                </Switch>
            </HashRouter>
        );
    }
}

export default App;