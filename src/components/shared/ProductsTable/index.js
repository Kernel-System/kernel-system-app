import { MinusSquareOutlined } from '@ant-design/icons';
import { Button, Image, InputNumber, Space, Table, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { formatPrice, toPercent } from 'utils/functions';
import { calcCantidad, calcPrecioVariable } from 'utils/productos';
const { Text } = Typography;

const ProductsTable = ({
  products,
  loading,
  type = 'carrito',
  removeItem,
  nivel,
  addOneToItem,
  subOneToItem,
  addOneDiscountToItem,
  subOneDiscountToItem,
  addOnePriceToItem,
  subOnePriceToItem,
  setQuantityToItem,
}) => (
  <Table
    loading={loading}
    dataSource={products}
    pagination={false}
    style={{ marginBottom: '1.714em', maxHeight: '500px' }}
    rowKey='codigo'
    scroll={{ x: true }}
    bordered
  >
    <Table.Column
      title=''
      key='action'
      render={(_, record) => (
        <Button
          icon={<MinusSquareOutlined />}
          type='link'
          danger
          onClick={() => {
            if (removeItem.mutate) {
              removeItem.mutate(record.codigo);
            } else {
              removeItem(record.codigo);
            }
          }}
        />
      )}
    />
    <Table.Column
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
    <Table.Column
      title='Nombre'
      dataIndex='titulo'
      render={(titulo, record) =>
        type === 'venta' ? (
          titulo
        ) : (
          <Link to={`/producto/${record.codigo}`}>{titulo}</Link>
        )
      }
    />
    <Table.Column
      title='Descuento(%)'
      dataIndex='descuento'
      render={(descuento, record) =>
        type === 'venta' ? (
          <InputNumber
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace('%', '')}
            min={0}
            max={100}
            value={descuento}
            disabled={record.tipo_de_venta === 'Servicio'}
            onStep={(_, { type }) => {
              if (type === 'up') {
                addOneDiscountToItem(record.codigo);
              } else {
                subOneDiscountToItem(record.codigo);
              }
            }}
          />
        ) : (
          `${descuento.toFixed(2)}%`
        )
      }
    />
    <Table.Column
      title='Precio Unitario(MX$)'
      dataIndex='precios_variables'
      render={(_, record) =>
        record.tipo_de_venta === 'Servicio' ? (
          <Space>
            <Text>MX$</Text>
            <InputNumber
              min={0}
              value={calcPrecioVariable(record, nivel)}
              onStep={(_, { type }) => {
                if (type === 'up') {
                  addOnePriceToItem(record.codigo);
                } else {
                  subOnePriceToItem(record.codigo);
                }
              }}
            />
          </Space>
        ) : (
          formatPrice(calcPrecioVariable(record, nivel))
        )
      }
    />
    <Table.Column
      title='Cantidad'
      dataIndex='cantidad'
      render={(cantidad, record) => (
        <>
          {record.tipo_de_venta !== 'Servicio' && (
            <Text
              style={{
                fontSize: '12px',
                position: 'absolute',
                top: 9,
              }}
            >
              Stock: {calcCantidad(record)}
            </Text>
          )}
          <InputNumber
            min={1}
            max={
              record.tipo_de_venta === 'Servicio' ? 999 : calcCantidad(record)
            }
            value={cantidad}
            onStep={(_, { type }) => {
              if (type === 'up') {
                addOneToItem(record.codigo);
              } else {
                subOneToItem(record.codigo);
              }
            }}
            onBlur={({ target: { value } }) =>
              setQuantityToItem(record.codigo, value)
            }
          />
        </>
      )}
    />
    <Table.Column
      title='Subtotal'
      dataIndex='subtotal'
      render={(_, record) => (
        <>
          <Text
            type='danger'
            style={{ fontSize: '12px', position: 'absolute', top: 16 }}
          >
            -
            {formatPrice(
              calcPrecioVariable(record, nivel) *
                toPercent(record.descuento) *
                record.cantidad
            )}
          </Text>
          <Text strong>
            {formatPrice(
              calcPrecioVariable(record, nivel) * record.cantidad -
                calcPrecioVariable(record, nivel) *
                  record.cantidad *
                  toPercent(record.descuento)
            )}
          </Text>
        </>
      )}
    />
  </Table>
);
export default ProductsTable;
