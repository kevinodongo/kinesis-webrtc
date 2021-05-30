import * as React from 'react'
import { Switch, Route } from "react-router-dom"
import Home from './Home'
import Session from "./Session"

function App() {
    return (
        <Switch>
            <Route path="/" exact component={Home}></Route>
            <Route path="/:id" component={Session}></Route>
        </Switch>
    )
}

export default App
