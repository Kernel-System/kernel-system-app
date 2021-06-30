import { Empty, Pagination, Select, Space, Typography } from 'antd';
import { getUserData } from 'api/profile';
import { getUserOrders, getUserOrdersYears } from 'api/profile/orders';
import OrderCard from 'components/Orders/OrderCard';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import Heading from 'components/UI/Heading';
import { useStoreState } from 'easy-peasy';
import { useState } from 'react';
import { useQuery } from 'react-query';
const { Text } = Typography;

const Orders = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [page, setPage] = useState(1);
  const token = useStoreState((state) => state.user.token.access_token);
  const user = useQuery('user', () => getUserData(token));
  const years = useQuery(
    'solicitudes-de-compra-years',
    () => getUserOrdersYears(user.data.cliente.id, token),
    { enabled: !!user?.data?.cliente }
  );
  const yearsData = years?.data?.data?.data;
  const orders = useQuery(
    ['solicitudes-de-compra', page, year],
    () => getUserOrders(user.data.cliente.id, page, year, token),
    { enabled: !!user?.data?.cliente }
  );
  const ordersData = orders?.data?.data?.data;

  const handleChangeYear = (year) => {
    setYear(year);
    setPage(1);
  };

  return (
    <>
      <Heading title='Mis solicitudes de compra' />
      <Space>
        <Text>Solicitudes realizadas en:</Text>
        <Select
          defaultValue={new Date().getFullYear()}
          loading={years.isLoading}
          onChange={handleChangeYear}
        >
          {yearsData
            ?.filter(
              (order, i, array) =>
                array.findIndex(
                  (ord) =>
                    new Date(ord.fecha_solicitud).getFullYear() ===
                    new Date(order.fecha_solicitud).getFullYear()
                ) === i
            )
            .map((order) => (
              <Select.Option
                key={order.id}
                value={new Date(order.fecha_solicitud).getFullYear()}
              >
                {new Date(order.fecha_solicitud).getFullYear()}
              </Select.Option>
            ))}
        </Select>
      </Space>
      {user.isLoading || orders.isLoading ? (
        <CenteredSpinner />
      ) : (
        <>
          {ordersData.length ? (
            <>
              <Space
                direction='vertical'
                style={{ width: '100%', marginBottom: '1em' }}
              >
                {ordersData.map((order) => (
                  <OrderCard key={order.id} details={order} />
                ))}
              </Space>
              <Pagination
                current={page}
                total={orders.data.data.meta.filter_count}
                pageSize={3}
                onChange={(page) => setPage(page)}
              />
            </>
          ) : (
            <Empty description='No has realizado ninguna solicitud de compra' />
          )}
        </>
      )}
    </>
  );
};

export default Orders;
