import CuentasList from 'components/list/CuentasList';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import HeadingBack from 'components/UI/HeadingBack';

const Index = () => {
  return (
    <div>
      <HeadingBack title='Cuentas' />
      <CuentasList
      //editItem={showModal}
      //onConfirmDelete={onConfirmDelete}
      />
      <br />
      <Link to='/cuentas/pagos/nuevo'>
        <Button type='primary' size='default' icon={<PlusOutlined />}>
          Añadir Nuevo Pago
        </Button>
      </Link>
    </div>
  );
};

export default Index;
