import { Button, message, Modal, Space } from 'antd';
import { httpSAT } from 'api';
import * as CRUD from 'api/compras/facturas_externas';
import { insertItems as insertProveedor } from 'api/compras/proveedores';
import Descripciones from 'components/descriptions/FacturaDescriptions';
import ListaFacturas from 'components/list/FacturasExternasList';
import LectorFacturas from 'components/shared/facturas/LectorFacturas';
import { useStoreState } from 'easy-peasy';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';

const Index = (props) => {
  const token = useStoreState((state) => state.user.token.access_token);

  const onFacturaLeida = async (factura) => {
    // console.log({ factura });
    const cfdi = factura['$'];
    const emisor = factura['cfdi:Emisor'][0].$;
    const receptor = factura['cfdi:Receptor'][0].$;
    const timbreFiscal =
      factura['cfdi:Complemento'][0]['tfd:TimbreFiscalDigital'][0].$;

    const datosFactura = {
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
      descuento: cfdi.Descuento,

      rfc_emisor: emisor.Rfc,
      nombre_emisor: emisor.Nombre,
      regimen_fiscal: emisor.RegimenFiscal,

      rfc_receptor: receptor.Rfc,
      nombre_receptor: receptor.Nombre,
      uso_cfdi: receptor.UsoCFDI,
    };
    const proveedor = {
      rfc: emisor.Rfc,
      razon_social: emisor.Nombre,
      regimen_fiscal: emisor.RegimenFiscal,
    };

    const hide0 = message.loading('Registrando proveedor', 0);
    const rfc_proveedor = await insertarProveedor(proveedor);

    hide0();
    if (rfc_proveedor.length >= 12)
      message.success('El proveedor ha sido registrado exitosamente');
    else if (rfc_proveedor === 0) {
      message.warn('Este proveedor ya ha sido registrado previamente', 1.5);
    } else {
      message.error('Fallo al intentar registrar el proveedor');
    }

    const hide = message.loading('Registrando datos de factura', 0);
    insertMutation.mutate(datosFactura, { onSuccess: hide, onError: hide });
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

  const showModal = (element) => {
    setIsModalVisible(true);
    setListElement(element);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onConfirmDelete = async (item) => {
    deleteMutation.mutate(item);
  };

  const queryClient = useQueryClient();

  const insertMutation = useMutation(
    (values) => CRUD.insertItems(values, token),
    {
      onSuccess: () => {
        queryClient
          .invalidateQueries('facturas_externas')
          .then(
            message.success('La factura ha sido registrada exitosamente', 2)
          );
      },
      onError: (error) => {
        if (
          error.response.data.errors[0].message.includes('has to be unique')
        ) {
          message.warn('Esta factura ya ha sido registrada previamente', 2.5);
        } else {
          message.error(
            'Fallo al intentar registrar los datos de factura',
            2.5
          );
        }
      },
    }
  );
  const deleteMutation = useMutation(
    (values) => CRUD.deleteItem(values, token),
    {
      onSuccess: () => {
        queryClient
          .invalidateQueries('facturas_externas')
          .then(message.success('Registro eliminado exitosamente'));
      },
      onError: (error) => {
        if (error.response.status === 500)
          message.error(
            'Fallo al intentar eliminar la factura. Revise que no haya registros relacionados.'
          );
      },
    }
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listElement, setListElement] = useState({});

  return (
    <>
      <ListaFacturas
        onClickItem={showModal}
        seeItem={showModal}
        onConfirmDelete={onConfirmDelete}
      />
      <br />
      <Space>
        <Link to='/compras/registrar'>
          <Button type='primary'>Registrar factura de compra</Button>
        </Link>
        <LectorFacturas
          onSuccess={onFacturaLeida}
          hideUploadList
          titulo='Registrar solo datos de factura'
        />
      </Space>
      <Modal
        title={listElement.nombre_emisor}
        visible={isModalVisible}
        onCancel={handleCancel}
        width='70%'
      >
        <Descripciones factura={listElement} />
      </Modal>
    </>
  );
};

export default Index;
