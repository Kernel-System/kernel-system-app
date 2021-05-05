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
import { formatPrice } from 'utils';
const { Title, Paragraph } = Typography;

const Order = ({ data }) => {
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
              <Statistic title='Pedido realizado' value='22/03/2021' />
              <Statistic title='Total' value='$420.00' />
              <Statistic title='Enviar a' value='Edson David Puente Guerrero' />
            </Space>
          </Col>
          <Col>
            <Statistic title='No. pedido' value='KS12362' />
          </Col>
        </Row>
      }
    >
      <Row gutter={[24, 24]} align='middle'>
        <Col xs={24} lg={19}>
          <Title level={4} style={{ marginBottom: 0 }}>
            Fecha prevista: 20 de mayo
          </Title>
          <Paragraph type='success'>Enviado</Paragraph>
          <Collapse defaultActiveKey={['1']} ghost>
            <Collapse.Panel header='Productos adquiridos' key='1'>
              <List
                size='small'
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          shape='square'
                          src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                        />
                      }
                      title={<a href='https://ant.design'>{item}</a>}
                      description={formatPrice(420)}
                    />
                    <Paragraph>x1</Paragraph>
                  </List.Item>
                )}
              />
            </Collapse.Panel>
          </Collapse>
        </Col>
        <Col xs={24} lg={5}>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Button block type='primary'>
              Rastrear pedido
            </Button>
            <Button block>Solicitar factura</Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default Order;
