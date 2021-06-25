import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Button, Image, List, Popconfirm, Typography } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { useHistory } from 'react-router';
const { Link } = Typography;

const AnunciosList = ({ anuncios, deleteAnuncio }) => {
  const breakpoint = useBreakpoint();
  const history = useHistory();

  return (
    <List
      itemLayout={breakpoint.md ? 'horizontal' : 'vertical'}
      dataSource={anuncios?.data?.data?.data}
      loading={anuncios.isLoading}
      renderItem={(anuncio) => (
        <List.Item
          actions={[
            <Button
              onClick={() => history.push(`/admin/anuncio/${anuncio.id}`)}
              icon={<EditFilled />}
            />,
            <Popconfirm
              title='¿Está seguro que quiere eliminar el anuncio?'
              okText='Eliminar'
              okType='danger'
              cancelText='Cancelar'
              onConfirm={() =>
                deleteAnuncio.mutate([anuncio.id, anuncio.imagen])
              }
            >
              <Button danger icon={<DeleteFilled />} />
            </Popconfirm>,
          ]}
          extra={
            <Image
              width={300}
              height={120}
              alt={anuncio.titulo}
              src={`${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${anuncio.imagen}`}
            />
          }
        >
          <List.Item.Meta
            title={anuncio.titulo}
            description={
              <>
                Enlace: <Link>{anuncio.url}</Link>
              </>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default AnunciosList;
