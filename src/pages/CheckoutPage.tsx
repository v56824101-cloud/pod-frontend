import React, { useState } from 'react';
import { Form, Input, Button, Typography, Table, message, Spin } from 'antd';
import axios from 'axios';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (values: any) => {
    if (cart.length === 0) {
      message.error('购物车为空，无法下单');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/checkout', {
        cartItems: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: values,
      });
      if (response.data.success) {
        message.success('下单成功！订单号：' + response.data.thirdPartyData?.orderId || '已生成');
        clearCart();
        navigate('/');
      } else {
        message.error(response.data.message || '下单失败，请重试');
      }
    } catch (error) {
      console.error(error);
      message.error('网络错误，下单失败');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Title level={3}>购物车是空的，请先添加商品</Title>
        <Button type="primary" onClick={() => navigate('/')}>去逛逛</Button>
      </div>
    );
  }

  const columns = [
    { title: '商品', dataIndex: 'name', key: 'name' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    {
      title: '小计',
      key: 'subtotal',
      render: (_: any, record: any) => `¥${(record.price * record.quantity).toFixed(2)}`,
    },
  ];

  return (
    <div>
      <Title level={2}>结算</Title>
      <Table
        dataSource={cart}
        columns={columns}
        rowKey="id"
        pagination={false}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={2}>
              <Text strong>合计</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              <Text strong type="danger">¥{totalPrice.toFixed(2)}</Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
      <div style={{ marginTop: '30px' }}>
        <Title level={3}>收货信息</Title>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="收货人姓名" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="详细地址" rules={[{ required: true, message: '请输入地址' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              提交订单
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CheckoutPage;