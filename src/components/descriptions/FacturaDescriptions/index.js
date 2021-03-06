import { Descriptions } from 'antd';
import moment from 'moment';
import React from 'react';
import {
  formasDePago,
  metodosDePago,
  regimenesFiscales,
  tiposDeComprobante,
  tiposRelacion,
  usosCfdi,
} from 'utils/facturas/catalogo';
import './styles.css';

const formatoFecha = 'DD/MM/YYYY, hh:mm:ss a';
const Item = Descriptions.Item;

const index = ({ factura }) => {
  return (
    <Descriptions layout='vertical' bordered className='boldTitles'>
      <Item label='Folio'>{factura.folio}</Item>
      <Item label='Serie'>{factura.serie}</Item>
      <Item label='Tipo de comprobante'>
        {tiposDeComprobante[factura.tipo_de_comprobante]}
      </Item>

      <Item label='Lugar de Expedición'>{factura.lugar_expedicion}</Item>
      <Item label='Fecha'>
        {moment(new Date(factura.fecha)).format(formatoFecha)}
      </Item>
      <Item label='UUID'>{factura.uuid}</Item>

      <Item label='Moneda'>{factura.moneda}</Item>
      <Item label='Forma de pago'>{formasDePago[factura.forma_pago]}</Item>
      <Item label='Método de pago'>{metodosDePago[factura.metodo_pago]}</Item>

      <Item label='Subtotal'>{`$${factura.subtotal}`}</Item>
      <Item label='Descuento'>{`$${factura.descuento ?? 0}`}</Item>
      <Item label='Total'>{`$${factura.total}`}</Item>

      <Item label='RFC Emisor'>{factura.rfc_emisor}</Item>
      <Item label='Nombre Emisor'>{factura.nombre_emisor}</Item>
      <Item label='Regimen fiscal '>
        {regimenesFiscales[factura.regimen_fiscal]}
      </Item>

      <Item label='RFC Receptor'>{factura.rfc_receptor}</Item>
      <Item label='Nombre Receptor'>{factura.nombre_receptor}</Item>
      <Item label='Uso de CFDI'>{usosCfdi[factura.uso_cfdi]}</Item>

      <Item label='Tipo de Relación'>
        {factura.tipo_relacion
          ? tiposRelacion[factura.tipo_relacion]
          : 'Sin CFDIs relacionados'}
      </Item>

      <Item label='CFDIs Relacionados' span={2}>
        {factura.cfdis_relacionados && factura.cfdis_relacionados.length
          ? factura.cfdis_relacionados.map((elem, indx) => {
              return <p key={indx}>{elem.uuid}</p>;
            })
          : 'Sin CFDIs relacionados'}
      </Item>
    </Descriptions>
  );
};

export default index;
