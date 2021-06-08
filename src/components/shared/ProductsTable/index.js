import { MinusSquareOutlined } from '@ant-design/icons';
import { Button, Image, InputNumber, Table } from 'antd';
import Column from 'antd/lib/table/Column';
import { useStoreActions } from 'easy-peasy';
import { focusManager, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { formatPrice, toPercent } from 'utils/functions';

const ProductsTable = ({ products, loading, type = 'carrito' }) => {
  const addOneToItem = useStoreActions((actions) => actions.cart.addOneToItem);
  const subOneToItem = useStoreActions((actions) => actions.cart.subOneToItem);
  const removeCartItem = useStoreActions(
    (actions) => actions.cart.removeCartItem
  );
  const queryClient = useQueryClient();

  return (
    <Table
      loading={loading}
      dataSource={products}
      pagination={false}
      style={{ marginBottom: '1.714em' }}
      rowKey='codigo'
      scroll={{ x: true }}
    >
      <Column
        title=''
        key='action'
        render={(_, record) => (
          <Button
            icon={<MinusSquareOutlined />}
            type='link'
            danger
            onClick={() => {
              removeCartItem(record.codigo);
              focusManager.setFocused(true);
              queryClient
                .invalidateQueries('cart-items')
                .then(() => focusManager.setFocused(false));
            }}
          />
        )}
      />
      <Column
        title='Imagen'
        dataIndex='imagenes'
        render={(imagenes) => (
          <Image
            width={50}
            height={50}
            src={
              imagenes.length
                ? `${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${imagenes[0].directus_files_id}`
                : undefined
            }
            fallback='https://st4.depositphotos.com/17828278/24401/v/600/depositphotos_244011872-stock-illustration-no-image-vector-symbol-missing.jpg'
            preview={false}
          />
        )}
      />
      <Column
        title='Nombre'
        dataIndex='titulo'
        render={(titulo, record) => (
          <Link to={`/producto/${record.codigo}`}>{titulo}</Link>
        )}
      />
      <Column
        title='Descuento(%)'
        dataIndex='descuento'
        render={(descuento) =>
          type === 'venta' ? (
            <InputNumber min={0} max={100} value={descuento} />
          ) : (
            `${descuento.toFixed(2)}%`
          )
        }
      />
      <Column
        title='Precio Unitario'
        dataIndex='costo'
        render={(costo, record) =>
          formatPrice(costo * toPercent(record.descuento))
        }
      />
      <Column
        title='Cantidad'
        dataIndex='cantidad'
        render={(cantidad, record) => (
          <InputNumber
            min={1}
            max={99}
            value={cantidad}
            onStep={(_, { type }) => {
              if (type === 'up') {
                addOneToItem(record.codigo);
              } else {
                subOneToItem(record.codigo);
              }
              focusManager.setFocused(true);
              queryClient
                .invalidateQueries('cart-items')
                .then(() => focusManager.setFocused(false));
            }}
          />
        )}
      />
      <Column
        title='Subtotal'
        dataIndex='subtotal'
        render={(_, record) => (
          <strong>
            {formatPrice(
              record.costo * toPercent(record.descuento) * record.cantidad
            )}
          </strong>
        )}
      />
    </Table>
  );
};

export default ProductsTable;
