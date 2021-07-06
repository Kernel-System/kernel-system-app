import { Avatar, List, Space } from 'antd';
import Text from 'antd/lib/typography/Text';
import { Link } from 'react-router-dom';
import { formatPrice, toPercent } from 'utils/functions';

const OrderProductsList = ({ products }) => {
  return (
    <List
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
                    item.precio_ofrecido *
                      toPercent(100 - item.descuento_ofrecido) *
                      toPercent(100 + item.iva) *
                      item.cantidad
                  )}
                </Text>
                {item.descuento_ofrecido > 0 && (
                  <Text type='secondary' delete>
                    {formatPrice(
                      item.precio_ofrecido *
                        toPercent(100 + item.iva) *
                        item.cantidad
                    )}
                  </Text>
                )}
              </Space>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default OrderProductsList;
