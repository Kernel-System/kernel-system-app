import { Button, Col, Divider, Row, Typography } from 'antd';
import Heading from 'components/UI/Heading';
import AssignAddressCard from 'components/shared/AssignAddressCard';
import AddressesList from 'components/profile/Addresses/AddressesList';
import { Link } from 'react-router-dom';
const { Title } = Typography;

const Addresses = () => {
  return (
    <>
      <Heading title='Mis direcciones' />
      <Title level={5}>Direcciones por defecto</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <AssignAddressCard tipo='envío' />
        </Col>
        <Col xs={24} md={12}>
          <AssignAddressCard tipo='facturación' />
        </Col>
      </Row>
      <Divider />
      <Title level={5}>Direcciones adicionales</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <AddressesList />
        </Col>
        <Col xs={24}>
          <Link to='/direcciones/nueva'>
            <Button type='primary'>Añadir dirección</Button>
          </Link>
        </Col>
      </Row>
    </>
  );
};

export default Addresses;
