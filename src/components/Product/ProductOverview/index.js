import { ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Form, InputNumber, Space, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { formatPrice, toPercent } from 'utils/functions';
const { Title, Paragraph, Text } = Typography;

const ProductOverview = ({ product, addToCart, isAuth }) => {
  const cantidad = product.inventario.reduce(
    (acc, product) => acc + product.cantidad,
    0
  );

  return (
    <>
      {product.categorias.map((categoria, i) => (
        <Tag
          key={categoria.categorias_id.nombre}
          style={{ marginBottom: '0.5rem' }}
        >
          <Link
            to={`/c/${categoria.categorias_id.nombre.toLowerCase()}`}
            component={Typography.Link}
          >
            {categoria.categorias_id.nombre.toUpperCase()}
          </Link>
        </Tag>
      ))}
      <Title level={3} style={{ marginBottom: 0 }}>
        {product.titulo}
      </Title>
      <Paragraph type='secondary'>SKU#{product.sku}</Paragraph>
      <Paragraph>{product.descripcion}</Paragraph>
      <Space align='end'>
        <Title level={2} style={{ display: 'inline-block', marginBottom: 0 }}>
          {formatPrice(product.costo * toPercent(product.descuento))}
        </Title>
        {product.descuento > 0 && (
          <Paragraph type={'secondary'} delete>
            {formatPrice(product.costo)}
          </Paragraph>
        )}
      </Space>
      <Paragraph type='secondary'>
        Precios y disponibilidad válidos en tienda en línea La Paz, Baja
        California Sur al 10 Mar 2021, sujetos a cambio sin previo aviso.
      </Paragraph>
      <Paragraph>
        Disponibles:{' '}
        <Text
          type={
            cantidad <= 5 ? 'danger' : cantidad <= 10 ? 'warning' : 'success'
          }
        >
          {cantidad}
        </Text>
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
        <Link to='/iniciar-sesion'>
          <Button type='primary'>Date de alta para comenzar a comprar!</Button>
        </Link>
      )}
    </>
  );
};

export default ProductOverview;
