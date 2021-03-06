import { Button, Card, Divider, Row, Space, Typography } from 'antd';
import { formatPrice, toPercent } from 'utils/functions';
import { calcPrecioVariable } from 'utils/productos';
const { Title, Text } = Typography;

const Summary = ({
  products,
  buttonLabel,
  buttonAction,
  buttonLoading,
  nivel,
  type,
}) => {
  return (
    <Card>
      <Space direction='vertical' style={{ width: '100%' }} size='middle'>
        <Row justify='space-between'>
          <Text>Subtotal</Text>
          <Text>
            {products
              ? formatPrice(
                  products.reduce((total, product) => {
                    return (
                      total +
                      (product.tipo_de_venta === 'Servicio'
                        ? product.precio_fijo
                        : calcPrecioVariable(product, nivel)) *
                        product.cantidad
                    );
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
                      ((product.tipo_de_venta === 'Servicio'
                        ? product.precio_fijo
                        : calcPrecioVariable(product, nivel)) *
                        product.cantidad -
                        (product.tipo_de_venta === 'Servicio'
                          ? product.precio_fijo
                          : calcPrecioVariable(product, nivel)) *
                          product.cantidad *
                          toPercent(product.descuento)) *
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
                      calcPrecioVariable(product, nivel) *
                        product.cantidad *
                        toPercent(product.descuento),
                    0
                  )
                )
              : formatPrice(0)}
          </Text>
        </Row>
        {type === 'pdv' || (
          <Row justify='space-between'>
            <Text>Env??o</Text>
            <Text>{formatPrice(0)}</Text>
          </Row>
        )}
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
                    (product.tipo_de_venta === 'Servicio'
                      ? product.precio_fijo
                      : calcPrecioVariable(product, nivel)) *
                      toPercent(100 - product.descuento) *
                      toPercent(100 + product.iva) *
                      product.cantidad,
                  0
                )
              )
            : formatPrice(0)}
        </Title>
      </Row>
      <Divider />
      <Button
        type='primary'
        block
        onClick={buttonAction}
        disabled={!products?.length || buttonLoading}
        loading={buttonLoading ? buttonLoading : false}
      >
        {buttonLabel}
      </Button>
    </Card>
  );
};

export default Summary;
