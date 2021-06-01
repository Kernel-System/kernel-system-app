import { Button, Col, Divider, Row } from 'antd';
import { getUserData } from 'api/profile';
import { getUserDireccionFiscal } from 'api/shared/addresses';
import ProfileOverview from 'components/profile/Profile/ProfileOverview';
import AssignAddressCard from 'components/shared/AssignAddressCard';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import HeadingBack from 'components/UI/HeadingBack';
import { useStoreState } from 'easy-peasy';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

const Profile = () => {
  const token = useStoreState((state) => state.user.token.access_token);
  const user = useQuery('user', () => getUserData(token));
  const direccionFiscal = useQuery(
    'direccionesFiscal',
    () => getUserDireccionFiscal(user.data.cliente.rfc, token),
    { enabled: !!user?.data?.cliente }
  );

  return (
    <>
      <HeadingBack
        title='Mi perfil'
        actions={[
          <Link to='/perfil' key='1'>
            <Button type='primary'>Mi perfil</Button>
          </Link>,
          <Link to='/direcciones' key='2'>
            <Button>Mis direcciones</Button>
          </Link>,
          <Link to='/perfil/cambiar-contrasena' key='3'>
            <Button>Cambiar contraseña</Button>
          </Link>,
        ]}
      />
      {user.isLoading ? (
        <CenteredSpinner />
      ) : (
        <Row gutter={[24, 24]}>
          <ProfileOverview user={user.data} />
        </Row>
      )}
      <Divider />
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          {direccionFiscal.isIdle || direccionFiscal.isLoading ? (
            <CenteredSpinner />
          ) : (
            <AssignAddressCard
              address={direccionFiscal.data?.data?.data[0]}
              tipo='Fiscal'
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default Profile;
