import React, { useState } from 'react';
import { Form, Input, Button, Typography, Table, message } from 'antd';
import axios from 'axios';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const { Title, Text } = Typography;

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const columns = [
    { title: '商品', dataIndex: 'name', key: 'name' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    {
      title: '小计',
      key: 'subtotal',
      render: (_: any, record: any) => `¥${(record.price * record.quantity).toFixed(2)}`,
    },
  ];

  const handleSubmit = async (values: any) => {
    const user = auth.currentUser;
    if (!user) {
      message.error('请先登录');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const token = await user.getIdToken();

      const response = await axios.post(
        'https://pod-backend.onrender.com/api/checkout',
        {
          cartItems: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          shippingAddress: values,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        message.success('下单成功！');
        clearCart();
        navigate('/');
      } else {
        message.error(response.data.message || '下单失败');
      }
    } catch (error) {
      console.error(error);
      message.error('网络错误或认证失败，请重新登录');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Title level={3}>购物车是空的</Title>
        <Button type="primary" onClick={() => navigate('/')}>
          去逛逛
        </Button>
      </div>
    );
  }

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
              <Text strong type="danger">
                ¥{totalPrice.toFixed(2)}
              </Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
      <div style={{ marginTop: '30px' }}>
        <Title level={3}>收货信息</Title>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="收货人" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="详细地址" rules={[{ required: true }]}>
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
