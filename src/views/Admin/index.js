import React, { Component } from 'react'
import {
  Redirect,
  Link,
  Switch,
  Route
} from 'react-router-dom'
import {
  Layout,
  Menu,
  Icon,
  Modal
} from 'antd';
import moment from 'moment'
import { connect } from 'react-redux'

import Role from '../Role'
import User from '../User'
import Category from '../Category'
import Bar from '../Charts/Bar'
import Pie from '../Charts/Pie'
import Line from '../Charts/Line'
import Home from '../Home'
import Product from '../Product'

import { setHeaders } from '../../redux/action'
import menuList from '../../config/menuConfig'
import './admin.css'
import Logo from '../../assets/logo03.png'
import duck from '../../assets/duck.gif'

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu
const mapState = state => ({ title: state.header })
const mapActions = { setHeaders }
@connect(mapState,mapActions)
class Admin extends Component {
  state = {
    timeNow: Date.now()
  }
  isAuth = (item) => {
    const user = JSON.parse(window.localStorage.getItem('user_key')||'{}')
    const { username, role } = user
    if (role) {
      const menus = role.menus
      if (username === 'admin' || item.isPublic || menus.indexOf(item.key) !== -1) {
        return true
      } else if (item.children) {
        return !!item.children.find(item => menus.indexOf(item.key) !== -1)
      } else {
        return false
      }
    }
    
  }
  // 遍历菜单
  menuMap = (menuList) => {
    const path = this.props.location.pathname
    return menuList.map(item => {
      if (!this.isAuth(item)) return false
      if (path.indexOf(item.key) !== -1) {
        this.props.setHeaders(item.title)
      }
      if (!item.children) {
        return (
          <Menu.Item key={ item.key }>
            <Link to={ item.key } onClick={()=>this.props.setHeaders(item.title)}>
              <Icon type={ item.icon } />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      } else {
        const cItem = item.children.find(item => path.indexOf(item.key) !== -1)
        if (cItem) {
          this.navKey = item.key
        }
        return (
          <SubMenu
            className="sub-menu"
            key={ item.key }
            title={
              <span>
                <Icon type={ item.icon } />
                <span>{ item.title}</span>
              </span>
            }
          >
           { this.menuMap(item.children)}
          </SubMenu>
        )
      }
    })
  }
  // 获取时间
  getTime = () => {
    this.timer=setInterval(() => {
      const timeNow = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
      this.setState({
        timeNow
      })
    }, 1000);
  }
 // 获取title
  getTitle = () => {
    let title
    const path = this.props.location.pathname
    menuList.forEach(item => {
      if (path.indexOf(item.key) !==-1) {
        title = item.title
      } else if(item.children){
        const cItem = item.children.find(cItem => path.indexOf(cItem.key) !== -1)
        if (cItem) {
        title = cItem.title
        }
      }
    })
    return title
  }
  // 退出登录
  logout = () => {
    Modal.confirm({
      title: '提示',
      content: '是否退出登录？',
      onOk:()=> {
        window.localStorage.removeItem('user_key')
      }
     })
  }
  componentDidMount() {
    this.getTime()
  }
  UNSAFE_componentWillMount() {
  this.menuNodes = this.menuMap(menuList)
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }
  render() {
    const username = JSON.parse(window.localStorage.getItem('user_key')||'{}').username
    if (!username) {
      return <Redirect to='/login'/>
    }
    let currentPath = this.props.location.pathname
    if (currentPath.indexOf('/product') !== -1) {
      currentPath = '/admin/product'
    }
    // const title = this.getTitle()
    const title = this.props.title
    return (
      <>
        <Layout className="admin-container">
          <Header className="header">
            <Link to='/admin/home'>
              <img src={ Logo } alt="logo" />
            </Link>
            <div className="title">
              <span >{title}</span>
            </div>
            <div className="dayWheather">
              <span>{ this.state.timeNow }</span>
            </div>
            <div className="user-box">
              <img src={duck} alt=""/>
              <span>您好，</span>
              <span style={{marginRight:"10px",fontSize:"20px",fontWeight:700}}>{ username }</span>
              <span style={{color:"#ccc",cursor:"pointer"}} onClick={this.logout}>退出</span>
            </div>
          </Header>
          <Layout>
            <Sider className="left-nav">
              <Menu
                className="menu"
                selectedKeys={ [currentPath] }
                defaultOpenKeys={[this.navKey]}
                mode="inline"
                theme="light"
              >
                { this.menuNodes }
              </Menu>
            </Sider>
            <Content className="content">
              <Switch>
                <Route path='/admin/home' component={Home}></Route>
                <Route path='/admin/role' component={Role}></Route>
                <Route path='/admin/product' component={Product}></Route>
                <Route path='/admin/category' component={Category}></Route>
                <Route path='/admin/user' component={User}></Route>
                <Route path='/admin/charts/bar' component={Bar}></Route>
                <Route path='/admin/charts/line' component={Line}></Route>
                <Route path='/admin/charts/pie' component={ Pie }></Route>
                <Redirect to='/admin/home' from='/admin' exact />
                <Redirect to='/notfound'/>
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </>
    )
  }
}

export default Admin
