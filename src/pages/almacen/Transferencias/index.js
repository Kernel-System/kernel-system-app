import { Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Header from 'components/UI/Heading';
import TransferenciasList from 'components/list/TransferenciasList';

const Index = () => {
  return (
    <>
      <Header title='Transferencias' />
      <TransferenciasList />
      <br />
      <Space direction='horizontal' align='baseline' style={{ width: '100%' }}>
        <Link to='/transferencia/nuevo'>
          <Button type='primary' icon={<PlusOutlined />}>
            Añadir Nueva Transferencia
          </Button>
        </Link>
      </Space>
    </>
  );
};

export default Index;
