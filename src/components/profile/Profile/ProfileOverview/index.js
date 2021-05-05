import { Col, Descriptions, Typography } from 'antd';
const { Title } = Typography;

const ProfileOverview = () => {
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
            Edson David Puente Guerrero
          </Descriptions.Item>
          <Descriptions.Item label='Correo electrónico'>
            johndoe@email.com
          </Descriptions.Item>
          <Descriptions.Item label='Número telefónico'>
            (612) 323-1267
          </Descriptions.Item>
          <Descriptions.Item label='Número telefónico 2'>
            (664) 420-6901
          </Descriptions.Item>
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
          <Descriptions.Item label='Razón social'>
            El Clavo S. de R.L. de C.V.
          </Descriptions.Item>
          <Descriptions.Item label='RFC'>CFE000814QH8</Descriptions.Item>
        </Descriptions>
      </Col>
    </>
  );
};

export default ProfileOverview;
