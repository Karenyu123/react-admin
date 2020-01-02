import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Card,
  Form,
  Icon,
  Input,
  Button,
  message
} from 'antd'

import { login,logout } from '../../redux/action'
import Logo from '../../assets/logo05.png'
import './login.css' 
import { reqLogin } from '../../api'

const mapState = state => ({ user: state.user })
const mapAcitons = { login, logout }
@connect(mapState, mapAcitons)
@Form.create()
class Login extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { username, password } =values
          const res = await reqLogin(username, password)
        if (res.status === 0) {
          message.success('登录成功')
          window.localStorage.setItem('user_key',JSON.stringify(res.data))
          this.props.history.replace('/admin/home')
        } else {
          message.error('用户名或密码不正确')
          }
      }
    })
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     const { username, password } = values
    //     this.props.login(username, password)
    //     const { _id } = this.props.user
    //     console.log(_id)
    //     if (!!_id) {
    //       message.success('登录成功')
    //       this.props.history.replace('/admin/home')
    //     } else if (this.props.user.errMsg) {
    //       message.error(this.props.user.errMsg)
    //     }
    //   }
    // })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const user = JSON.parse(window.localStorage.getItem('user_key')||'{}')
    if (user&&user._id) {
      return <Redirect to='/' />
    }
    return (
      <div className="login-page">
        <header><img className="logo" src={ Logo } alt="logo" /></header>
        <Card className="login-box">
          <h2>请先登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true,whitespace: true, message: '请输入用户名！' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码！' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                />,
              )}
            </Form.Item>
            <Form.Item>
              < Button style = {
                {
                  width: '100%',
                  backgroundColor: "#839BC9",
                  border: "none"
                }
              }
              type = "primary"
              htmlType = "submit"
              className = "login-form-button" >
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
}

export default Login