import { List, Space, Typography } from 'antd';
import Heading from 'components/UI/Heading';

const { Text } = Typography;

const ProductDetails = ({ especificaciones }) => {
  return (
    <>
      <Heading title='Especificaciones' />
      <List
        size='small'
        dataSource={especificaciones}
        renderItem={(item) => (
          <List.Item key={item}>
            <Space>
              <Text>◼</Text>
              {item}
            </Space>
          </List.Item>
        )}
      />
    </>
  );
};

export default ProductDetails;
