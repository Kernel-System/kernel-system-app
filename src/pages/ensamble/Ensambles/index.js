import EnsambleList from 'components/list/EnsambleList';
import { Typography, Button } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { useStoreState } from 'easy-peasy';
import { useQuery } from 'react-query';
import { getUserRole } from 'api/auth';

const { Title } = Typography;

const Index = () => {
  const token = useStoreState((state) => state.user.token.access_token);
  const rol = useQuery(['rol_empleado'], () => getUserRole(token))?.data?.data
    ?.data.role.name;
  const ChangeVisible = () => {
    if (rol === 'encargado de ventas' || rol === 'administrador') return true;
    else return false;
  };
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return (
    <div>
      <Title level={3}>Órdenes de Ensamble</Title>
      <EnsambleList putToken={putToken} />
      <br />
      <Link to='/ensambles/nuevo'>
        <Button
          type='primary'
          size='default'
          icon={<PlusOutlined />}
          disabled={!ChangeVisible() ? true : false}
        >
          Añadir Nueva Orden de Ensamble
        </Button>
      </Link>
    </div>
  );
};

export default Index;
