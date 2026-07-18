import React from 'react';
import { Table, Button, InputNumber, Empty, Typography, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const CartPage: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCartStore();
  const navigate = useNavigate();

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record: any) => (
        <InputNumber
          min={1}
          max={99}
          defaultValue={quantity}
          onChange={(val) => {
            // 如果需要修改数量，可以在这里扩展，简单起见暂时不动态修改
          }}
        />
      ),
    },
    {
      title: '小计',
      key: 'subtotal',
      render: (_: any, record: any) =>
        `¥${(record.price * record.quantity).toFixed(2)}`,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Popconfirm
          title="确定要删除该商品吗？"
          onConfirm={() => removeFromCart(record.id)}
        >
          <Button type="link" icon={<DeleteOutlined />} danger>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <Empty description="购物车是空的">
        <Button type="primary" onClick={() => navigate('/')}>
          去逛逛
        </Button>
      </Empty>
    );
  }

  return (
    <div>
      <Title level={2}>购物车</Title>
      <Table
        dataSource={cart}
        columns={columns}
        rowKey="id"
        pagination={false}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={4}>
              <Text strong>合计</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              <Text strong type="danger" style={{ fontSize: '18px' }}>
                ¥{totalPrice.toFixed(2)}
              </Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} />
          </Table.Summary.Row>
        )}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Button onClick={clearCart}>清空购物车</Button>
        <Button type="primary" size="large" onClick={() => navigate('/checkout')}>
          去结算
        </Button>
      </div>
    </div>
  );
};

export default CartPage;