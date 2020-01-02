import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'
const { Item } = Form
const { Option } = Select
@Form.create()
class AddForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
    parentId: PropTypes.string.isRequired,
    categorys:PropTypes.array.isRequired
  }
  componentDidMount() {
    this.props.setForm(this.props.form)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { parentId, categorys } = this.props
    return (
      <>
        <Form>
          <Item>
            {
              getFieldDecorator(
                'parentId',
                {
                  initialValue: parentId
                }
              )(
                <Select>
                  <Option value='0'>一级分类</Option>
                  {
                    categorys.map(item => {
                      return (
                        <Option key={item._id} value={item._id}>{item.name}</Option>
                      )
                    })
                  }
                </Select>
              )
            }
          </Item>
          <Item>
            {
              getFieldDecorator(
                'categoryName',
                {
                  rules: [{
                    required: true,
                    message: '请输入分类名称!',
                  }]
                }
              )(
                <Input placeholder="请输入分类名称"></Input>
              )
            }
          </Item>
        </Form>
      </>
    )
  }
}
export default AddForm