import { Col, Divider, Row } from 'antd';
import { getUserData } from 'api/profile';
import EmpleadoProfileOverview from 'components/empleados/EmpleadoProfile/EmpleadoProfileOverview';
import AssignAddressCard from 'components/shared/AssignAddressCard';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import HeadingBack from 'components/UI/HeadingBack';
import { useStoreState } from 'easy-peasy';
import { useQuery } from 'react-query';
import { capitalize } from 'utils/functions';

const EmpleadoProfile = () => {
  const token = useStoreState((state) => state.user.token.access_token);
  const user = useQuery('user', () => getUserData(token));
  const role = useStoreState((state) => state.user.role);

  return (
    <>
      <HeadingBack title='Mi perfil' extra={capitalize(role)} />
      {user.isLoading ? (
        <CenteredSpinner />
      ) : (
        <Row gutter={[24, 24]}>
          <EmpleadoProfileOverview employee={user.data} />
        </Row>
      )}
      <Divider />
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <AssignAddressCard address={user.data?.empleado} tipo='' />
        </Col>
      </Row>
    </>
  );
};

export default EmpleadoProfile;
