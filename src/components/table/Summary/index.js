import { Button, Card, Divider, Row, Typography } from 'antd';
import { formatPrice, toPercent } from 'utils/functions';
import { calcPrecioVariable } from 'utils/productos';
const { Title, Paragraph, Text } = Typography;

const Summary = ({ products, buttonLabel, buttonAction, nivel }) => {
  return (
    <Card>
      <Row justify='space-between'>
        <Paragraph>Subtotal</Paragraph>
        <Paragraph>
          {products &&
            formatPrice(
              products.reduce((total, product) => {
                return (
                  total + calcPrecioVariable(product, nivel) * product.cantidad
                );
              }, 0)
            )}
        </Paragraph>
      </Row>
      <Row justify='space-between'>
        <Paragraph>IVA</Paragraph>
        <Paragraph>
          {products &&
            formatPrice(
              products.reduce(
                (total, product) =>
                  total +
                  (product.iva !== 0
                    ? calcPrecioVariable(product, nivel) *
                      product.cantidad *
                      toPercent(product.descuento) *
                      (product.iva / 100)
                    : 0),
                0
              )
            )}
        </Paragraph>
      </Row>
      <Row justify='space-between'>
        <Paragraph>Descuento</Paragraph>
        <Paragraph>
          -
          {products &&
            formatPrice(
              products.reduce(
                (total, product) =>
                  total +
                  (product.descuento !== 0
                    ? calcPrecioVariable(product, nivel) *
                      product.cantidad *
                      (product.descuento / 100)
                    : 0),
                0
              )
            )}
        </Paragraph>
      </Row>
      <Row justify='space-between'>
        <Text>Envío</Text>
        <Text>{formatPrice(0)}</Text>
      </Row>
      <Divider />
      <Row justify='space-between'>
        <Title level={4} style={{ margin: 0 }}>
          Total
        </Title>
        <Title level={4} style={{ margin: 0 }}>
          {products &&
            formatPrice(
              products.reduce(
                (total, product) =>
                  total +
                  calcPrecioVariable(product, nivel) *
                    product.cantidad *
                    toPercent(product.descuento) *
                    ((100 + product.iva) / 100),
                0
              )
            )}
        </Title>
      </Row>
      <Divider />
      <Button type='primary' block onClick={buttonAction}>
        {buttonLabel}
      </Button>
    </Card>
  );
};

export default Summary;
