import React, { Component } from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'
const { Item } = Form

@Form.create()
class UpdateForm extends Component {
  static propTypes = {
    categoryName: PropTypes.string.isRequired,
    setForm: PropTypes.func.isRequired
  }
  componentDidMount() {
    this.props.setForm(this.props.form)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <>
        <Form>
          <Item>
            {
              getFieldDecorator(
                'categoryName',
                {
                  initialValue: this.props.categoryName,
                  rules: [{
                    required: true,
                    message: '请输入分类名称',
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
export default UpdateForm
