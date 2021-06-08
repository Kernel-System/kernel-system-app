import { Col, Descriptions, Typography } from 'antd';
import { formatPhoneNumber } from 'utils/functions';
const { Title } = Typography;

const ProfileOverview = ({ admid }) => {
  return (
    <>
      <Col xs={24} lg={12}>
        <Descriptions
          title={
            <Title level={5} style={{ marginBottom: 0 }}>
              Información de contacto
            </Title>
          }
          bordered
          size='small'
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
          labelStyle={{ fontWeight: 500 }}
        >
          <Descriptions.Item label='Nombre'>
            {admid.empleado.nombre}
          </Descriptions.Item>
          <Descriptions.Item label='Correo electrónico'>
            {admid.correo}
          </Descriptions.Item>
          <Descriptions.Item label='Número telefónico'>
            {formatPhoneNumber(admid.empleado.telefono)}
          </Descriptions.Item>
          <Descriptions.Item label='RFC'>
            {formatPhoneNumber(admid.empleado.rfc)}
          </Descriptions.Item>
        </Descriptions>
      </Col>
    </>
  );
};

export default ProfileOverview;
