import React, { useState } from 'react';
import LectorFacturas from 'components/shared/facturas/LectorFacturas';
import CompraForm from 'components/forms/CompraForm';
import Header from 'components/UI/HeadingBack';
import { message } from 'antd';
import { useQuery, useQueryClient } from 'react-query';
import { insertItems as insertProveedor } from 'api/compras/proveedores';
import { insertItems as insertFactura } from 'api/compras/facturas_externas';
import { insertItems as insertCompra } from 'api/compras';
import { filtrarPorUUID } from 'api/compras/facturas_externas';
import { getProductCodes } from 'api/shared/products';
import { useStoreState } from 'easy-peasy';

import moment from 'moment';

const Index = () => {
  const queryClient = useQueryClient();
  const rfc_empleado = useStoreState((state) => state.user.rfc);
  const token = useStoreState((state) => state.user.token.access_token);

  const { data: productos_catalogo } = useQuery(
    'productos_catalogo',
    async () => {
      const { data } = await getProductCodes();
      const datos = data.data;
      return datos;
    }
  );

  const onFacturaLeida = (factura) => {
    // console.log({ factura });
    const cfdi = factura['$'];
    const emisor = factura['cfdi:Emisor'][0].$;
    const receptor = factura['cfdi:Receptor'][0].$;
    const timbreFiscal =
      factura['cfdi:Complemento'][0]['tfd:TimbreFiscalDigital'][0].$;

    setFactura(() => ({
      datosFactura: {
        folio: cfdi.Folio,
        serie: cfdi.Serie,
        tipo_de_comprobante: cfdi.TipoDeComprobante,
        fecha: cfdi.Fecha,
        condiciones_de_pago: cfdi.CondicionesDePago,
        lugar_expedicion: cfdi.LugarExpedicion,
        uuid: timbreFiscal.UUID,

        moneda: cfdi.Moneda,
        tipo_cambio: cfdi.TipoCambio,
        subtotal: cfdi.SubTotal,
        total: cfdi.Total,
        forma_pago: cfdi.FormaPago,
        metodo_pago: cfdi.MetodoPago,

        rfc_emisor: emisor.Rfc,
        nombre_emisor: emisor.Nombre,
        regimen_fiscal: emisor.RegimenFiscal,

        rfc_receptor: receptor.Rfc,
        nombre_receptor: receptor.Nombre,
        uso_cfdi: receptor.UsoCFDI,
      },

      proveedor: {
        rfc: emisor.Rfc,
        razon_social: emisor.Nombre,
        regimen_fiscal: emisor.RegimenFiscal,
      },

      datosCompra: {
        fecha_compra: cfdi.Fecha,
        productos_comprados: leerConceptosFactura(factura),
      },
    }));
  };

  function leerConceptosFactura(factura) {
    const conceptos = factura['cfdi:Conceptos'][0]['cfdi:Concepto'];
    const productos = [];

    conceptos.forEach((elemento, index) => {
      const objeto = elemento.$;
      const codigo = objeto.NoIdentificacion;
      const existe =
        codigo && productos_catalogo.some((prod) => prod.codigo === codigo);
      const producto = {
        key: index,
        cantidad: objeto.Cantidad,
        clave: objeto.ClaveProdServ,
        clave_unidad: objeto.ClaveUnidad,
        descripcion: objeto.Descripcion,
        importe: objeto.Importe,
        codigo: codigo,
        unidad: objeto.Unidad,
        descuento: objeto.Descuento ? objeto.Descuento : '',
        valor_unitario: objeto.ValorUnitario,
        producto_catalogo: existe ? codigo : null,
      };
      productos.push(producto);
    });

    return productos;
  }

  const [factura, setFactura] = useState({});

  const insertarFactura = async (factura) => {
    let id = -1;
    await insertFactura(factura, token)
      .then((result) => {
        if (result.status === 200) {
          id = result.data.data.id;
        }
      })
      .catch((error) => {
        if (
          error.response.data.errors[0].message.includes('has to be unique')
        ) {
          id = 0;
        }
      });
    return id;
  };

  const insertarCompra = async (compra) => {
    let noCompra = -1;
    await insertCompra(compra, token)
      .then((result) => {
        if (result.status === 200) {
          noCompra = result.data.data.no_compra;
        }
      })
      .catch((error) => {
        if (
          error.response.data.errors[0].message.includes('has to be unique')
        ) {
          noCompra = 0;
        }
      });
    return noCompra;
  };

  const insertarProveedor = async (proveedor) => {
    let rfc = -1;
    await insertProveedor(proveedor, token)
      .then((result) => {
        if (result.status === 200) {
          rfc = result.data.data.rfc;
        }
      })
      .catch((error) => {
        if (
          error.response.data.errors[0].message.includes('has to be unique')
        ) {
          rfc = 0;
        }
      });
    return rfc;
  };

  const getFactura = async (uuid) => {
    let idEncontrada = 0;
    await filtrarPorUUID(uuid).then((result) => {
      idEncontrada = result.data.data[0].id;
    });
    return idEncontrada;
  };

  const insertItem = async (compra) => {
    let success = false;
    const hide0 = message.loading('Registrando proveedor', 0);
    const rfc_proveedor = await insertarProveedor(factura.proveedor);

    hide0();
    if (rfc_proveedor.length >= 12)
      message.success('El proveedor ha sido registrado exitosamente');
    else if (rfc_proveedor === 0) {
      message.warn('Este proveedor ya ha sido registrado previamente');
    } else {
      message.error('Fallo al intentar registrar el proveedor');
    }

    const hide1 = message.loading('Registrando datos de factura', 0);
    const idRegistrada = await insertarFactura(factura.datosFactura);
    hide1();
    let idFactura = idRegistrada;
    if (idRegistrada > 0)
      message.success('La factura ha sido registrada exitosamente', 2);
    else if (idRegistrada === 0) {
      message.warn('Esta factura ya ha sido registrada previamente', 2.5);
      idFactura = await getFactura(factura.datosFactura.uuid);
    } else {
      message.error('Fallo al intentar registrar los datos de factura', 2.5);
    }

    const hide2 = message.loading('Registrando datos de compra', 0);
    const registroCompra = {
      ...compra,
      fecha_compra: moment(compra.fecha_compra).format('YYYY-MM-DDTHH:mm:ss'),
      fecha_entrega: compra.fecha_entrega
        ? moment(compra.fecha_entrega).format('YYYY-MM-DD')
        : null,
      productos_comprados: factura.datosCompra.productos_comprados,
      factura: idFactura,
      proveedor: factura.proveedor.rfc,
      empleado: rfc_empleado,
    };
    const noCompra = await insertarCompra(registroCompra);
    hide2();
    if (noCompra > 0) {
      message.success('La compra ha sido registrada exitosamente', 2);
      queryClient.invalidateQueries('productos_comprados');
      success = true;
    } else if (noCompra === 0) {
      message.warn('Esta compra ya ha sido registrada previamente', 2.5);
    } else {
      message.error('Fallo al intentar registrar los datos de la compra', 2.5);
    }

    return success;
  };

  return (
    <>
      <Header title='Registrar compra' />
      <LectorFacturas isDragger onSuccess={onFacturaLeida} />
      <br />
      <CompraForm
        datosCompra={{
          ...factura.datosCompra,
          ...factura.datosFactura,
        }}
        submitText='REGISTRAR COMPRA'
        cleanOnSubmit
        onSubmit={insertItem}
      ></CompraForm>
    </>
  );
};

export default Index;
