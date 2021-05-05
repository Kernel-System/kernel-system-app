import { Col, Divider, Row } from 'antd';
import AssignAddressCard from 'components/shared/AssignAddressCard';
import ProfileOverview from 'components/profile/Profile/ProfileOverview';
import Heading from 'components/UI/Heading';

const Profile = () => {
  return (
    <>
      <Heading title='Mi perfil' extra='No. de cliente: 234765' />
      <Row gutter={[24, 24]}>
        <ProfileOverview />
      </Row>
      <Divider />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <AssignAddressCard tipo='envío' />
        </Col>
        <Col xs={24} md={12}>
          <AssignAddressCard tipo='facturación' />
        </Col>
      </Row>
    </>
  );
};

export default Profile;
