import { Col, Pagination, Row, Select, Space, Typography } from 'antd';
import Order from 'components/Orders/Order';
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
      <Row justify='space-between'>
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
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <div>
          <Order data={data} />
          <Order data={data} />
          <Order data={data} />
        </div>
        <Pagination defaultCurrent={1} total={50} />
      </Space>
    </>
  );
};

export default Orders;
