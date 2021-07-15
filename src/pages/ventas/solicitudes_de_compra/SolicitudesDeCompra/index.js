import {
  Empty,
  Pagination,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Grid,
} from 'antd';
import { getSolicitudesCompra } from 'api/ventas/solicitudes_compra';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import Heading from 'components/UI/Heading';
import SolicitudesCompraList from 'components/ventas/solicitudes_compra/SolicitudesCompraList';
import { useStoreState } from 'easy-peasy';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { contentCol } from 'utils/gridUtils';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const SolicitudesDeCompra = () => {
  const token = useStoreState((state) => state.user.token.access_token);
  const [filter, setFilter] = useState('todos');
  const [page, setPage] = useState(1);
  const solicitudes = useQuery(['solicitudes-de-compra', filter], () =>
    getSolicitudesCompra(page, filter, token)
  );
  const solicitudesData = solicitudes.data?.data?.data;

  const handleChangeFilter = (filter) => {
    setFilter(filter);
    setPage(1);
  };

  const screen = useBreakpoint();

  return (
    <>
      <Heading title='Solicitudes de compra' />
      <Row gutter={[10, 12]} style={{ marginBottom: 10 }}>
        <Col>
          <Text
            style={{
              verticalAlign: 'sub',
            }}
          >
            Filtrar por:
          </Text>
        </Col>
        <Col {...contentCol(screen, 'auto')}>
          <Select
            defaultValue='todos'
            onChange={handleChangeFilter}
            style={{ width: '100%' }}
          >
            <Select.Option value='todos'>Todos</Select.Option>
            <Select.Option value='pendiente'>Pendiente</Select.Option>
            <Select.Option value='aprobada'>Aprobadas</Select.Option>
            <Select.Option value='rechazada'>Rechazadas</Select.Option>
          </Select>
        </Col>
      </Row>
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
