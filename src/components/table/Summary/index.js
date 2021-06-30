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
                      calcPrecioVariable(product, nivel) * product.cantidad -
                      (calcPrecioVariable(product, nivel) * product.cantidad -
                        calcPrecioVariable(product, nivel) *
                          product.cantidad *
                          toPercent(product.descuento)) *
                        toPercent(product.iva)
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
                      (product.iva !== 0
                        ? (calcPrecioVariable(product, nivel) *
                            product.cantidad -
                            calcPrecioVariable(product, nivel) *
                              product.cantidad *
                              toPercent(product.descuento)) *
                          toPercent(product.iva)
                        : 0),
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
                      (product.descuento !== 0
                        ? calcPrecioVariable(product, nivel) *
                          product.cantidad *
                          toPercent(product.descuento)
                        : 0),
                    0
                  )
                )
              : formatPrice(0)}
          </Text>
        </Row>
        {type === 'pdv' || (
          <Row justify='space-between'>
            <Text>Envío</Text>
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
                    (calcPrecioVariable(product, nivel) -
                      calcPrecioVariable(product, nivel) *
                        toPercent(product.descuento)) *
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
        disabled={!products?.length}
        loading={buttonLoading ? buttonLoading : false}
      >
        {buttonLabel}
      </Button>
    </Card>
  );
};

export default Summary;
