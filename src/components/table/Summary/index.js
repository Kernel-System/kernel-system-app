import { Card, Button, Typography, Row, Divider } from 'antd';
import { formatPrice } from 'utils';
const { Title, Paragraph } = Typography;

const Summary = ({ list }) => {
  const lista = [
    {
      nombre: '',
      cantidad: 10,
      precio: 12,
      iva: 16,
      descuento: 10,
    },
    {
      nombre: '',
      cantidad: 5,
      precio: 7,
      iva: 16,
      descuento: 5,
    },
  ];

  return (
    <Card>
      <Row justify='space-between'>
        <Paragraph>Subtotal</Paragraph>
        <Paragraph>
          {formatPrice(
            lista.reduce(
              (total, product) => total + product.precio * product.cantidad,
              0
            )
          )}
        </Paragraph>
      </Row>
      <Row justify='space-between'>
        <Paragraph>IVA</Paragraph>
        <Paragraph>
          {formatPrice(
            lista.reduce(
              (total, product) =>
                total +
                (product.iva !== 0
                  ? product.precio *
                    product.cantidad *
                    ((100 - product.descuento) / 100) *
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
          {formatPrice(
            lista.reduce(
              (total, product) =>
                total +
                (product.descuento !== 0
                  ? product.precio *
                    product.cantidad *
                    (product.descuento / 100)
                  : 0),
              0
            )
          )}
        </Paragraph>
      </Row>
      <Row justify='space-between'>
        <Paragraph>Envío</Paragraph>
        <Paragraph>{formatPrice(0)}</Paragraph>
      </Row>
      {/* <Divider /> */}
      <Row justify='space-between'>
        <Title level={4} style={{ margin: 0 }}>
          Total
        </Title>
        <Title level={4} style={{ margin: 0 }}>
          {formatPrice(
            lista.reduce(
              (total, product) =>
                total +
                product.precio *
                  product.cantidad *
                  ((100 - product.descuento) / 100) *
                  ((100 + product.iva) / 100),
              0
            )
          )}
        </Title>
      </Row>
      <Divider />
      <Button type='primary' block>
        Solicitar orden de compra
      </Button>
    </Card>
  );
};

export default Summary;
