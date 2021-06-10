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
    () => getUserOrders(user.data.cliente.id, token),
    { enabled: !!user?.data?.cliente }
  );

  const orderData = orders?.data?.data?.data;

  return (
    <>
      <Heading title='Mis solicitudes de compra' />
      <Space>
        <Text>Solicitudes realizadas en:</Text>
        <Select
          defaultValue={new Date().getFullYear()}
          loading={user.isLoading || orders.isLoading}
        >
          {orderData?.map((order) => (
            <Select.Option
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
          <Space
            direction='vertical'
            style={{ width: '100%', marginBottom: '1em' }}
          >
            {orderData?.map((order) => (
              <OrderCard key={order.id} details={order} />
            ))}
          </Space>
          <Pagination defaultCurrent={1} />
        </>
      )}
    </>
  );
};

export default Orders;
