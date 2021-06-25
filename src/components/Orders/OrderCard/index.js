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
import Text from 'antd/lib/typography/Text';
import { Link } from 'react-router-dom';
import {
  capitalize,
  formatDate,
  formatPrice,
  toPercent,
} from 'utils/functions';
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
              <List
                size='small'
                dataSource={details.productos_solicitados}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          shape='square'
                          src={
                            item.codigo_producto.imagenes.length
                              ? `${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${item.codigo_producto.imagenes[0].directus_files_id}`
                              : undefined
                          }
                        >
                          {item.codigo_producto.titulo[0]}
                        </Avatar>
                      }
                      title={
                        <Link to={`/producto/${item.codigo_producto.codigo}`}>
                          {item.codigo_producto.titulo}
                        </Link>
                      }
                      description={
                        <>
                          <Space>
                            <Text type='secondary'>
                              {item.cantidad} x{' '}
                              {formatPrice(
                                (item.precio_ofrecido -
                                  item.precio_ofrecido *
                                    toPercent(item.descuento_ofrecido)) *
                                  item.cantidad
                              )}
                            </Text>
                            <Text type='danger' delete>
                              {formatPrice(
                                item.precio_ofrecido * item.cantidad
                              )}
                            </Text>
                          </Space>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
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
