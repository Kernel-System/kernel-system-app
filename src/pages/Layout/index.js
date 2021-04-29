import React, { useState } from 'react';
import { Layout } from 'antd';
import Header from '../../components/layout/header';
import Content from '../../components/layout/content';
import Footer from '../../components/layout/footer';
import Sider from '../../components/layout/sider';

const Index = ({ children }) => {
  const [collapsed, useCollapsed] = useState(true);

  const ToggleCollapsed = () => {
    useCollapsed(!collapsed);
  };

  return (
    <Layout>
      <Header
        collapsed={collapsed}
        ToggleCollapsed={() => {
          ToggleCollapsed();
        }}
      />
      <Layout>
        <Layout>
          <Sider collapsed={collapsed} />
          <Content>{children}</Content>
        </Layout>
      </Layout>
      <Footer />
    </Layout>
  );
};

export default Index;
