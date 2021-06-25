import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, message, Row } from 'antd';
import { deleteAnuncio, getAnuncios } from 'api/admin/anuncios';
import AnunciosList from 'components/administrador/Anuncios/AnunciosList';
import Heading from 'components/UI/Heading';
import { useStoreState } from 'easy-peasy';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';

const Anuncios = () => {
  const queryClient = useQueryClient();
  const token = useStoreState((state) => state.user.token.access_token);
  const anuncios = useQuery('anuncios', getAnuncios);
  const mutation = useMutation(
    ([id, imageId]) => deleteAnuncio(id, imageId, token),
    {
      onSuccess: () => {
        queryClient
          .invalidateQueries('anuncios')
          .then(() =>
            message.success('Se ha eliminado el anuncio correctamente')
          );
      },
      onError: () => {
        message.error('Lo sentimos, ha ocurrido un error');
      },
    }
  );

  return (
    <>
      <Heading title='Anuncios' />
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <AnunciosList anuncios={anuncios} deleteAnuncio={mutation} />
        </Col>
        <Col span={24}>
          <Link to='/admin/anuncio/nuevo'>
            <Button type='primary' icon={<PlusOutlined />}>
              Añadir anuncio
            </Button>
          </Link>
        </Col>
      </Row>
    </>
  );
};

export default Anuncios;
