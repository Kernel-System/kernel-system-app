import { Button, Row } from 'antd';
import { getUserData } from 'api/profile';
import ProfileAdmidOverview from 'components/profile/Profile/ProfileAdmidOverview';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import HeadingBack from 'components/UI/HeadingBack';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';

const Profile = () => {
  const token = useStoreState((state) => state.user.token.access_token);
  const admin = useQuery('admin', () => getUserData(token));
  return (
    <>
      <HeadingBack
        title='Administrador'
        actions={[
          <Link to='/admin' key='1'>
            <Button type='primary'>Administrador</Button>
          </Link>,
          <Link to='/admin/empleado' key='2'>
            <Button>Empleados</Button>
          </Link>,
          <Link to='/admin/cliente' key='3'>
            <Button>Clientes</Button>
          </Link>,
          <Link to='/admin/sucursal' key='4'>
            <Button>Sucursales</Button>
          </Link>,
          <Link to='/admin/almacen' key='5'>
            <Button>Almacenes</Button>
          </Link>,
        ]}
      />
      {admin.isLoading ? (
        <CenteredSpinner />
      ) : (
        <Row gutter={[24, 24]}>
          <ProfileAdmidOverview admin={admin.data} />
        </Row>
      )}
    </>
  );
};

export default Profile;
