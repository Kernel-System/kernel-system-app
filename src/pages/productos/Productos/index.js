import { http } from 'api';
import { Button, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import Header from 'components/UI/Heading';
import ProductosList from 'components/list/ProductosList';
import { useStoreState } from 'easy-peasy';

const Index = () => {
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const queryClient = useQueryClient();

  const deleteItem = async (values) => {
    return http.delete('/items/productos/' + values.codigo, putToken);
  };

  const onConfirmDelete = (item) => {
    deleteMutation.mutate(item);
  };

  const deleteMutation = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient
        .invalidateQueries('productos')
        .then(message.success('El producto se ha eliminado exitosamente'));
    },
  });

  return (
    <>
      <Header title='Productos' putToken={putToken} />
      <ProductosList onConfirmDelete={onConfirmDelete} putToken={putToken} />
      <br />
      <Space direction='horizontal' align='baseline' style={{ width: '100%' }}>
        <Link to='/productos/nuevo'>
          <Button type='primary' icon={<PlusOutlined />}>
            Añadir Nuevo Producto
          </Button>
        </Link>
      </Space>
    </>
  );
};

export default Index;
