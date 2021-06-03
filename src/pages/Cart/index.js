import { DeleteFilled } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  message,
  Popconfirm,
  Radio,
  Row,
  Space,
  Typography,
} from 'antd';
import { getCartProducts } from 'api/shared/products';
import ProductsTable from 'components/shared/ProductsTable';
import Summary from 'components/table/Summary';
import Heading from 'components/UI/Heading';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useState } from 'react';
import { useQuery } from 'react-query';
const { Paragraph } = Typography;

const Cart = () => {
  const cartItems = useStoreState((state) => state.cart.cartItems);
  const clearCartItems = useStoreActions(
    (actions) => actions.cart.clearCartItems
  );
  const { data, isLoading } = useQuery('cart-items', () =>
    getCartProducts(cartItems)
  );
  const [tipoEntrega, setTipoEntrega] = useState(0);
  const [envio, setEnvio] = useState(0);
  const [metodoPago, setMetodoPago] = useState(0);
  const [formaPago, setFormaPago] = useState(0);

  return (
    <>
      <Heading title='Lista de compra' />
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Popconfirm
            title='¿Está seguro que quiere vaciar su lista de compra?'
            placement='topLeft'
            onConfirm={() => {
              clearCartItems();
              message.success('Se ha vaciado la lista de compra correctamente');
            }}
            okText='Vaciar lista'
            okType='danger'
            cancelText='Cancelar'
          >
            <Button danger icon={<DeleteFilled />}>
              Vaciar Lista
            </Button>
          </Popconfirm>
        </Col>
        <Col xs={24}>
          <ProductsTable products={data} loading={isLoading} type='carrito' />
        </Col>
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
          <Summary
            products={data}
            buttonLabel='Solicitar orden de compra'
            buttonAction={() => console.log('Haciendo orden de compra')}
          />
        </Col>
      </Row>
    </>
  );
};

export default Cart;
