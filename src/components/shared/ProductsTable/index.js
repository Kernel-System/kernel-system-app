import { MinusSquareOutlined } from '@ant-design/icons';
import { Button, Image, InputNumber, Table, Typography } from 'antd';
import Column from 'antd/lib/table/Column';
import { useStoreActions } from 'easy-peasy';
import { Link } from 'react-router-dom';
import { formatPrice, toPercent } from 'utils/functions';
import { calcCantidad, calcPrecioVariable } from 'utils/productos';
const { Paragraph, Text } = Typography;

const ProductsTable = ({
  products,
  loading,
  type = 'carrito',
  removeCartItem,
  nivel,
}) => {
  const addOneToItem = useStoreActions((actions) => actions.cart.addOneToItem);
  const subOneToItem = useStoreActions((actions) => actions.cart.subOneToItem);

  return (
    <Table
      loading={loading}
      dataSource={products}
      pagination={false}
      style={{ marginBottom: '1.714em' }}
      rowKey='codigo'
      scroll={{ x: true }}
      bordered
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
              removeCartItem.mutate(record.codigo);
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
            preview={false}
            placeholder={!!!imagenes.length}
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
        dataIndex='precios_variables'
        render={(_, record) => formatPrice(calcPrecioVariable(record, nivel))}
      />
      <Column
        title='Cantidad'
        dataIndex='cantidad'
        render={(cantidad, record) => (
          <InputNumber
            min={1}
            max={calcCantidad(record)}
            value={cantidad}
            onStep={(_, { type }) => {
              if (type === 'up') {
                addOneToItem(record.codigo);
              } else {
                subOneToItem(record.codigo);
              }
            }}
          />
        )}
      />
      <Column
        title='Subtotal'
        dataIndex='subtotal'
        render={(_, record) => (
          <>
            <Text type='danger' style={{ fontSize: '12px' }}>
              {formatPrice(
                calcPrecioVariable(record, nivel) *
                  toPercent(record.descuento) *
                  record.cantidad -
                  calcPrecioVariable(record, nivel)
              )}
            </Text>
            <Paragraph strong>
              {formatPrice(
                calcPrecioVariable(record, nivel) *
                  toPercent(record.descuento) *
                  record.cantidad
              )}
            </Paragraph>
          </>
        )}
      />
    </Table>
  );
};

export default ProductsTable;
