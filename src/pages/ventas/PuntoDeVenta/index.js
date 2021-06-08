import { PlusOutlined } from '@ant-design/icons';
import {
  AutoComplete,
  Button,
  Card,
  Col,
  Divider,
  Form,
  InputNumber,
  Radio,
  Row,
  Space,
  Typography,
} from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import ProductsTable from 'components/shared/ProductsTable';
import Summary from 'components/table/Summary';
import Heading from 'components/UI/Heading';
import MetodoPagoModal from 'components/ventas/MetodoPagoModal';
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
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onSelect = (value) => console.log(value);

  return (
    <>
      <Heading title='Punto de venta' />
      <Row gutter={8}>
        <Col xs={24} md={18} lg={20}>
          <Form.Item>
            <AutoComplete
              style={{ width: '100%' }}
              options={options}
              placeholder='Buscar producto por nombre o código'
              onSelect={onSelect}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={6} lg={4}>
          <Form.Item>
            <Button block icon={<PlusOutlined />}>
              Agregar producto
            </Button>
          </Form.Item>
        </Col>
      </Row>
      {!breakpoint.md && <Divider style={{ marginTop: 0 }} />}
      <Row gutter={8}>
        <Col xs={24} md={12} lg={16}>
          <Form.Item>
            <AutoComplete
              style={{ width: '100%' }}
              options={options}
              placeholder='Buscar servicio por nombre'
              onSelect={onSelect}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={6} lg={4}>
          <Form.Item>
            <InputNumber placeholder='Precio' style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={6} lg={4}>
          <Form.Item>
            <Button block icon={<PlusOutlined />}>
              Agregar servicio
            </Button>
          </Form.Item>
        </Col>
      </Row>
      <ProductsTable />
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
          <Summary buttonLabel='Proceder a pagar' buttonAction={showModal} />
          <br />
          <Button type='link' block>
            Generar cotización
          </Button>
        </Col>
      </Row>
      <MetodoPagoModal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </>
  );
};

export default PuntoDeVenta;
