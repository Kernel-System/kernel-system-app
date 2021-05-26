import { Image, InputNumber, Table } from 'antd';
import Column from 'antd/lib/table/Column';
import { Link } from 'react-router-dom';
import { formatPrice } from 'utils/functions';

const data = [
  {
    key: '1',
    image:
      'https://www.dentalmex.mx/wp-content/uploads/2019/04/Temp-Bond-cemento-temporal-de-Kerr.jpg',
    name: 'DentalMex TEMP BOND BASE DE 50G /CATALIZADOR DE 15G. KERR',
    discount: 10,
    price: 750,
    quantity: 5,
  },
  {
    key: '2',
    image:
      'https://www.dentalmex.mx/wp-content/uploads/2019/04/Temp-Bond-cemento-temporal-de-Kerr.jpg',
    name: 'DentalMex TEMP BOND BASE DE 50G /CATALIZADOR DE 15G. KERR',
    discount: 0,
    price: 700,
    quantity: 2,
  },
  {
    key: '3',
    image:
      'https://www.dentalmex.mx/wp-content/uploads/2019/04/Temp-Bond-cemento-temporal-de-Kerr.jpg',
    name: 'DentalMex TEMP BOND BASE DE 50G /CATALIZADOR DE 15G. KERR',
    discount: 30,
    price: 75,
    quantity: 10,
  },
];

const ProductsTable = ({ tipo = 'venta' }) => {
  return (
    <Table
      dataSource={data}
      pagination={false}
      style={{ marginBottom: '1.714em' }}
      scroll={{ x: true }}
    >
      <Column
        title='Imagen'
        key='image'
        dataIndex='image'
        render={(image) => (
          <Image width={50} height={50} src={image} preview={false} />
        )}
      />
      <Column
        title='Nombre'
        key='name'
        dataIndex='name'
        render={(text, record) => (
          <Link to={`/producto/${record.key}`}>{text}</Link>
        )}
      />
      <Column
        title='Descuento'
        key='discount'
        dataIndex='discount'
        render={(discount) =>
          tipo === 'venta' ? (
            <InputNumber min={0} max={100} value={discount} />
          ) : (
            `${discount}%`
          )
        }
      />
      <Column
        title='Precio Unitario'
        key='price'
        dataIndex='price'
        render={(price) => formatPrice(price)}
      />
      <Column
        title='Precio Unitario'
        key='price'
        dataIndex='price'
        render={(price) => formatPrice(price)}
      />
      <Column
        title='Cantidad'
        key='quantity'
        dataIndex='quantity'
        render={(quantity) => <InputNumber min={1} max={99} value={quantity} />}
      />
      <Column
        title='Subtotal'
        key='subtotal'
        render={(_, record) => (
          <strong>{formatPrice(record.price * record.quantity)}</strong>
        )}
      />
    </Table>
  );
};

export default ProductsTable;
