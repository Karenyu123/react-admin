import React, { Component } from 'react'
import { Card, Select, Input, Button, Icon, Table, message } from 'antd'

import { reqProducts,reqSearchProducts,reqUpdateStatus } from '../../api'
import commentName from '../../config/commenName'
const { Option } = Select
export default class ProductHome extends Component {
  state = {
    total: 0,
    pruducts: [],
    loading: false,
    searchName: '',
    searchType: 'productName'
  }
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        render: text => <span>{text}</span>,
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        render: text => <span>{text}</span>,
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: text => <span>￥{text}</span>,
      },
       {
         title: '状态',
         dataIndex: 'status',
         key: 'status',
         width: 100,
         render: (text, record) =>
         {
           const { status, _id } = record
           return  (<>
            <span>{status===1?'在售中':'已下架'}</span>
              <Button
               style={ { color: '#839BC9', borderColor: "#839BC9", marginTop: "6px" } } size="small" ghost
                onClick={()=>this.updateStatus(_id,status===1?2:1)}
             >{ status === 1 ? '下架' : '上架' }
             </Button>
            </>)
          }
      },
      {
        title: '操作',
        key: 'action',
        width: 100,
        render: (text, record) => (
          <span>
            <Button
              style={ { color: '#839BC9', borderColor: "#839BC9", marginBottom: "6px"} }
              size="small"
              ghost
              onClick={()=>this.props.history.push('/admin/product/details',{record})}
            >详情</Button>
                 
                  <Button
                    type="primary"
                    size="small"
                    onClick={()=>this.props.history.push('/admin/product/addupdate',record)}
                    ghost
                  >修改</Button>
          </span>
        )
      }
    ]
  }
  getProducts = async (pageNum) => {
    this.pageNum = pageNum
     this.setState({
       loading: true
     })
    const { searchName, searchType } = this.state
    let res
    if (searchName) {
      res =await reqSearchProducts(pageNum, commentName.PAGESIZE,searchName,searchType)
    } else {
      res = await reqProducts(pageNum, commentName.PAGESIZE)
    }
    this.setState({loading: false})
    if (res.status === 0) {
      const { total, list } = res.data
      this.setState({
        total,
        products: list 
      })
    }
  }
  //更新商品状态
  updateStatus = async (status,productId) => {
    const res = await reqUpdateStatus(status, productId)
    if (res.status === 0) {
      message.success('更新状态成功')
      this.getProducts(this.pageNum)
    } else {
      message.error(res.msg)
    }
  }
  UNSAFE_componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getProducts(1)
  }
  render() {
    const { products, total, loading, searchName, searchType } = this.state
    const extra = (<Button
      onClick={ () => this.props.history.push('/admin/product/addupdate') }>
      <Icon type="plus"></Icon>添加商品</Button>)
    const title = (<div>
      <Select value={searchType} onChange={e=>this.setState({searchType:e})} >
        <Option value="productName">按名称搜索</Option>
        < Option value ="productDesc" > 按描述搜索 </Option>
      </Select>
      <Input
        placeholder='请输入搜索关键字'
        value={searchName}
        style={ { width: 180, marginLeft: "10px" } }
        onChange = {
          e => this.setState({
            searchName: e.currentTarget.value
          })
        }
      />
      <Button type="primary" onClick={() => this.getProducts(1)} ghost>搜索</Button>
    </div>)
    return (
      <>
        <Card title={title} extra={extra}>
          <Table
            loading= {loading}
            dataSource={ products }
            columns={ this.columns }
            rowKey='_id'
            pagination={
              {
                current: this.pageNum,
                total,
                showQuickJumper: true,
                defaultPageSize: commentName.PAGESIZE,
                onChange:this.getProducts
              }
            }
          >
            
          </Table>
        </Card>
        
      </>
    )
  }
}
