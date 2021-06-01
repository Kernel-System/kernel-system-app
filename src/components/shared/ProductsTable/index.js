import { Image, InputNumber, Table } from 'antd';
import Column from 'antd/lib/table/Column';
import { Link } from 'react-router-dom';
import { formatPrice } from 'utils/functions';

const ProductsTable = ({ products, tipo = 'venta' }) => {
  console.log(products);
  return (
    <Table
      loading={products?.length}
      dataSource={products}
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
        dataIndex='title'
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
