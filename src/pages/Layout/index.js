import { Layout } from 'antd';
import Content from 'components/layout/Content';
import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';
import Sider from 'components/layout/Sider';
import { useStoreState } from 'easy-peasy';
import React, { useState } from 'react';

const Index = ({ children }) => {
  const role = useStoreState((state) => state.user.role);
  const [collapsed, setCollapsed] = useState(true);

  const ToggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout>
      <Header collapsed={collapsed} ToggleCollapsed={ToggleCollapsed} />
      <Layout>
        <Sider collapsed={collapsed} ToggleCollapsed={ToggleCollapsed} />
        <Content>{children}</Content>
      </Layout>
      {(role === 'cliente' || role === undefined) && <Footer />}
    </Layout>
  );
};

export default Index;
