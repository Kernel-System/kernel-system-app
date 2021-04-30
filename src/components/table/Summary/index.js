import './styles.css';
import { Card, Button, Typography } from 'antd';
const { Text } = Typography;

const Index = ({ list }) => {
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
    <div className='site-card-border-less-wrapper'>
      <Card style={{ width: 300, position: 'absolute', bottom: 10, right: 10 }}>
        <Text style={{ float: 'left' }}>Subtotal</Text>
        <Text style={{ float: 'right' }}>
          {lista.reduce(
            (total, product) => total + product.precio * product.cantidad,
            0
          )}
        </Text>
        <br />
        <Text style={{ float: 'left' }}>Descuento</Text>
        <Text style={{ float: 'right' }}>
          {lista.reduce(
            (total, product) =>
              total +
              (product.descuento !== 0
                ? product.precio * product.cantidad * (product.descuento / 100)
                : 0),
            0
          )}
        </Text>
        <br />
        <Text style={{ float: 'left' }}>IVA</Text>
        <Text style={{ float: 'right' }}>
          {lista.reduce(
            (total, product) =>
              total +
              (product.iva !== 0
                ? product.precio *
                  product.cantidad *
                  ((100 - product.descuento) / 100) *
                  (product.iva / 100)
                : 0),
            0
          )}
        </Text>
        <br />
        <Text style={{ float: 'left' }}>Envío</Text>
        <Text style={{ float: 'right' }}>0</Text>
        <br />
        <Text strong style={{ float: 'left' }}>
          Total
        </Text>
        <Text strong style={{ float: 'right' }}>
          {lista.reduce(
            (total, product) =>
              total +
              product.precio *
                product.cantidad *
                ((100 - product.descuento) / 100) *
                ((100 + product.iva) / 100),
            0
          )}
        </Text>
        <br />
        <br />
        <Button
          type='primary'
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          SOLICITAR ORDEN DE COMPRA
        </Button>
      </Card>
    </div>
  );
};

export default Index;
