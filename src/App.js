import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import Admin from './views/Admin'
import Login from './views/Login'
import NotFound from './views/NotFound'

export default class App extends Component {
  render() {
    return (
      <>
        <Router>
          <Switch>
            <Route path='/login' component={Login}></Route>
            <Route path='/admin' component={ Admin }></Route>
            <Route path='/notfound' component={ NotFound }></Route>
            <Redirect to='/admin' from='/' exact />
            <Redirect to='/notfound'/>
          </Switch>
        </Router>
      </>
    )
  }
}

