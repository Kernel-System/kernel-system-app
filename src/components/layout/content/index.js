import './style.css';
import { Layout } from 'antd';
import LectorProveedores from 'components/util/facturas/LectorFacturas';

const { Content } = Layout;

const imprimirProveedores = (factura) => {
  console.log(factura['cfdi:Emisor'][0].$);
};

const Index = ({ children }) => {
  return (
    <Layout style={{ padding: '10px 10px 0' }}>
      <Content
        className='site-layout-background'
        style={{
          padding: 24,
          margin: 0,
          minHeight: 'calc(100vh - 70px)',
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default Index;
