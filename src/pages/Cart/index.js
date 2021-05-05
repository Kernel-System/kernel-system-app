import { Button, Card, Col, Radio, Row, Space, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Heading from 'components/UI/Heading';
import { useState } from 'react';
const { Paragraph } = Typography;

const Cart = () => {
  const [tipoEntrega, setTipoEntrega] = useState(0);
  const [envio, setEnvio] = useState(0);
  const [metodoPago, setMetodoPago] = useState(0);
  const [formaPago, setFormaPago] = useState(0);

  return (
    <>
      <Heading title='Lista de compra' />
      <Button danger icon={<DeleteOutlined />}>
        Vaciar Lista
      </Button>
      TABLE
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={6}>
          <Card size='small' title='Tipo de entrega'>
            <Space direction='vertical'>
              <div>
                <Paragraph type='secondary'>Elija una opción</Paragraph>
                <Radio.Group
                  defaultValue={tipoEntrega}
                  onChange={(e) => setTipoEntrega(e.target.value)}
                >
                  <Space direction='vertical'>
                    <Radio value={0}>A domicilio</Radio>
                    <Radio value={1}>
                      Recoger en una sucursal Kernel System
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
              {tipoEntrega === 0 && (
                <div>
                  <Paragraph type='secondary'>Envío</Paragraph>
                  <Radio.Group
                    defaultValue={envio}
                    onChange={(e) => setEnvio(e.target.value)}
                  >
                    <Space direction='vertical'>
                      <Radio value={0}>$100.00 (Fedex)</Radio>
                    </Space>
                  </Radio.Group>
                </div>
              )}
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card size='small' title='Método de pago'>
            <Paragraph type='secondary'>Elija una opción</Paragraph>
            <Radio.Group
              defaultValue={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
            >
              <Space direction='vertical'>
                <Radio value={0}>Pagar en linea</Radio>
                <Radio value={1}>Pagar en sucursal</Radio>
              </Space>
            </Radio.Group>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card size='small' title='Forma de pago'>
            <Paragraph type='secondary'>Elija una opción</Paragraph>
            <Radio.Group
              defaultValue={formaPago}
              onChange={(e) => setFormaPago(e.target.value)}
            >
              <Space direction='vertical'>
                <Radio value={0}>Pago en una exhibición</Radio>
                <Radio value={1}>Pago en parcialidades</Radio>
              </Space>
            </Radio.Group>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          SUMMARY
        </Col>
      </Row>
    </>
  );
};

export default Cart;
