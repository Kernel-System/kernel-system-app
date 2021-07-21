import { Card, Divider, Row, Space, Typography } from 'antd';
import { formatPrice, toPercent } from 'utils/functions';
const { Title, Text } = Typography;

const SolicitudDeCompraSummary = ({ products }) => {
  return (
    <Card>
      <Space direction='vertical' style={{ width: '100%' }} size='middle'>
        <Row justify='space-between'>
          <Text>Subtotal</Text>
          <Text>
            {products
              ? formatPrice(
                  products.reduce((total, product) => {
                    return total + product.precio_ofrecido * product.cantidad;
                  }, 0)
                )
              : formatPrice(0)}
          </Text>
        </Row>
        <Row justify='space-between'>
          <Text>IVA</Text>
          <Text>
            {products
              ? formatPrice(
                  products.reduce(
                    (total, product) =>
                      total +
                      (product.precio_ofrecido * product.cantidad -
                        product.precio_ofrecido *
                          product.cantidad *
                          toPercent(product.descuento_ofrecido)) *
                        toPercent(product.iva),
                    0
                  )
                )
              : formatPrice(0)}
          </Text>
        </Row>
        <Row justify='space-between'>
          <Text>Descuento</Text>
          <Text>
            -
            {products
              ? formatPrice(
                  products.reduce(
                    (total, product) =>
                      total +
                      product.precio_ofrecido *
                        product.cantidad *
                        toPercent(product.descuento_ofrecido),

                    0
                  )
                )
              : formatPrice(0)}
          </Text>
        </Row>
      </Space>
      <Divider />
      <Row justify='space-between'>
        <Title level={4} style={{ margin: 0 }}>
          Total
        </Title>
        <Title level={4} style={{ margin: 0 }}>
          {products
            ? formatPrice(
                products.reduce(
                  (total, product) =>
                    total +
                    product.precio_ofrecido *
                      toPercent(100 - product.descuento_ofrecido) *
                      toPercent(100 + product.iva) *
                      product.cantidad,
                  0
                )
              )
            : formatPrice(0)}
        </Title>
      </Row>
    </Card>
  );
};

export default SolicitudDeCompraSummary;
