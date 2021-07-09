import {
  Button,
  Card,
  Col,
  Collapse,
  Row,
  Space,
  Statistic,
  Typography,
} from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { Link } from 'react-router-dom';
import { capitalize, formatDate, formatPrice } from 'utils/functions';
import OrderProductsList from '../OrderProductsList';
const { Title } = Typography;

const OrderCard = ({ details }) => {
  const breakpoint = useBreakpoint();

  return (
    <Card
      title={
        <Row justify='space-between' gutter={[16, 16]}>
          <Col>
            <Space
              size='large'
              direction={breakpoint.md ? 'horizontal' : 'vertical'}
            >
              <Statistic
                title='Pedido realizado'
                value={formatDate(details.fecha_solicitud)}
              />
              <Statistic title='Total' value={formatPrice(details.total)} />
            </Space>
          </Col>
          <Col>
            <Statistic
              title='No. pedido'
              style={{ textAlign: 'end' }}
              value={details.id}
            />
          </Col>
        </Row>
      }
    >
      <Row gutter={[24, 24]} align='middle'>
        <Col xs={24} md={19}>
          {/* <Title level={4} style={{ marginBottom: 0 }}>
            Fecha prevista: 20 de mayo
          </Title>
          <Paragraph type='success'>Enviado</Paragraph> */}
          <Title
            level={5}
            strong
            type={
              details.estado === 'aprobada'
                ? 'success'
                : details.estado === 'rechazada'
                ? 'danger'
                : 'secondary'
            }
          >
            {capitalize(details.estado)}
          </Title>
          <Collapse ghost>
            <Collapse.Panel
              header={`Productos ${
                details.estado === 'aprobada' ? 'adquiridos' : 'solicitados'
              }`}
              key='1'
            >
              <OrderProductsList products={details.productos_solicitados} />
            </Collapse.Panel>
          </Collapse>
        </Col>
        <Col xs={24} md={5}>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Link to={`/solicitudes-de-compra/${details.id}?tipo=recoger`}>
              <Button block type='primary'>
                Ver detalles
              </Button>
            </Link>
            {details.estado === 'aprobada' && (
              <Link to='/facturacion?id=1'>
                <Button block>Solicitar factura</Button>
              </Link>
            )}
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default OrderCard;
