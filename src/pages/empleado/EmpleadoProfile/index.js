import { Button, Col, Divider, Row } from 'antd';
import { getUserData } from 'api/profile';
import EmpleadoProfileOverview from 'components/empleados/EmpleadoProfile/EmpleadoProfileOverview';
import AssignAddressCard from 'components/shared/AssignAddressCard';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import HeadingBack from 'components/UI/HeadingBack';
import { useStoreState } from 'easy-peasy';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { capitalize } from 'utils/functions';
import { isLastDayOfMonth } from 'date-fns';

const EmpleadoProfile = () => {
  const token = useStoreState((state) => state.user.token.access_token);
  const user = useQuery('employee', () => getUserData(token));
  const role = useStoreState((state) => state.user.role);
  const date = Date.now();

  return (
    <>
      {role === 'administrador' ? (
        <HeadingBack
          title='Mi perfil'
          subtitle={`${isLastDayOfMonth(date) ? 'FACTURACIÓN GLOBAL HOY' : ''}`}
          extra={capitalize(role)}
          actions={[
            <Link to='/empleado/perfil' key='1'>
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
      ) : (
        <HeadingBack title='Mi perfil' extra={capitalize(role)} />
      )}
      {user.isLoading ? (
        <CenteredSpinner />
      ) : (
        <>
          <Row gutter={[24, 24]}>
            <EmpleadoProfileOverview employee={user.data} />
          </Row>
          <Divider />
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <AssignAddressCard address={user.data.empleado} tipo='' />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default EmpleadoProfile;
