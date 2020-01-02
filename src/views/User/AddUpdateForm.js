import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'
const { Item } = Form
const { Option } = Select
@Form.create()
class AddUpdateForm extends Component {
  static propTypes = {
    currentRole: PropTypes.object,
    setForm: PropTypes.func,
    roles: PropTypes.array.isRequired
  }
  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form)
  }
  componentDidMount() {
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { currentRole,roles } = this.props
    // console.log(currentRole)
    const { username,phone,email,role_id } = currentRole
    const formLayout = {
      labelCol: {
        span:4
      },
      wrapperCol: {
        span:16
      }
    }
    return (
      <>
        <Form {...formLayout}>
          <Item label="用户名">
            {
              getFieldDecorator('username', {
                initialValue: username,
                rules:[{required:true, message: "请输入名称"}]
              })(
                <Input placeholder="请输入用户名"/>
              )
            }
          </Item>
          {
            role_id ? null :
              <Item label="密码">
                {
                  getFieldDecorator('password', {
                    rules:[{required:true, message: "请输入密码"}]
                  })(
                    <Input type="password" placeholder="请输入密码"/>
                  )
                }
              </Item>
          }
          <Item label="电话号码">
            {
              getFieldDecorator('phone', {
                initialValue: phone,
                rules:[{required:true, message: "请输入电话号码"}]
              })(
                <Input placeholder="请输入电话号码"/>
              )
            }
          </Item>
          <Item label="邮箱">
            {
              getFieldDecorator('email', {
                initialValue: email,
                rules:[{required:true, message: "请输入邮箱地址"}]
              })(
                <Input placeholder="请输入邮箱地址"/>
              )
            }
          </Item>
          <Item label="角色">
            {
              getFieldDecorator('role_id', {
                initialValue: role_id //如果有值会自动跟下面的选项匹配
              })(
                <Select>
                  {
                    roles.map(item => (
                      <Option key={ item._id } value={ item._id }>{ item.name }</Option>))
                  }
                </Select>
              )
            }
          </Item>
        </Form>
      </>
    )
  }
}
export default AddUpdateForm