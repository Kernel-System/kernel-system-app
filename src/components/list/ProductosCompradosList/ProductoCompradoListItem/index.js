import locale from 'antd/es/date-picker/locale/es_ES';
import { List, Button, Badge } from 'antd';
import { EditFilled, WarningTwoTone } from '@ant-design/icons';
import moment from 'moment';
import React from 'react';

const formatoCompra = 'DD MMMM YYYY, hh:mm:ss a';

const ProductoCompradoListItem = ({ item, onClickItem, editItem }) => {
  //   console.log('rendering item [' + index + ']');
  return (
    <Badge.Ribbon
      locale={locale}
      color={item.producto_catalogo ? 'blue' : 'blue'}
      style={{
        top: -12,
      }}
      text={
        item.producto_catalogo ? (
          <>
            {'Código catalogo:'} <b>{item.producto_catalogo}</b>
          </>
        ) : (
          <b>
            <WarningTwoTone twoToneColor='orange' /> Sin código asignado{' '}
            <WarningTwoTone twoToneColor='orange' />
          </b>
        )
      }
    >
      <List.Item
        key={item.id}
        actions={[
          <Button
            icon={<EditFilled />}
            onClick={() => editItem(item)}
          ></Button>,
        ]}
      >
        <List.Item.Meta
          title={
            <p
              onClick={() => {
                onClickItem(item);
              }}
              style={{
                cursor: 'pointer',
                margin: 0,
              }}
            >
              <span
                style={{
                  fontWeight: 'normal',
                }}
              >
                {item.rfc_emisor + ' - '}
              </span>
              {item.descripcion}
            </p>
          }
          description={
            <p
              style={{
                margin: 0,
              }}
            >
              Fecha de compra:{' '}
              {moment(new Date(item.fecha_compra)).format(formatoCompra)}
            </p>
          }
        />
        <b
          style={{
            display: 'inline',
            opacity: 0.8,
            color:
              item.cantidad > item.cantidad_ingresada ? '#e53935' : 'inherit',
          }}
        >
          {item.cantidad > item.cantidad_ingresada
            ? `Pendiente de ingresar: ${
                item.cantidad - item.cantidad_ingresada
              } ${item.unidad}`
            : 'Cantidad ingresada: ' + item.cantidad + ' ' + item.unidad}
        </b>
      </List.Item>
    </Badge.Ribbon>
  );
};

export const MemoizedProductoItem = React.memo(ProductoCompradoListItem);
export default ProductoCompradoListItem;
