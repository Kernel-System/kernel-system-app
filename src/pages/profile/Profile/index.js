import { Col, Divider, Row } from 'antd';
import { getUserData } from 'api/profile';
import {
  getUserDireccionesEnvio,
  getUserDireccionesFacturacion,
} from 'api/shared/addresses';
import ProfileOverview from 'components/profile/Profile/ProfileOverview';
import AssignAddressCard from 'components/shared/AssignAddressCard';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import Heading from 'components/UI/Heading';
import { useStoreState } from 'easy-peasy';
import { useQuery } from 'react-query';

const Profile = () => {
  const token = useStoreState((state) => state.user.token.access_token);
  const user = useQuery('user', () => getUserData(token));
  const direccionesEnvio = useQuery(
    'direccionesEnvio',
    () => getUserDireccionesEnvio(user.data.cliente.rfc, token),
    { enabled: !!user?.data?.cliente }
  );
  const direccionesFiscal = useQuery(
    'direccionesFiscal',
    () => getUserDireccionesFacturacion(user.data.cliente.rfc, token),
    { enabled: !!user?.data?.cliente }
  );

  return (
    <>
      <Heading title='Mi perfil' />
      {user.isLoading ? (
        <CenteredSpinner />
      ) : (
        <Row gutter={[24, 24]}>
          <ProfileOverview user={user.data} />
        </Row>
      )}
      <Divider />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          {direccionesEnvio.isIdle ? (
            <CenteredSpinner />
          ) : (
            <AssignAddressCard addresses={direccionesEnvio.data} tipo='Envío' />
          )}
        </Col>
        <Col xs={24} md={12}>
          {direccionesFiscal.isIdle ? (
            <CenteredSpinner />
          ) : (
            <AssignAddressCard
              addresses={direccionesFiscal.data}
              tipo='Facturación'
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default Profile;
