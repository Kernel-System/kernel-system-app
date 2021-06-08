import { Button, Row } from 'antd';
import { getUserData } from 'api/profile';
import ProfileAdmidOverview from 'components/profile/Profile/ProfileAdmidOverview';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import HeadingBack from 'components/UI/HeadingBack';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

const Profile = () => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk2NGIyNjRiLTdmMzktNDZlOC1hZmEwLWVjM2ZjYmQ1MWY3YSIsImlhdCI6MTYyMjU2MDQ4NSwiZXhwIjoxNjIyNTk2NDg1fQ.CtPkzvBKq4Rl36MaBrRsYt5VnzYOfN1fsmDe-F6rBS0'; //useStoreState((state) => state.admid.token.access_token);
  const admid = useQuery('admid', () => getUserData(token));

  return (
    <>
      <HeadingBack
        title='Administrador'
        actions={[
          <Link to='/admid' key='1'>
            <Button type='primary'>Administrador</Button>
          </Link>,
          <Link to='/admid/empleado' key='2'>
            <Button>Empleados</Button>
          </Link>,
          <Link to='/admid/cliente' key='3'>
            <Button>Clientes</Button>
          </Link>,
          <Link to='/admid/sucursal' key='4'>
            <Button>Sucursales</Button>
          </Link>,
          <Link to='/admid/almacen' key='5'>
            <Button>Almacenes</Button>
          </Link>,
        ]}
      />
      {admid.isLoading ? (
        <CenteredSpinner />
      ) : (
        <Row gutter={[24, 24]}>
          <ProfileAdmidOverview admid={admid.data} />
        </Row>
      )}
    </>
  );
};

export default Profile;
