import { List, Space, Typography } from 'antd';
import Heading from 'components/UI/Heading';

const { Text } = Typography;

const ProductDetails = ({ especificaciones }) => {
  const newEspecificaciones = especificaciones.filter(
    (especificacion) => especificacion !== null
  );

  return (
    <>
      <Heading title='Especificaciones' />
      <List
        size='small'
        dataSource={newEspecificaciones}
        renderItem={(item) => {
          if (item !== null || item !== undefined) {
            return (
              <List.Item key={item}>
                <Space>
                  <Text>◼</Text>
                  {item}
                </Space>
              </List.Item>
            );
          } else {
            return;
          }
        }}
      />
    </>
  );
};

export default ProductDetails;
