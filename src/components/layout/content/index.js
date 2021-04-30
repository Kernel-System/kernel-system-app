import './style.css';
import { Layout } from 'antd';

const { Content } = Layout;

const Index = ({ children }) => {
  return (
    <Layout style={{ padding: '10px 10px 0' }}>
      <Content
        className='site-layout-background'
        style={{
          padding: 24,
          margin: 0,
          minHeight: 'calc(100vh - 70px)',
          position: 'relative',
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default Index;
