import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Empty, message, Pagination, Row } from 'antd';
import { getUserData } from 'api/profile';
import { deleteUserDireccion, getUserDirecciones } from 'api/profile/addresses';
import AddressesList from 'components/profile/Addresses/AddressesList';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import HeadingBack from 'components/UI/HeadingBack';
import { useStoreState } from 'easy-peasy';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';

const Addresses = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const token = useStoreState((state) => state.user.token.access_token);
  const user = useQuery('user', () => getUserData(token));
  const addresses = useQuery(
    ['direcciones', page],
    () => getUserDirecciones(user.data.cliente.id, page, token),
    { enabled: !!user?.data?.cliente }
  );
  const addressesData = addresses?.data?.data?.data;
  const mutation = useMutation((id) => deleteUserDireccion(id, token), {
    onSuccess: () => {
      queryClient
        .invalidateQueries('direcciones')
        .then(() =>
          message.success('Se ha eliminado la dirección correctamente')
        );
    },
    onError: () => {
      message.error('Lo sentimos, ha ocurrido un error');
    },
  });

  return (
    <>
      <HeadingBack
        title='Mis direcciones'
        actions={[
          <Link to='/perfil' key='1'>
            <Button>Mi perfil</Button>
          </Link>,
          <Link to='/direcciones' key='2'>
            <Button type='primary'>Mis direcciones</Button>
          </Link>,
          <Link to='/perfil/cambiar-contrasena' key='3'>
            <Button>Cambiar contraseña</Button>
          </Link>,
        ]}
      />
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          {user.isLoading || addresses.isLoading ? (
            <CenteredSpinner />
          ) : (
            <>
              {addressesData.length ? (
                <>
                  <AddressesList
                    addresses={addressesData}
                    deleteUserDireccion={mutation}
                  />
                  <Pagination
                    current={page}
                    total={addresses.data.data.meta.filter_count}
                    pageSize={10}
                    onChange={(page) => setPage(page)}
                  />
                </>
              ) : (
                <Empty description='No ha añadido ninguna dirección' />
              )}
            </>
          )}
        </Col>
        <Col xs={24}>
          <Link to='/direcciones/nueva'>
            <Button type='primary' icon={<PlusOutlined />}>
              Añadir dirección
            </Button>
          </Link>
        </Col>
      </Row>
    </>
  );
};

export default Addresses;
