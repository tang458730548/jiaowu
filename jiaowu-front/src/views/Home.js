import React, { useRef, useEffect } from 'react';
import { Card, Row, Col } from 'antd';
import * as echarts from 'echarts';

const Home = () => {
  const lineRef = useRef(null);
  const pieRef = useRef(null);

  useEffect(() => {
    // 折线图
    const lineChart = echarts.init(lineRef.current);
    lineChart.setOption({
      title: { text: '一周访问量趋势', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['周一','周二','周三','周四','周五','周六','周日'] },
      yAxis: { type: 'value' },
      series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: { color: '#1890ff' },
        itemStyle: { color: '#1890ff' }
      }]
    });
    // 饼图
    const pieChart = echarts.init(pieRef.current);
    pieChart.setOption({
      title: { text: '用户类型分布', left: 'center' },
      tooltip: { trigger: 'item' },
      legend: { bottom: 0, left: 'center' },
      series: [{
        name: '用户类型',
        type: 'pie',
        radius: '60%',
        data: [
          { value: 1048, name: '学生' },
          { value: 735, name: '教师' },
          { value: 580, name: '管理员' }
        ],
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.3)' }
        }
      }]
    });
    // 销毁实例
    return () => {
      lineChart.dispose();
      pieChart.dispose();
    };
  }, []);

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card title="用户总数" bordered={false} style={{ fontSize: 18 }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff' }}>128</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="今日活跃" bordered={false} style={{ fontSize: 18 }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#52c41a' }}>23</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="新增用户" bordered={false} style={{ fontSize: 18 }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#faad14' }}>5</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="系统消息" bordered={false} style={{ fontSize: 18 }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#f5222d' }}>2</div>
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={16}>
          <Card title="数据趋势" bordered={false} style={{ minHeight: 340 }}>
            <div ref={lineRef} style={{ width: '100%', height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户类型分布" bordered={false} style={{ minHeight: 340 }}>
            <div ref={pieRef} style={{ width: '100%', height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
