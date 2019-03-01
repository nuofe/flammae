import React, { Component } from 'react';
import {
    Switch,
    HashRouter,
    Route,
    Redirect
} from 'react-router-dom';
import Index from './templates/home'
import Markdown from './templates/markdown';
import Comp0 from 'D:/Code/test/src/pages/one.jsx';
import Comp1 from 'D:/Code/test/src/pages/test.jsx';
import Md2 from 'D:/Code/test/src/docs/test.md';
/* import */

class App extends Component {
    
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path='/one' component={Comp0} />
<Route path='/test' component={Comp1} />
<Route path='/xx' render={()=><Markdown md={Md2}/>} />
{/* route */}
                    
                     <Route path={'/index'} component={Index}/>
                     <Redirect from='*' to='/index'/>
                </Switch>
            </HashRouter>
        );
    }
}

export default App;