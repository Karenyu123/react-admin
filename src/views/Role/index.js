import React, { PureComponent } from 'react'
import moment from 'moment'
import { Card, Table, Button, Modal, Form, Input, message, Tree } from 'antd'

import { reqAddRole, reqRoles, reqUpdateRole } from '../../api'
import menuList from '../../config/menuConfig'
const { TreeNode } = Tree
const { Item } = Form
@Form.create()
class Role extends PureComponent {
  state = {
    roles: [],
    role: {},
    visible: false,
    isAuth: false,
    checkedKeys: []
  }
  initColumns = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (text, record) => (<span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>)
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render:(text, record) => record.menus.length>0?<span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>:null
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      }
    ]
  }
  getRoles = async () => {
    const res = await reqRoles()
    if (res.status === 0) {
      this.setState({
        roles: res.data
      })
    }
  }
  onRow = (record) => {
    return {
      onClick: () => {
        this.setState({
          role: record,
          checkedKeys: record.menus
        })
        
      }
    }
  }
  showAddRoleModal = () => {
    this.setState({
      visible: true
    })
  }
  //添加角色
  handleOk = () => {
    this.props.form.validateFields(async (err, values) => {
      const { roleName } = values
      this.props.form.resetFields()
      if (!err) {
        const res = await reqAddRole(roleName)
        console.log(res)
        if (res.status === 0) {
          message.success('添加角色成功')
          this.setState(state => ({
            roles: [...state.roles, res.data]
          }))
        } else {
          message.error('添加角色失败')
        }
      }
    })
    this.setState({
      visible: false
    })
  }
  // 初始角色列表
  initTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(<TreeNode title={ item.title } key={ item.key } >
        {item.children ? this.initTreeNodes(item.children) : null}
      </TreeNode>)
      return pre
    },[])
  }
  //选中权限时触发
  handleTreeCheck = (checkedKeys) => {
    this.setState({
      checkedKeys
    })
  }
  // 更新设置角色权限
  getUpdateRole =async (role) => {
    const res = await reqUpdateRole(role)
    console.log(role)
    if (res.status === 0) {
      const { role_id } = JSON.parse(window.localStorage.getItem('user_key'))
      //如果更新的是当前用户的角色权限，则需要退出，重新登录
      if (role_id === role._id) {
        message.warning('用户信息已变更，请重新登录')
        window.localStorage.removeItem('user_key')
        this.props.history.replace('/login')
      } else {
        this.setState({
          roles: [...this.state.roles],
        })
        message.success('设置权限成功')
      }  
    } else {
      message.error('设置权限失败')
    }
  }
  //提交设置权限，关闭对话框
  handleAuthOk = () => {
    const { role, checkedKeys } = this.state
    role.menus = checkedKeys
    this.getUpdateRole(role)
    this.setState({
      isAuth: false
    })
  }
  UNSAFE_componentWillMount() {
    this.initColumns()
    this.initTree = this.initTreeNodes(menuList)
  }
  componentDidMount() {
    this.getRoles()
  }
  render() {
    const { roles, role, checkedKeys } = this.state
    const { getFieldDecorator } = this.props.form
    const title = (
      <div>
        <Button type="primary" ghost style={{marginRight:20}} onClick={this.showAddRoleModal}>创建角色</Button>
        <Button type="primary" ghost onClick={()=>this.setState({isAuth:true})} disabled={!role._id}>设置角色权限</Button>
      </div>
    )
    return (
      <>
        <Card title={title} >
          <Table
            rowKey="_id"
            dataSource={ roles }
            columns={ this.columns }
            bordered
            rowSelection={ {
              type: 'radio',
              selectedRowKeys: [role._id],
              //选择单选按钮的时候触发
              onSelect: record => this.setState({
                role: record,
                checkedKeys: record.menus
              })
            }}
            onRow={ this.onRow }
            pagination={ {
              showQuickJumper: true,
              defaultPageSize: 3,
            }}
          >
          
          </Table>
          <Modal
            title="添加角色"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={ () => {
              this.props.form.resetFields()
              this.setState({
                visible: false
              })
            }}
          >
            <Form>
              <Item label="添加角色" labelCol={{span:4}} wrapperCol={{span:12}}>
                {
                  getFieldDecorator('roleName', {
                    rules:[{required:true, message: "请输入角色名称"}]
                  })(
                    <Input placeholder="请输入角色名称"/>
                  )
                }
              </Item>
            </Form>
          </Modal>
          <Modal
            title="设置角色权限"
            visible={this.state.isAuth}
            onOk={this.handleAuthOk}
            onCancel={ () => {
              this.props.form.resetFields()
              this.setState({
                checkedKeys: [],
                isAuth: false
              })
            }}
          >
            <Item label="角色名称" labelCol={{span:4}} wrapperCol={{span:12}}>
              <Input placeholder={role.name} disabled />
              <Tree
                checkable
                multiple
                defaultExpandAll={ true }
                onCheck={this.handleTreeCheck}
                checkedKeys={ checkedKeys }
              >
                <TreeNode title="平台权限" key="all">
                  {this.initTree}
                </TreeNode>
              </Tree>
            </Item>
          </Modal>
        </Card>
      </>
    )
  }
}

export default Role