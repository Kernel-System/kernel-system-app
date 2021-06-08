import { Avatar, List, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { formatPrice } from 'utils/functions';
const { Paragraph } = Typography;

const BoughtProductsList = ({ products }) => {
  return (
    <List
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
            description={formatPrice(420)}
          />
          <Paragraph>x {item.cantidad}</Paragraph>
        </List.Item>
      )}
    />
  );
};

export default BoughtProductsList;
