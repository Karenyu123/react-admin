import React, { Component } from 'react'
import {
  Card,
  DatePicker,
  Row,
  Col,
  Statistic,
  Icon
} from 'antd'
import {
  Chart,
  Geom,
  Axis,
  Tooltip
} from "bizcharts"
export default class Home extends Component {
  render() {
    const data = [{
        month: "2019-01-01",
        acc: 670.0
      },
      {
        month: "2019-02-01",
        acc: 1400.9
      },
      {
        month: "2019-03-01",
        acc: 1700.0
      },
      {
        month: "2019-04-01",
        acc: 2000.2
      },
      {
        month: "2019-05-01",
        acc: 5500.6
      },
      {
        month: "2019-06-01",
        acc: 5600.7
      },
      {
        month: "2019-07-01",
        acc: 3000.6
      },
      {
        month: "2019-08-01",
        acc: 6300.2
      },
      {
        month: "2019-09-01",
        acc: 2400.6
      },
      {
        month: "2019-10-01",
        acc: 1400.0
      },
      {
        month: "2019-11-01",
        acc: 900.4
      },
      {
        month: "2019-12-01",
        acc: 6000.3
      }
      
    ];
    const cols = {
      month: {
        alias: "月份"
      },
      acc: {
        alias: "积累量"
      }
    };
    return (
      <>
        <Card>
          <Row>
            <Col span={ 8 }>
              <Card title="销售总量" >
                <Row>
               <Col style={{textAlign:'center'}}><h2 style={{textAlign:'center',fontSize:30,fontWeight:700,display:'inline-block'}}>100,000<span style={{fontSize:16,fontWeight:700}}>个</span></h2></Col>
              </Row>
              <Row style={{textAlign:'center'}}>
                <Col span={12} >
                  <Statistic
                    title="月同比"
                    value={11.28}
                    precision={2}
                    valueStyle={{textAlign:'center', color: '#3f8600',fontSize:20 }}
                    prefix={<Icon type="arrow-up" />}
                    suffix="%"
                  />           
                </Col>
                <Col span={ 12 }>
                  <Statistic
                    title="日同比"
                    value={9.3}
                    precision={2}
                    valueStyle = {
                      {
                        textAlign: 'center',
                        color: '#cf1322',
                        fontSize: 20
                      }
                    }
                    prefix={<Icon type="arrow-down" />}
                    suffix="%"
                  />
                </Col>
              </Row>
              </Card>
            </Col>
            <Col span={ 16 }>
              <Chart height={300} data={data} scale={cols} forceFit>
                <Axis
                  name="month"
                  title={null}
                  tickLine={null}
                  line={{
                    stroke: "#E6E6E6"
                  }}
                />
                <Axis
                  name="acc"
                  line={false}
                  tickLine={null}
                  grid={null}
                  title={null}
                />
                <Tooltip />
                <Geom
                  type="line"
                  position="month*acc"
                  size={1}
                  color="l (270) 0:rgba(255, 146, 255, 1) .5:rgba(100, 268, 255, 1) 1:rgba(215, 0, 255, 1)"
                  shape="smooth"
                  style={{
                    shadowColor: "l (270) 0:rgba(21, 146, 255, 0)",
                    shadowBlur: 60,
                    shadowOffsetY: 6
                  }}
                />
              </Chart>
            </Col>
          </Row>
          <Row>
            <Card extra={<DatePicker/>} >

            </Card>
          </Row>
        </Card>
      </>
    )
  }
}
