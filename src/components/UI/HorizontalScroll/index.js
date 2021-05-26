import { Col, Row } from 'antd';
import AddressCard from 'components/shared/AddressCard';

const HorizontalScroll = () => {
  return (
    <Row
      gutter={16}
      wrap={false}
      style={{
        overflow: 'hidden',
        overflowX: 'auto',
        padding: '1em',
        backgroundColor: '#EEE',
      }}
    >
      <Col flex='300px'>
        <AddressCard />
      </Col>
      <Col flex='300px'>
        <AddressCard />
      </Col>
      <Col flex='300px'>
        <AddressCard />
      </Col>
      <Col flex='300px'>
        <AddressCard />
      </Col>
      <Col flex='300px'>
        <AddressCard />
      </Col>
      <Col flex='300px'>
        <AddressCard />
      </Col>
      <Col flex='300px'>
        <AddressCard />
      </Col>
      <Col flex='300px'>
        <AddressCard />
      </Col>
      <Col flex='300px'>
        <AddressCard />
      </Col>
    </Row>
  );
};

export default HorizontalScroll;
