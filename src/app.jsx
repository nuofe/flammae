import React, { Component } from 'react';
import {
    Switch,
    HashRouter,
    Route,
    Link
} from 'react-router-dom'
import staticData from './static-data'
import Markdown from './templates/markdown'

class App extends Component {
    
    render() {
        return (
            <HashRouter>
                <Switch>
                    {
                        staticData.docs && staticData.docs.map(doc=>{
                            const md = require(`@app/docs/${doc.title.toLowerCase()}.md`).default
                            return <Route key={doc.path} path={doc.path} render={()=><Markdown md={md}/>}/>
                        })
                    }
                     <Route path={'/'} render={()=>{
                        return <Link to='/button'>Button</Link>
                    }}/>
                </Switch>
            </HashRouter>
        );
    }
}

export default App;