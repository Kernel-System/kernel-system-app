import { Button, Col, message, Row } from 'antd';
import { getUserData } from 'api/profile';
import { deleteUserDireccion, getUserDirecciones } from 'api/shared/addresses';
import AddressesList from 'components/profile/Addresses/AddressesList';
import HeadingBack from 'components/UI/HeadingBack';
import { useStoreState } from 'easy-peasy';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';

const Addresses = () => {
  const queryClient = useQueryClient();
  const token = useStoreState((state) => state.user.token.access_token);
  const user = useQuery('user', () => getUserData(token));
  const addresses = useQuery(
    'direcciones',
    () => getUserDirecciones(user.data.cliente.rfc, token),
    { enabled: !!user?.data?.cliente }
  );
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
          <AddressesList addresses={addresses} deleteUserDireccion={mutation} />
        </Col>
        <Col xs={24}>
          <Link to='/direcciones/nueva'>
            <Button type='primary'>Añadir dirección</Button>
          </Link>
        </Col>
      </Row>
    </>
  );
};

export default Addresses;
