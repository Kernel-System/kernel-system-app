import { Col, Descriptions, Typography } from 'antd';
import { formatPhoneNumber } from 'utils/functions';
const { Title } = Typography;

const EmpleadoProfileOverview = ({ employee }) => {
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
            {employee.nombre} {employee.apellidos}
          </Descriptions.Item>
          <Descriptions.Item label='Correo electrónico'>
            {employee.correo}
          </Descriptions.Item>
          <Descriptions.Item label='Número telefónico'>
            {formatPhoneNumber(employee.empleado.telefono)}
          </Descriptions.Item>
        </Descriptions>
      </Col>
      <Col xs={24} lg={12}>
        <Descriptions
          title={
            <Title level={5} style={{ marginBottom: 0 }}>
              Información adicional
            </Title>
          }
          bordered
          size='small'
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
          labelStyle={{ fontWeight: 500 }}
        >
          <Descriptions.Item label='No. Seguro social'>
            {employee.empleado.no_seguro_social}
          </Descriptions.Item>
          <Descriptions.Item label='RFC'>
            {employee.empleado.rfc}
          </Descriptions.Item>
        </Descriptions>
      </Col>
    </>
  );
};

export default EmpleadoProfileOverview;
