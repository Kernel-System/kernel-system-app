import { Layout } from 'antd';
import Content from 'components/layout/Content';
import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';
import Sider from 'components/layout/Sider';
import React, { useState } from 'react';

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
