import { Avatar, List, Space } from 'antd';
import Text from 'antd/lib/typography/Text';
import { Link } from 'react-router-dom';
import { formatPrice, toPercent } from 'utils/functions';

const OrderProductsList = ({ products }) => {
  return (
    <List
      style={{ marginRight: '1rem' }}
      dataSource={products}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar
                shape='square'
                src={
                  item.codigo_producto.imagenes.length
                    ? `${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${item.codigo_producto.imagenes[0].directus_files_id}`
                    : undefined
                }
              >
                {item.codigo_producto.titulo[0]}
              </Avatar>
            }
            title={
              <Link to={`/producto/${item.codigo_producto.codigo}`}>
                {item.codigo_producto.titulo}
              </Link>
            }
            description={
              <Space>
                <Text type='secondary'>
                  {item.cantidad} x{' '}
                  {formatPrice(
                    (item.precio_ofrecido -
                      item.precio_ofrecido *
                        toPercent(item.descuento_ofrecido)) *
                      item.cantidad
                  )}
                </Text>
                <Text type='danger' delete>
                  {formatPrice(item.precio_ofrecido * item.cantidad)}
                </Text>
              </Space>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default OrderProductsList;
