import { Col, Pagination, Row, Select, Space, Typography } from 'antd';
import Order from 'components/Orders/OrderCard';
import Heading from 'components/UI/Heading';
const { Text } = Typography;

// TEMPORAL
const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

const Orders = () => {
  return (
    <>
      <Heading title='Mis pedidos' />
      <Row justify='space-between' gutter={[16, 16]}>
        <Col>
          <Space>
            <Text>Ordenes realizadas en:</Text>
            <Select defaultValue='2021'>
              <Select.Option value='2021'>2021</Select.Option>
              <Select.Option value='2020'>2020</Select.Option>
              <Select.Option value='2019'>2019</Select.Option>
            </Select>
          </Space>
        </Col>
        <Col>
          <Text>Mostrando 2 de 2 pedidos</Text>
        </Col>
      </Row>
      <Space
        direction='vertical'
        style={{ width: '100%', marginBottom: '1em' }}
      >
        <Order data={data} />
        <Order data={data} />
        <Order data={data} />
      </Space>
      <Pagination defaultCurrent={1} total={50} />
    </>
  );
};

export default Orders;
