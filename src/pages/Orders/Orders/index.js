import { Pagination, Select, Space, Typography } from 'antd';
import { getUserData } from 'api/profile';
import { getUserOrders } from 'api/profile/orders';
import OrderCard from 'components/Orders/OrderCard';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import Heading from 'components/UI/Heading';
import { useStoreState } from 'easy-peasy';
import { useQuery } from 'react-query';
const { Text } = Typography;

const Orders = () => {
  const token = useStoreState((state) => state.user.token.access_token);
  const user = useQuery('user', () => getUserData(token));
  const orders = useQuery(
    'solicitudDeCompra',
    () => getUserOrders(user.data.cliente.rfc, token),
    { enabled: !!user?.data?.cliente }
  );

  return (
    <>
      <Heading title='Mis solicitudes de compra' />
      <Space>
        <Text>Solicitudes realizadas en:</Text>
        <Select defaultValue='2021'>
          <Select.Option value='2021'>2021</Select.Option>
          <Select.Option value='2020'>2020</Select.Option>
          <Select.Option value='2019'>2019</Select.Option>
        </Select>
      </Space>
      <Space
        direction='vertical'
        style={{ width: '100%', marginBottom: '1em' }}
      >
        {orders.isLoading ? (
          <CenteredSpinner />
        ) : (
          orders?.data?.data?.data.map((order) => (
            <OrderCard key={order.id} details={order} />
          ))
        )}
      </Space>
      <Pagination defaultCurrent={1} total={50} />
    </>
  );
};

export default Orders;
