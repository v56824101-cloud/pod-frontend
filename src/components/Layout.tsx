import React from 'react';
import { Layout, Menu, Badge, Button, Carousel } from 'antd';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const { Header, Content, Footer } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useCartStore((state) =>
    state.cart.reduce((sum, item) => sum + item.quantity, 0)
  );
  const { currentUser } = useAuth();

  const menuItems = [
    { key: '/', label: '全部产品' },
    { key: '/products?category=clothing', label: '服装' },
    { key: '/products?category=shoes', label: '鞋类' },
    { key: '/products?category=accessories', label: '配饰' },
  ];

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 顶部导航栏 */}
      <Header style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: '0 24px' }}>
        <div
          style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '40px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          MyPOD
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname === '/' ? '/' : location.pathname + location.search]}
          onClick={handleMenuClick}
          items={menuItems}
          style={{ flex: 1 }}
        />
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {currentUser ? (
            <>
              <span style={{ fontSize: '14px' }}>{currentUser.email}</span>
              <Button type="link" icon={<LogoutOutlined />} onClick={() => signOut(auth)}>
                退出
              </Button>
            </>
          ) : (
            <Button type="link" icon={<UserOutlined />} onClick={() => navigate('/login')}>
              登录
            </Button>
          )}
          <Badge count={totalItems}>
            <ShoppingCartOutlined
              style={{ fontSize: '20px', cursor: 'pointer' }}
              onClick={() => navigate('/cart')}
            />
          </Badge>
        </div>
      </Header>

      {/* 轮播图区域 */}
      <div style={{ background: '#fff' }}>
        <Carousel autoplay autoplaySpeed={4000} style={{ maxHeight: '400px' }}>
          <div>
            <img
              src="https://raw.githubusercontent.com/v56824101-cloud/POD-picture/refs/heads/main/%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1-1.jpg"
              alt="零库存一件代发"
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            />
          </div>
          <div>
            <img
              src="https://raw.githubusercontent.com/v56824101-cloud/POD-picture/refs/heads/main/%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1-2.jpg"
              alt="高净利润"
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            />
          </div>
          <div>
            <img
              src="https://via.placeholder.com/1200x400?text=Banner1"
              alt="无忧售后"
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            />
          </div>
        </Carousel>
      </div>

      {/* 页面内容 */}
      <Content style={{ padding: '24px' }}>{children}</Content>

      {/* 底部 */}
      <Footer style={{ textAlign: 'center', background: '#f0f0f0' }}>
        <p>零库存 · 无忧售后 · 一件代发 · 高净利润</p>
        <p>© 2026 MyPOD. All rights reserved.</p>
      </Footer>
    </Layout>
  );
};

export default AppLayout;
