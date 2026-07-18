import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Spin, Input, Empty, Tag } from 'antd';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { Meta } = Card;
const { Title } = Typography;
const { Search } = Input;

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setLoading(true);
    const url = category
      ? `https://pod-backend-xjt0.onrender.com/api/products?category=${category}`
      : 'https://pod-backend-xjt0.onrender.com/api/products';

    axios.get(url)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("获取数据失败:", error);
        setLoading(false);
      });
  }, [category]);

  // 前端搜索过滤
  const displayedProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const categoryNames: Record<string, string> = {
    clothing: '服装',
    shoes: '鞋类',
    accessories: '配饰',
    home: '家居',
  };
  const pageTitle = category ? categoryNames[category] || category : '所有产品';

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <Title level={2} style={{ marginBottom: '24px' }}>{pageTitle}</Title>
      <Search
        placeholder="搜索产品名称"
        allowClear
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: '20px', maxWidth: '400px' }}
      />
      {displayedProducts.length === 0 ? (
        <Empty description="没有找到相关产品" />
      ) : (
        <Row gutter={[16, 24]}>
          {displayedProducts.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <Card
                hoverable
                cover={<img alt={product.name} src={product.image} style={{ height: '240px', objectFit: 'cover' }} />}
                onClick={() => navigate(`/product/${product.id}`)}
                style={{
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)')}
              >
                <div style={{ marginBottom: '8px' }}>
                  <Tag color="blue">{categoryNames[product.category] || product.category}</Tag>
                </div>
                <Meta title={product.name} description={`¥${product.price.toFixed(2)}`} />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ProductsPage;