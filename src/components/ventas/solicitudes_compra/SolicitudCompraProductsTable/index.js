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
        align='right'
        title='Descuento(%)'
        dataIndex='descuento_ofrecido'
        render={(descuento_ofrecido, record) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              justifyContent: 'flex-end',
            }}
          >
            <InputNumber
              min={0}
              max={100}
              type='number'
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
                  campo: 'descuento_ofrecido',
                  codigo: record.codigo_producto.codigo,
                  valor: newValue,
                });
              }}
            />
            <Text> %</Text>
          </div>
        )}
      />
      <Table.Column
        align='right'
        title='Precio Unitario'
        dataIndex='precio_ofrecido'
        render={(precio_ofrecido, record) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              justifyContent: 'flex-end',
            }}
          >
            <Text>$ </Text>
            <InputNumber
              style={{ width: '120px' }}
              min={0}
              type='number'
              disabled={estado !== 'pendiente'}
              precision={2}
              value={precio_ofrecido}
              onStep={(_, { type }) => {
                if (type === 'up') {
                  addOneToItem(
                    'precio_ofrecido',
                    record.codigo_producto.codigo
                  );
                } else {
                  subOneToItem(
                    'precio_ofrecido',
                    record.codigo_producto.codigo
                  );
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
                  campo: 'precio_ofrecido',
                  codigo: record.codigo_producto.codigo,
                  valor: newValue,
                });
              }}
            />
          </div>
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
              type='number'
              disabled={estado !== 'pendiente'}
              value={cantidad}
              onStep={(_, { type }) => {
                if (type === 'up') {
                  addOneToItem('cantidad', record.codigo_producto.codigo);
                } else {
                  subOneToItem('cantidad', record.codigo_producto.codigo);
                }
              }}
              onBlur={({ target: { value } }) => {
                let newValue;
                if (record.codigo_producto.tipo_de_venta === 'Servicio') {
                  if (value > 999) {
                    newValue = 999;
                  } else if (value <= 0 || value === '') {
                    newValue = 1;
                  } else {
                    newValue = Math.ceil(value);
                  }
                } else {
                  if (value > calcCantidad(record.codigo_producto)) {
                    newValue = calcCantidad(record.codigo_producto);
                  } else if (value <= 0 || value === '') {
                    newValue = 1;
                  } else {
                    newValue = Math.ceil(value);
                  }
                }
                setValueToItem({
                  campo: 'cantidad',
                  codigo: record.codigo_producto.codigo,
                  valor: newValue,
                });
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
              {formatPrice(record.precio_ofrecido * record.cantidad)}
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
            {record.descuento_ofrecido > 0 && (
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
                  record.precio_ofrecido *
                    toPercent(record.descuento_ofrecido) *
                    record.cantidad
                )}
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
                record.precio_ofrecido *
                  toPercent(100 - record.descuento_ofrecido) *
                  toPercent(record.iva) *
                  record.cantidad
              )}
              IVA
            </Text>
            <Text strong>
              {formatPrice(
                record.precio_ofrecido *
                  toPercent(100 - record.descuento_ofrecido) *
                  toPercent(100 + record.iva) *
                  record.cantidad
              )}
            </Text>
          </>
        )}
      />
    </Table>
  );
};
export default SolicitudCompraProductsTable;
