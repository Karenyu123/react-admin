import React, { Component } from 'react'
import { Card, Button, Table, message, Icon, Modal } from 'antd'
import moment from 'moment'
import {
  reqUserList,
  reqDeleteUser,
  reqAddUpdateUser
} from '../../api'
import AddUpdateForm from './AddUpdateForm'
export default class User extends Component { 
  state = {
    users: [  ],
    roles: [],
    isShow: false,
    isUpdate: false,
    currentRole:{}
  }
  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话号码',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: text=><span>{moment(text).format('YYYY-MM-DD')}</span>
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: text => this.roleNames[text]
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => (<>
          <Button
            type="primary"
            size="small"
            ghost
            onClick={this.handleUpdate.bind(this,record)}
          >修改</Button>
          <Button
            type="danger"
            size="small"
            onClick={()=>this.handleDelete(record)}
            ghost
            style={ { marginLeft: 10 } }>删除</Button>
        </>)
      },
    ]
  }
  //删除用户
  handleDelete = (record) => {
    Modal.confirm({
      title: '提示',
      content: `确定要删除${record.username}吗？`,
      onOk:async() =>{
        const res = await reqDeleteUser(record._id)
        if (res.status === 0) {
          message.success('删除用户成功')
          this.getUsers()
        }
      },
    });
  }
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, item) => {
      pre[item._id] = item.name 
      return pre
    }, {})
    this.roleNames = roleNames
  }
  //获取user
  getUsers =async () => {
    const res = await reqUserList()
    if (res.status === 0) {
      const { roles, users } = res.data
      this.initRoleNames(roles)
      this.setState({
        roles,
        users
      })
    }
  }
  //打开更新对话框
  handleUpdate = (record) => {
    this.setState({
      isUpdate: true,
      isShow: true,
      currentRole: record
    })
  }
  //添加或更新用户
  addUpdateUser =() => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        let res,user
        if (!this.state.currentRole._id) {
          res = await reqAddUpdateUser(values)
        } else {
          user = { ...values, _id: this.state.currentRole._id }
          res = await reqAddUpdateUser(user)
        }
        this.form.resetFields()
       
        this.setState({
          isShow: false
        })
        if (res.status === 0) {
          const { role_id, username, _id } = JSON.parse(window.localStorage.getItem('user_key'))
          if (_id === this.state.currentRole._id) {
            if (role_id !== user.role_id || user.username !== username) {
              message.warning('用户信息已变更，请重新登录')
              window.localStorage.removeItem('user_key')
              this.props.history.replace('/login')       
            } else {
              message.success(`${this.state.currentRole._id?'修改':'添加'}用户成功`)
              this.getUsers()
            }
          }
          
        }
      }
    })
  }
  UNSAFE_componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getUsers()
    this.initRoleNames(this.state.roles)
  }
  render() {
    const { users, isShow, isUpdate, currentRole, roles } = this.state
    const title = <Button
      onClick={()=>this.setState({isShow: true})}
    ><Icon type="plus"></Icon>添加用户</Button>
    return (
      <>
        <Card title={title}>
          <Table
            dataSource={ users }
            columns={ this.columns }
            rowKey="_id"
            bordered
            pagination={
              {
                defaultPageSize: 2
              }
            }
          >
          </Table>
          <Modal
            title={isUpdate?'修改用户信息':'添加用户'}
            visible={isShow}
            onOk={this.addUpdateUser}
            onCancel={ () => {
              this.form.resetFields()
              this.setState({
                isShow: false,
                isUpdate: false,
                currentRole:{}
              })
            }}
          >
            <AddUpdateForm
              roles={roles}
              setForm={ form => this.form = form }
              currentRole={ currentRole } />
          </Modal>
        </Card>
      </>
    )
  }
}
