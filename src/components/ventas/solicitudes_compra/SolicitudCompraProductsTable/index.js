import { MinusOutlined } from '@ant-design/icons';
import {
  Button,
  Image,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
} from 'antd';
import { useEffect } from 'react';
import { formatPrice, toPercent } from 'utils/functions';
import { calcCantidad } from 'utils/productos';
const { Text } = Typography;

const SolicitudCompraProductsTable = ({
  products,
  newProducts,
  setNewProducts,
  estado,
  removeItem,
  addOneToItem,
  subOneToItem,
  setValueToItem,
}) => {
  useEffect(() => {
    setNewProducts(products);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Table
      dataSource={newProducts}
      pagination={false}
      style={{ marginBottom: '1rem', maxHeight: '500px' }}
      rowKey={(record) => record.codigo_producto.codigo}
      scroll={{ x: true }}
      bordered
    >
      {estado === 'pendiente' && (
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
                removeItem(record.codigo_producto.codigo);
              }}
            >
              <Button icon={<MinusOutlined />} danger />
            </Popconfirm>
          )}
        />
      )}
      <Table.Column
        align='center'
        title='Imagen'
        dataIndex='imagenes'
        render={(_, record) => (
          <Image
            width={50}
            height={50}
            src={
              record.codigo_producto.imagenes.length
                ? `${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${record.codigo_producto.imagenes[0].directus_files_id}`
                : undefined
            }
            preview={false}
            placeholder={!!!record.codigo_producto.imagenes.length}
          />
        )}
      />
      <Table.Column
        title='Nombre'
        dataIndex='titulo'
        render={(_, record) => record.codigo_producto.titulo}
      />
      <Table.Column
        title='Descuento(%)'
        align='right'
        dataIndex='descuento_ofrecido'
        render={(descuento_ofrecido, record) => (
          <InputNumber
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace('%', '')}
            min={0}
            max={100}
            disabled={estado !== 'pendiente'}
            value={descuento_ofrecido}
            onStep={(_, { type }) => {
              if (type === 'up') {
                addOneToItem(
                  'descuento_ofrecido',
                  record.codigo_producto.codigo
                );
              } else {
                subOneToItem(
                  'descuento_ofrecido',
                  record.codigo_producto.codigo
                );
              }
            }}
            onBlur={({ target: { value } }) =>
              setValueToItem({
                campo: 'descuento_ofrecido',
                codigo: record.codigo_producto.codigo,
                valor: value,
              })
            }
          />
        )}
      />
      <Table.Column
        title='Precio Unitario'
        align='right'
        dataIndex='precio_ofrecido'
        render={(precio_ofrecido, record) => (
          <InputNumber
            style={{ width: '150px' }}
            formatter={(value) => formatPrice(value)}
            min={0}
            disabled={estado !== 'pendiente'}
            precision={2}
            value={precio_ofrecido}
            onStep={(_, { type }) => {
              if (type === 'up') {
                addOneToItem('precio_ofrecido', record.codigo_producto.codigo);
              } else {
                subOneToItem('precio_ofrecido', record.codigo_producto.codigo);
              }
            }}
            onBlur={({ target: { value } }) =>
              setValueToItem({
                campo: 'precio_ofrecido',
                codigo: record.codigo_producto.codigo,
                valor: value,
              })
            }
          />
        )}
      />
      <Table.Column
        title='Cantidad'
        align='right'
        dataIndex='cantidad'
        render={(cantidad, record) => (
          <>
            {record.codigo_producto.tipo_de_venta !== 'Servicio' && (
              <Text
                style={{
                  fontSize: '12px',
                  position: 'absolute',
                  top: 9,
                  right: '1rem',
                }}
              >
                Disponibles: {calcCantidad(record.codigo_producto)}
              </Text>
            )}
            <InputNumber
              min={1}
              max={
                record.codigo_producto.tipo_de_venta === 'Servicio'
                  ? 999
                  : calcCantidad(record.codigo_producto)
              }
              disabled={estado !== 'pendiente'}
              value={cantidad}
              onStep={(_, { type }) => {
                if (type === 'up') {
                  addOneToItem('cantidad', record.codigo_producto.codigo);
                } else {
                  subOneToItem('cantidad', record.codigo_producto.codigo);
                }
              }}
              onBlur={({ target: { value } }) =>
                setValueToItem({
                  campo: 'cantidad',
                  codigo: record.codigo_producto.codigo,
                  valor: value,
                })
              }
            />
          </>
        )}
      />
      <Table.Column
        title='Subtotal'
        align='right'
        dataIndex='subtotal'
        render={(_, record) => (
          <>
            <Text
              type='danger'
              style={{
                fontSize: '12px',
                position: 'absolute',
                top: 16,
                right: '1rem',
              }}
            >
              -
              {formatPrice(
                record.precio_ofrecido *
                  toPercent(record.descuento_ofrecido) *
                  record.cantidad
              )}
            </Text>
            <Text strong>
              {formatPrice(
                record.precio_ofrecido * record.cantidad -
                  record.precio_ofrecido *
                    record.cantidad *
                    toPercent(record.descuento_ofrecido)
              )}
            </Text>
          </>
        )}
      />
    </Table>
  );
};
export default SolicitudCompraProductsTable;
