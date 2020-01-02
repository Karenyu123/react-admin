import React, { Component, createRef } from 'react'
import { Card, Form, Input, Icon, Cascader, Button, message } from 'antd'
import PicturesWall from './PicturesWall'
import TextEditor from './TextEditor'
import { reqCategorys, reqAddUpdate } from '../../api'
// import './product.css'
const { Item } = Form
const { TextArea } = Input 

@Form.create()
class ProductAddUpdate extends Component {
  constructor(props) {
    super(props)
    this.imgs = createRef()
    this.editor = createRef()
  }
  state = {
    options: []
  }

  initOptions = (categorys) => {
    const options = categorys.map(item => {
      return {
        value: item._id,
        label: item.name,
        isLeaf: false
      }
    })
    this.setState({
      options
    })
  }
  getOptions =async (parentId) => {
    const res = await reqCategorys(parentId)
    if (res.status === 0) {
      const categorys = res.data
      if (parentId === '0') {
        this.initOptions(categorys)
      } else {
        //如果是二级分类列表，则直接返回分类promise对象，在调用的时候获取这个对象
        return categorys  
      }
    }
  }
  loadData =async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true
    //获取二级分类的promise对象
    const subCategorys = await this.getOptions(targetOption.value)
    targetOption.loading = false
    //如果有二级分类，则重新返回一个数组给级联选择器
    if (subCategorys && subCategorys.length > 0) {
      const subOptions = subCategorys.map(item => ({
        value: item._id,
        label: item.name,
        isLeaf: true
      }))
      targetOption.children = subOptions
    }else {
      targetOption.isLeaf = true
    }
    this.setState({
      options: [...this.state.options]
    })
  }
  //检验价格输入是否合法
  priceValidate = (rule,value,callback) => {
    if (value && value * 1 > 0) {
      callback()
    } else {
      callback('商品价格必须大于0')
    }
  }

  //提交表单数据
  submit = () => {
    this.props.form.validateFields(async(err, values) => {
      if (!err) {
        const { name, desc, price, categoryIds } = values
        let categoryId, pCategoryId
        if (categoryIds && categoryIds.length === 1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const imgs = this.imgs.current.getImages()
        const detail = this.editor.current.getDetailText()
        const product = { name, desc, price, categoryId, pCategoryId, imgs, detail}
        if (this.isUpdate) {
          product._id = this.product._id
        }
        const res = await reqAddUpdate(product)
        if (res.status === 0) {
          message.success(`${this.isUpdate ? '修改' : '添加'}商品成功`)
          this.props.history.goBack()
        } else {
           message.error(`${this.isUpdate?'修改':'添加'}商品失败`)
        }
      }
    })
  }
  componentDidMount() {
    this.getOptions('0')
  }
  UNSAFE_componentWillMount() {
    const product = this.props.location.state
    this.isUpdate = !!product
    this.product = product || {}
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { isUpdate, product } = this
    const {
      name,
      desc,
      price,
      categoryId,
      pCategoryId,
      imgs,
      detail
    } = product
    const categoryIds = []
    if (pCategoryId !== '0') {
      categoryIds.push(pCategoryId)
      categoryIds.push(categoryId)
    } else {
      categoryIds.push(pCategoryId)
    }
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 11 }
    }
    const title = <span><Icon
      type="left"
      style={ { cursor: "pointer" } }
      onClick={this.props.history.goBack}
    ></Icon>&emsp;{isUpdate?'更新商品':'添加商品'}</span>
    return (
      <>
        <Card
        title={title}
        >
          < Form {
            ...formItemLayout
          } >
            <Item label="商品名称">
              {
                getFieldDecorator('name', {
                  initialValue: name,
                  rules:[{required:true, message: "请输入名称"}]
                })(
                  <Input placeholder="请输入商品名称"/>
                )
              }
            </Item>
             <Item label="商品描述">
              {
                getFieldDecorator('desc', {
                  initialValue: desc,
                  rules:[{required:true, message: "请输入商品描述"}]
                })(
                  <TextArea placeholder = "请输入商品描述" />
                )
              }
            </Item>
            <Item label="商品价格">
              {
                getFieldDecorator('price', {
                  initialValue: price,
                  rules: [
                    { required: true, message: "请输入商品价格" },
                    { validator: this.priceValidate }
                  ]
                })(
                  < Input type = "number"
                  placeholder = "请输入商品价格"
                  addonAfter = "元" />
                )
              }
            </Item>
            <Item label="商品分类">
               {
                getFieldDecorator('categoryIds', {
                  initialValue: categoryIds,
                  rules:[{required:true, message: "请输入商品价格"}]
                })(
                  <Cascader
                    placeholder="请选择分类"
                    options={ this.state.options }
                    loadData={ this.loadData }
                    onChange={ this.onChange }
                    changeOnSelect
                  />
                )
              }
            </Item>
            <Item label="商品图片">
              <PicturesWall ref={ this.imgs } imgs={ imgs }/>
            </Item>
            <Item label="商品详情" wrapperCol={{span:20}}>
              <TextEditor ref={this.editor} detail={detail}/>
            </Item>
            <Item label=" " labelCol={{span:4}} >
              <Button type="primary" ghost onClick={this.submit}>提交</Button>
            </Item>
          </Form>
        </Card>
      </>
    )
  }
}

export default ProductAddUpdate
