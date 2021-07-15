import { MinusOutlined } from '@ant-design/icons';
import {
  Button,
  Image,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
} from 'antd';
import { Link } from 'react-router-dom';
import { formatPrice, toPercent } from 'utils/functions';
import { calcCantidad, calcPrecioVariable } from 'utils/productos';
const { Text } = Typography;

const ProductsTable = ({
  products,
  loading,
  nivel,
  type = 'carrito',
  removeItem,
  addOneToItem,
  subOneToItem,
  setValueToItem,
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
      align='center'
      title=''
      key='action'
      render={(_, record) => (
        <Popconfirm
          title='¿Está seguro que quiere eliminar el producto?'
          placement='topRight'
          okText='Eliminar'
          okType='danger'
          cancelText='Cancelar'
          onConfirm={() => {
            if (removeItem.mutate) {
              removeItem.mutate(record.codigo);
            } else {
              removeItem(record.codigo);
            }
          }}
        >
          <Button icon={<MinusOutlined />} danger />
        </Popconfirm>
      )}
    />
    <Table.Column
      align='center'
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
      align='right'
      title='Descuento(%)'
      dataIndex='descuento'
      render={(descuento, record) =>
        type === 'venta' ? (
          record.tipo_de_venta === 'Servicio' ? (
            `${descuento.toFixed(2)}%`
          ) : (
            <>
              <InputNumber
                min={0}
                max={100}
                type='number'
                disabled={record.tipo_de_venta === 'Servicio'}
                value={descuento}
                onStep={(_, { type }) => {
                  if (type === 'up') {
                    addOneToItem('descuento', record.codigo);
                  } else {
                    subOneToItem('descuento', record.codigo);
                  }
                }}
                onBlur={({ target: { value } }) => {
                  let newValue;
                  if (value > 100) {
                    newValue = 100;
                  } else if (value < 0 || value === '') {
                    newValue = 0;
                  } else {
                    newValue = Math.ceil(value);
                  }
                  setValueToItem({
                    campo: 'descuento',
                    codigo: record.codigo,
                    valor: newValue,
                  });
                }}
              />
              <Text> %</Text>
            </>
          )
        ) : (
          `${descuento.toFixed(2)}%`
        )
      }
    />
    <Table.Column
      align='right'
      title='Precio Unitario'
      dataIndex='precios_variables'
      render={(_, record) =>
        record.tipo_de_venta === 'Servicio' ? (
          <>
            <Text>$ </Text>
            <InputNumber
              style={{ width: '100px' }}
              min={0}
              type='number'
              precision={2}
              value={calcPrecioVariable(record, nivel)}
              onStep={(_, { type }) => {
                if (type === 'up') {
                  addOneToItem('precio_fijo', record.codigo);
                } else {
                  subOneToItem('precio_fijo', record.codigo);
                }
              }}
              onBlur={({ target: { value } }) => {
                let newValue;
                if (value < 0 || value === '') {
                  newValue = 0;
                } else {
                  newValue = value;
                }
                setValueToItem({
                  campo: 'precio_fijo',
                  codigo: record.codigo,
                  valor: newValue,
                });
              }}
            />
          </>
        ) : (
          formatPrice(calcPrecioVariable(record, nivel))
        )
      }
    />
    <Table.Column
      align='right'
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
                right: '1rem',
              }}
            >
              Disponibles: {calcCantidad(record)}
            </Text>
          )}
          <InputNumber
            min={1}
            max={
              record.tipo_de_venta === 'Servicio' ? 999 : calcCantidad(record)
            }
            type='number'
            value={cantidad}
            onStep={(_, info) => {
              if (type === 'venta') {
                if (info.type === 'up') {
                  addOneToItem('cantidad', record.codigo);
                } else {
                  subOneToItem('cantidad', record.codigo);
                }
              } else {
                if (info.type === 'up') {
                  addOneToItem(record.codigo);
                } else {
                  subOneToItem(record.codigo);
                }
              }
            }}
            required
            onBlur={({ target: { value } }) => {
              let newValue;
              if (value > calcCantidad(record)) {
                newValue = calcCantidad(record);
              } else if (value <= 0 || value === '') {
                newValue = 1;
              } else {
                newValue = Math.ceil(value);
              }
              setValueToItem(
                type === 'venta'
                  ? {
                      campo: 'cantidad',
                      codigo: record.codigo,
                      valor: newValue,
                    }
                  : {
                      id: record.codigo,
                      cantidad: newValue,
                    },
                value
              );
            }}
          />
        </>
      )}
    />
    <Table.Column
      align='right'
      title='Subtotal'
      dataIndex='subtotal'
      render={(_, record) => (
        <>
          <Text strong>
            {formatPrice(calcPrecioVariable(record, nivel) * record.cantidad)}
          </Text>
        </>
      )}
    />
    <Table.Column
      align='right'
      title='Total'
      dataIndex='Total'
      render={(_, record) => (
        <>
          {record.descuento > 0 && (
            <Text
              type='danger'
              style={{
                fontSize: '12px',
                position: 'absolute',
                top: 3,
                right: '1rem',
              }}
            >
              -
              {formatPrice(
                calcPrecioVariable(record, nivel) *
                  toPercent(record.descuento) *
                  record.cantidad
              )}{' '}
              DTO
            </Text>
          )}
          <Text
            type='secondary'
            style={{
              fontSize: '12px',
              position: 'absolute',
              top: 18,
              right: '1rem',
            }}
          >
            +
            {formatPrice(
              calcPrecioVariable(record, nivel) *
                toPercent(100 - record.descuento) *
                toPercent(record.iva) *
                record.cantidad
            )}{' '}
            IVA
          </Text>
          <Text strong>
            {formatPrice(
              calcPrecioVariable(record, nivel) *
                toPercent(100 - record.descuento) *
                toPercent(100 + record.iva) *
                record.cantidad
            )}{' '}
          </Text>
        </>
      )}
    />
  </Table>
);
export default ProductsTable;
