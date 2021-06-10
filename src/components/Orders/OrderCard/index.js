import {
  Avatar,
  Button,
  Card,
  Col,
  Collapse,
  List,
  Row,
  Space,
  Statistic,
  Typography,
} from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { Link } from 'react-router-dom';
import { formatDate, formatPrice } from 'utils/functions';
const { Paragraph } = Typography;

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
              <Statistic
                title='Enviar a'
                value={details.id_cliente.razon_social}
              />
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
        <Col xs={24} lg={19}>
          {/* <Title level={4} style={{ marginBottom: 0 }}>
            Fecha prevista: 20 de mayo
          </Title>
          <Paragraph type='success'>Enviado</Paragraph> */}
          <Collapse defaultActiveKey={['1']} ghost>
            <Collapse.Panel header='Productos adquiridos' key='1'>
              <List
                size='small'
                dataSource={details.productos_solicitados}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          shape='square'
                          src={`${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${item.codigo_producto.imagenes[0].directus_files_id}`}
                        />
                      }
                      title={
                        <Link to={`/producto/${item.codigo_producto.codigo}`}>
                          {item.codigo_producto.titulo}
                        </Link>
                      }
                      description={formatPrice(420)}
                    />
                    <Paragraph>x {item.cantidad}</Paragraph>
                  </List.Item>
                )}
              />
            </Collapse.Panel>
          </Collapse>
        </Col>
        <Col xs={24} lg={5}>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Link to={`/solicitudes-de-compra/${details.id}?tipo=recoger`}>
              <Button block type='primary'>
                Ver detalles
              </Button>
            </Link>
            <Button block>Solicitar factura</Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default OrderCard;
