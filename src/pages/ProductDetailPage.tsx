// src/pages/ProductDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Radio, InputNumber, Image, Typography, Spin, message } from 'antd';
import axios from 'axios';
import { useCartStore } from '../store/cartStore';

const { Title, Text } = Typography;

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // 从 URL 获取产品 ID
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState('M'); // 默认尺码
  const [quantity, setQuantity] = useState<number>(1);
  
  const addToCart = useCartStore((state) => state.addToCart); // 引入我们在 cartStore 里写的方法

  useEffect(() => {
    // 从后端接口获取该 ID 的产品详情
    axios.get(`https://pod-backend-xjt0.onrender.com/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        message.error("获取商品详情失败");
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      // 调用 Zustand 全局状态，将商品加入购物车
     addToCart({
       id: product.id,
       name: `${product.name} (${size})`,
       price: product.price,
       quantity, // 加入数量
    });
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>商品不存在</div>;
  }

  return (
    <div>
      <Button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>返回列表</Button>
      <Row gutter={[32, 32]}>
        {/* 左侧：商品图片展示 */}
        <Col xs={24} md={12}>
          <Image
            src={product.image}
            alt={product.name}
            style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '8px' }}
          />
        </Col>

        {/* 右侧：商品购买选项 */}
        <Col xs={24} md={12}>
          <Title level={2}>{product.name}</Title>
          <Text type="danger" style={{ fontSize: '24px', fontWeight: 'bold', display: 'block', marginBottom: '20px' }}>
            ￥{product.price.toFixed(2)}
          </Text>

          {/* 尺码选择 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>选择尺码:</div>
            <Radio.Group value={size} onChange={(e) => setSize(e.target.value)}>
              <Radio.Button value="S">S</Radio.Button>
              <Radio.Button value="M">M</Radio.Button>
              <Radio.Button value="L">L</Radio.Button>
              <Radio.Button value="XL">XL</Radio.Button>
            </Radio.Group>
          </div>

          {/* 数量选择 */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>购买数量:</div>
            <InputNumber min={1} max={99} value={quantity} onChange={(val) => setQuantity(val || 1)} />
          </div>

          {/* 按钮 */}
          <Button type="primary" size="large" onClick={handleAddToCart} style={{ width: '200px' }}>
            加入购物车
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetailPage;