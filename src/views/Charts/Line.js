import React, { Component } from 'react'
import { Card, Button } from 'antd'
import ReactEcharts from 'echarts-for-react'
export default class Line extends Component {
  state = {
    sales: [5, 20, 36, 10, 10, 20],
    storage: [10, 12, 20, 36, 16, 10]
  }
  update = () => {
    this.setState(state => ({
      sales: state.sales.map(item => item + 1),
      storage: state.storage.reduce((pre, item) => {
        pre.push(item - 1)
        return pre
      }, [])
    }))
  }
  //图的配置
  getOption = (sales, storage) => {

    return {
      title: {
        text: '商品销量、库存折线图'
      },
      tooltip: {},
      legend: {
        data: ['销量', '库存']
      },
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      },
      yAxis: {},
      series: [{
          name: '销量',
          type: 'line',
          data: sales,
          itemStyle: {
            normal: {
              color: '#1890FF',
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        {
          name: '库存',
          type: 'line',
          data: storage,
          itemStyle: {
            normal: {
              color: '#48dbfb',
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  }
  render() {
    const { sales,storage } = this.state
    return (
      <>
        <Card title={
          <Button type="primary" onClick={this.update} ghost>更新</Button> }>
          < ReactEcharts option = {
            this.getOption(sales, storage)
          }
          />
        </Card>
      </>
    )
  }
}
