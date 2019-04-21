import React, { Component } from 'react';
import {
    Switch,
    HashRouter,
    Route,
    Redirect
} from 'react-router-dom';
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