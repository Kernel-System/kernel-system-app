import { ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Form, InputNumber, Space, Typography } from 'antd';
import { formatPrice } from 'utils/functions';
const { Title, Paragraph, Text } = Typography;

const ProductOverview = ({ product, addToCart, isAuth }) => {
  return (
    <>
      <Paragraph style={{ marginBottom: 0 }}>
        {product.category.toUpperCase()}
      </Paragraph>
      <Title level={2} style={{ marginTop: 0 }}>
        {product.title}
      </Title>
      <Paragraph type='secondary'>SKU#{product.id}</Paragraph>
      <Paragraph>{product.description}</Paragraph>
      <Space align='center'>
        <Title level={2}>
          {formatPrice(product.price * 0.5 /*descuento*/)}
        </Title>
        <Paragraph type={'secondary'} delete>
          {formatPrice(product.price)}
        </Paragraph>
      </Space>
      <Paragraph type='secondary'>
        Precios y disponibilidad válidos en tienda en línea La Paz, Baja
        California Sur al 10 Mar 2021, sujetos a cambio sin previo aviso.
      </Paragraph>
      <Paragraph>
        Disponibles: <Text type='success'>100</Text>
      </Paragraph>
      {isAuth ? (
        <Space>
          <Form
            name='addToCartForm'
            layout='inline'
            initialValues={{ quantity: 1 }}
            onFinish={addToCart}
          >
            <Form.Item name='quantity'>
              <InputNumber min={1} max={99} keyboard />
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                icon={<ShoppingCartOutlined />}
              >
                Añadir a la lista
              </Button>
            </Form.Item>
          </Form>
        </Space>
      ) : (
        <Button type='primary'>Date de alta para comenzar a comprar!</Button>
      )}
    </>
  );
};

export default ProductOverview;
