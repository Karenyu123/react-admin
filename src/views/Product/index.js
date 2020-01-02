import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import ProductHome from './ProductHome'
import ProductAddUpdate from './ProductAddUpdate'
import ProductDetails from './ProductDetails'

export default class Product extends Component {
  render() {
    return (
      <>
        <Switch>
          <Route path='/admin/product' component={ProductHome} exact></Route>
          <Route path='/admin/product/addupdate' component={ProductAddUpdate}></Route>
          <Route path='/admin/product/details' component={ ProductDetails }></Route>
          <Redirect to='/notfound'/>
        </Switch>
      </>
    )
  }
}
