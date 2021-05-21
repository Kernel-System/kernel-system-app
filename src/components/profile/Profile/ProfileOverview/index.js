import { Col, Descriptions, Typography } from 'antd';
import { formatPhoneNumber } from 'utils/functions';
const { Title } = Typography;

const ProfileOverview = ({ user }) => {
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
            {user.nombre} {user.apellidos}
          </Descriptions.Item>
          <Descriptions.Item label='Correo electrónico'>
            {user.correo}
          </Descriptions.Item>
          <Descriptions.Item label='Número telefónico'>
            {formatPhoneNumber(user.cliente.telefono)}
          </Descriptions.Item>
          {user.cliente.telefono_2 && (
            <Descriptions.Item label='Número telefónico 2'>
              {formatPhoneNumber(user.cliente.telefono_2)}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Col>
      <Col xs={24} lg={12}>
        <Descriptions
          title={
            <Title level={5} style={{ marginBottom: 0 }}>
              Información de la empresa
            </Title>
          }
          bordered
          size='small'
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
          labelStyle={{ fontWeight: 500 }}
        >
          <Descriptions.Item label='Nombre Comercial'>
            {user.cliente.nombre_comercial}
          </Descriptions.Item>
          <Descriptions.Item label='Razón social'>
            {user.cliente.razon_social}
          </Descriptions.Item>
          <Descriptions.Item label='RFC'>{user.cliente.rfc}</Descriptions.Item>
        </Descriptions>
      </Col>
    </>
  );
};

export default ProfileOverview;
