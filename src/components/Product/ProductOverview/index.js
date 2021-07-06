import { ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Form, InputNumber, Space, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { formatDate, formatPrice, toPercent } from 'utils/functions';
import { calcCantidad, calcPrecioVariable } from 'utils/productos';
const { Title, Paragraph, Text } = Typography;

const ProductOverview = ({ product, addToCart, isAuth, nivel, cartItems }) => {
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
          {formatPrice(
            calcPrecioVariable(product, nivel) *
              toPercent(100 - product.descuento)
          )}
        </Title>
        {product.descuento > 0 && (
          <Paragraph type={'secondary'} delete>
            {formatPrice(calcPrecioVariable(product, nivel))}
          </Paragraph>
        )}
        <Text strong>IVA NO INCLUIDO</Text>
      </Space>
      <Paragraph type='secondary'>
        Precios y disponibilidad válidos en tienda en línea La Paz, Baja
        California Sur al {formatDate(new Date())}, sujetos a cambio sin previo
        aviso.
      </Paragraph>
      <Paragraph>
        Disponibles:{' '}
        <Text
          type={
            calcCantidad(product) <= 5
              ? 'danger'
              : calcCantidad(product) <= 10
              ? 'warning'
              : 'success'
          }
          strong
        >
          {calcCantidad(product)}
        </Text>
      </Paragraph>
      {calcCantidad(product) === 0 ? (
        <Button type='primary' disabled>
          Producto agotado
        </Button>
      ) : isAuth ? (
        <Space>
          <Form
            name='addToCartForm'
            layout='inline'
            initialValues={{ quantity: 1 }}
            onFinish={addToCart}
          >
            <Form.Item name='quantity'>
              <InputNumber min={1} max={calcCantidad(product)} keyboard />
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                disabled={
                  cartItems.find((item) => item.id === product.codigo)
                    ?.quantity >= calcCantidad(product)
                    ? true
                    : false
                }
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
