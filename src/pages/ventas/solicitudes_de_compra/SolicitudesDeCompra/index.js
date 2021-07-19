import { Empty, Input, Pagination, Select, Space, Typography } from 'antd';
import { getSolicitudesCompra } from 'api/ventas/solicitudes_compra';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import Heading from 'components/UI/Heading';
import SolicitudesCompraList from 'components/ventas/solicitudes_compra/SolicitudesCompraList';
import { useStoreState } from 'easy-peasy';
import { useState } from 'react';
import { useQuery } from 'react-query';
const { Text } = Typography;

const SolicitudesDeCompra = () => {
  const token = useStoreState((state) => state.user.token.access_token);
  const [clienteRFC, setClienteRFC] = useState('');
  const [filter, setFilter] = useState('todos');
  const [page, setPage] = useState(1);
  const solicitudes = useQuery(
    ['solicitudes-de-compra', clienteRFC, filter],
    () => getSolicitudesCompra(clienteRFC, page, filter, token)
  );
  const solicitudesData = solicitudes.data?.data?.data;

  const handleChangeFilter = (filter) => {
    setFilter(filter);
    setPage(1);
  };

  return (
    <>
      <Heading title='Solicitudes de compra' />
      <Space size='large'>
        <Space>
          <Text>Buscar por RFC:</Text>
          <Input.Search allowClear maxLength={13} onSearch={setClienteRFC} />
        </Space>
        <Space>
          <Text>Filtrar por:</Text>
          <Select
            defaultValue='todos'
            onChange={handleChangeFilter}
            style={{ width: '200px' }}
          >
            <Select.Option value='todos'>Todos</Select.Option>
            <Select.Option value='pendiente'>Pendiente</Select.Option>
            <Select.Option value='aprobada'>Aprobadas</Select.Option>
            <Select.Option value='rechazada'>Rechazadas</Select.Option>
          </Select>
        </Space>
      </Space>
      {solicitudes.isLoading ? (
        <CenteredSpinner />
      ) : (
        <>
          {solicitudesData.length ? (
            <>
              <SolicitudesCompraList solicitudes={solicitudesData} />
              <Pagination
                current={page}
                total={solicitudes.data.data.meta.filter_count}
                pageSize={10}
                onChange={(page) => setPage(page)}
              />
            </>
          ) : (
            <Empty />
          )}
        </>
      )}
    </>
  );
};

export default SolicitudesDeCompra;
