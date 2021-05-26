import { http } from 'api';
import { Button, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import Header from 'components/UI/Heading';
import CsvReader from 'components/shared/CsvReader';
import TransferenciasList from 'components/list/TransferenciasList';

const Index = () => {
  const insertItems = (items) => {
    return http.post('/items/productos', items);
  };

  const importarProductos = (datos) => {
    const hide = message.loading('Importando productos..', 0);
    insertMutation.mutate(datos, { onSuccess: hide });
  };

  const queryClient = useQueryClient();

  const insertMutation = useMutation((formData) => insertItems(formData), {
    onSuccess: () => {
      message.success('Proveedores importados exitosamente');
      queryClient.invalidateQueries('proveedores');
    },
  });

  return (
    <>
      <Header title='Transferencias' />
      <TransferenciasList />
      <br />
      <Space direction='horizontal' align='baseline' style={{ width: '100%' }}>
        <Link to='/transferencia/nuevo'>
          <Button type='primary' icon={<PlusOutlined />}>
            Añadir Nueva Transferencia
          </Button>
        </Link>
      </Space>
    </>
  );
};

export default Index;
