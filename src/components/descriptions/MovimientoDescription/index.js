import React from 'react';
import './styles.css';
import { Descriptions } from 'antd';
import moment from 'moment';

const formatoFecha = 'DD/MM/YYYY, hh:mm:ss a';
const Item = Descriptions.Item;

const mostrarJustificacion = (movimiento) => {
  const justificaciones = [];

  movimiento.rma &&
    justificaciones.push({ titulo: 'Folio de RMA', justif: movimiento.rma });
  movimiento.compras &&
    justificaciones.push({
      titulo: 'Número de Compra',
      justif: movimiento.compras,
    });
  movimiento.ventas &&
    justificaciones.push({
      titulo: 'Número de Venta',
      justif: movimiento.ventas,
    });
  movimiento.factura?.length &&
    justificaciones.push({
      titulo: 'Número de Factura',
      justif: movimiento.factura,
    });
  movimiento.devolucion_clientes &&
    justificaciones.push({
      titulo: 'Número de Devolución',
      justif: movimiento.devolucion_clientes,
    });
  movimiento.folio_ensamble &&
    justificaciones.push({
      titulo: 'Folio de Ensamble',
      justif: movimiento.folio_ensamble,
    });
  movimiento.no_transferencia &&
    justificaciones.push({
      titulo: 'Solicitud de Transferencia',
      justif: movimiento.no_transferencia,
    });

  return justificaciones.map((elem, indx) => {
    return (
      <p key={indx}>
        <span style={{ fontWeight: '400' }}>{elem.titulo}</span>
        {': '}
        {elem.justif}
      </p>
    );
  });
};

const index = ({ movimiento, ...props }) => {
  return (
    <Descriptions layout='vertical' bordered className='boldTitles' column={2}>
      <Item label='Fecha'>
        {moment(new Date(movimiento.fecha)).format(formatoFecha)}
      </Item>
      <Item label='Almacén'>
        {movimiento.clave_almacen?.clave +
          ' - sucursal ' +
          movimiento.clave_almacen?.clave_sucursal}
      </Item>
      <Item label='Empleado'>{movimiento.rfc_empleado?.nombre}</Item>
      <Item label='Comentarios'>{movimiento?.comentario}</Item>
      <Item label='Concepto'>{movimiento.concepto}</Item>
      <Item label='Justificación'>{mostrarJustificacion(movimiento)}</Item>

      <Item label='Productos' span={2}>
        {props.children}
      </Item>
    </Descriptions>
  );
};

export default index;
