import { Avatar, List } from 'antd';
import { Link } from 'react-router-dom';
import { formatPrice, toPercent } from 'utils/functions';
import { calcPrecioVariable } from 'utils/productos';

const BoughtProductsList = ({ products, nivel }) => {
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
                src={`${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${item.codigo_producto.imagenes[0].directus_files_id}`}
              />
            }
            title={
              <Link to={`/producto/${item.codigo_producto.codigo}`}>
                {item.codigo_producto.titulo}
              </Link>
            }
            description={
              <>
                {item.cantidad} x
                {formatPrice(
                  calcPrecioVariable(item.codigo_producto, nivel) -
                    calcPrecioVariable(item.codigo_producto, nivel) *
                      toPercent(item.descuento_ofrecido)
                )}
              </>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default BoughtProductsList;
