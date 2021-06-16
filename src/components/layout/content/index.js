import { Layout } from 'antd';

const { Content } = Layout;

const Index = ({ children }) => {
  return (
    <Layout>
      <Content
        style={{
          padding: 24,
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: '#fff',
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default Index;
