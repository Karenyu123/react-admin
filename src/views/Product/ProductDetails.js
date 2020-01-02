import React, { Component } from 'react'
import { Card, List, Icon } from 'antd'
import commenName from '../../config/commenName'
import './product.css'
const { Item } = List

export default class ProductDetails extends Component {
  render() {
    const { record } = this.props.location.state
    const { name, desc, detail, price, imgs  } = record
    const title = (<span><Icon type='left' style={ { cursor: "pointer" } }
    onClick={this.props.history.goBack}
    ></Icon>&emsp;商品详情</span>)
    return (
      <>
        <Card
          title={title}>
          <List className="detail">
            <Item>
              <span className="title">商品名称：</span>
              <span>{name}</span>
            </Item>
            <Item>
              <span className="title">商品描述：</span>
              <span>{desc}</span>
            </Item>
            <Item>
              <span className="title">商品价格：</span>
              <span>{price}元</span>
            </Item>
            <Item>
              <span className="title">所属分类：</span>
              <span>电脑/笔记本</span>
            </Item>
            <Item>
              <span className="title">商品图片：</span>
              <span>
                {
                  imgs.map((item,index) => {
                    return <img className="product-img" key={index} src={`${commenName.BASE_UPLOAD_URL+item}`} alt="pic" />
                  })
                }
              </span>
            </Item>
            <Item>
              <span className="title">商品详情：</span>
              <span dangerouslySetInnerHTML={{__html:detail}}></span>
            </Item>
          </List>
        </Card>
      </>
    )
  }
}


