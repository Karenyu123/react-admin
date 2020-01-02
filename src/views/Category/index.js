import React, { Component } from 'react'
import {
  Card,
  Table,
  Button,
  Icon,
  Divider,
  Modal,
  message
} from 'antd'
import { AddForm, UpdateForm } from '../../components'
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api'

export default class Category extends Component {
  state = {
    categorys: [],
    loading: false,
    parentId: '0',
    parentName: '',
    subCategorys: [],
    showStatus: 0
  }
  // 获取一级分类数据
  getCategorys = async (parentId) => {
    this.setState({
      loading: true
    })
    const parentid = parentId || this.state.parentId
    const { status, data } = await reqCategorys(parentid)
    if (status === 0) {
      if (parentid === '0') {
        this.setState({
          categorys: data,
          loading: false
        })
      } else {
         this.setState({
          subCategorys: data,
          loading: false
        })
      }
    }
  }
  //获取子分类
  getSubCategorys = (record) => {
    this.setState({
      parentId: record._id,
      parentName: record.name
    }, () => {
        this.getCategorys()
    })
  }
  //返回一级分类列表
  showCategorys = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }
  // 初始列表项的配置
  initColumns = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
        width:'70%',
        render: text => <span>{text}</span>,
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button
              onClick={this.showUpdateCategorys.bind(this,record)}
              style={ { color: '#839BC9', borderColor: "#839BC9" } } size="small" ghost>修改分类</Button>
            
            {
              this.state.parentId === '0' ?
                (
                <>
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    size="small"
                    ghost
                    onClick={this.getSubCategorys.bind(this,record)}
                  >查看子分类</Button>
                </>
                ):null
            }
          </span>
        ),
      },
    ];
  }
  //关闭对话框
  handleCancel = () => {
    //关闭对话框前重置所有对话框
    this.form.resetFields()
    this.setState({
      showStatus: 0
    })
  } 
  //显示添加分类对话框
  showAdd = () => {
    this.setState({
      showStatus: 1
    })
  }
  // 添加分类
  addCategorys =  () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
         //关闭对话框
        this.setState({
          showStatus: 0
        })
         // 调用接口修改
        const {
          parentId,
          categoryName
         } = values
        this.form.resetFields()
        const res = await reqAddCategory(parentId, categoryName)
        if (res.status === 0) {
          message.success('添加分类成功')
           // 如果在同级别的分类添加同级别分类，重新获取数据
          if (parentId === this.state.parentId) {
            this.getCategorys()
          } else if (parentId === '0') {
             // 如果在子分类中给一级分类添加分类，则只重新获取一级分类的数据
            this.getCategorys('0')
           }
         }
      }
    })
  }
  //显示修改分类对话框
  showUpdateCategorys = (record) => {
    // 保存被点击单元行的值
    this.record = record
    this.setState({
      showStatus: 2
    })
  }
  //修改分类
  updateCategorys = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        //隐藏对话框
        this.setState({
          showStatus: 0,
        })
        //修改分类
        const categoryId = this.record._id
        //修改后的分类名
        const  {categoryName}= values
        const res = await reqUpdateCategory(categoryId, categoryName)
        if (res.status === 0) {
          message.success('修改分类成功')
        } else {
          message.error('修改分类失败，请稍后再试')
        }
        //重置表单
        this.form.resetFields()
        //修改成功之后，重新请求数据
        this.getCategorys()
      }
    })
  }
  UNSAFE_componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getCategorys()
  }
  render() {
    const { categorys, loading, subCategorys, parentId, parentName, showStatus } = this.state
    const title = parentId === '0' ? '一级分类列表' :
      (<>
        <span
          style={{color:'#1890FF',cursor: 'pointer'}}
          onClick={ this.showCategorys }>一级分类列表</span>
        &nbsp;/&nbsp;
        <span>{ parentName }</span></>)
    const record = this.record || {}
    return (
      <>
        <Card
          title={title}
          extra={
            <Button
              onClick={this.showAdd}
            ><Icon type="plus"></Icon>添加分类</Button> }>
          <Table
            loading={ loading }
            dataSource={parentId === '0'? categorys : subCategorys }
            columns={ this.columns }
            bordered={ true }  
            rowKey="_id"
            pagination = {
              {
                pageSize: 5,
                pageSizeOptions: ['5', '10'],
                showQuickJumper: true,
              }
            }
          >       
          </Table>
          <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategorys}
          onCancel={this.handleCancel}
        >
            <AddForm
              parentId={ parentId }
              categorys={ categorys }
              setForm = {
                (form) => this.form = form
              }
            />
          </Modal>
          <Modal
          title="修改分类"
          visible={showStatus === 2}
          onOk={this.updateCategorys}
          onCancel={this.handleCancel}
        >
          <UpdateForm categoryName={record.name} setForm={(form)=>this.form=form}/>
          </Modal>
        </Card>
        
      </>
    )
  }
}
