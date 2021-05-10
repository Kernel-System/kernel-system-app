import {
  AutoComplete,
  Button,
  Card,
  Col,
  Divider,
  Typography,
  InputNumber,
  Radio,
  Row,
  Space,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import Summary from 'components/table/Summary';
import Heading from 'components/UI/Heading';
import { useState } from 'react';
const { Paragraph } = Typography;

const options = [
  { value: 'light', label: 'Light' },
  { value: 'bamboo', label: 'Bamboo' },
];

const PuntoDeVenta = () => {
  const breakpoint = useBreakpoint();
  const [tipoEntrega, setTipoEntrega] = useState(0);
  const [metodoPago, setMetodoPago] = useState(0);
  const [formaPago, setFormaPago] = useState(0);

  const onSelect = (value) => console.log(value);

  return (
    <>
      <Heading title='Punto de venta' />
      <Space direction='vertical' style={{ width: '100%' }}>
        <Row gutter={[8, 8]}>
          <Col xs={24} md={18} lg={20}>
            <AutoComplete
              style={{ width: '100%' }}
              options={options}
              placeholder='Buscar producto por nombre o código'
              onSelect={onSelect}
              allowClear
            />
          </Col>
          <Col xs={24} md={6} lg={4}>
            <Button block icon={<PlusOutlined />}>
              Agregar producto
            </Button>
          </Col>
        </Row>
        {!breakpoint.md && <Divider />}
        <Row gutter={[8, 8]}>
          <Col xs={24} md={12} lg={16}>
            <AutoComplete
              style={{ width: '100%' }}
              options={options}
              placeholder='Buscar servicio por nombre'
              onSelect={onSelect}
              allowClear
            />
          </Col>
          <Col xs={24} md={6} lg={4}>
            <InputNumber placeholder='Precio' style={{ width: '100%' }} />
          </Col>
          <Col xs={24} md={6} lg={4}>
            <Button block icon={<PlusOutlined />}>
              Agregar servicio
            </Button>
          </Col>
        </Row>
        <div>TABLA</div>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} lg={6}>
            <Card size='small' title='Factura'>
              <Space direction='vertical'>
                <div>
                  <Paragraph type='secondary'>Elija una opción</Paragraph>
                  <Radio.Group
                    defaultValue={tipoEntrega}
                    onChange={(e) => setTipoEntrega(e.target.value)}
                  >
                    <Space direction='vertical'>
                      <Radio value={0}>Ticket</Radio>
                      <Radio value={1}>Factura </Radio>
                    </Space>
                  </Radio.Group>
                </div>
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
            <Summary />
            <br />
            <Button type='link' block>
              Generar cotización
            </Button>
          </Col>
        </Row>
      </Space>
    </>
  );
};

export default PuntoDeVenta;
