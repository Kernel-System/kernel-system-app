import { useState } from 'react';
import { useStoreState } from 'easy-peasy';
import { Button, Modal, message, Space } from 'antd';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import LectorFacturas from 'components/shared/facturas/LectorFacturas';
import ListaFacturas from 'components/list/FacturasInternasList';
import Descripciones from 'components/descriptions/FacturaDescriptions';
import { httpSAT } from 'api';
import * as CRUD from 'api/ventas/facturas_internas';

const Index = (props) => {
  const onFacturaLeida = async (factura) => {
    console.log({ factura });
    const cfdi = factura['$'];
    const emisor = factura['cfdi:Emisor'][0].$;
    const receptor = factura['cfdi:Receptor'][0].$;
    const timbreFiscal =
      factura['cfdi:Complemento'][0]['tfd:TimbreFiscalDigital'][0].$;

    const datosFactura = {
      id: cfdi.id,
      folio: cfdi.Folio,
      serie: cfdi.Serie,
      tipo_de_comprobante: cfdi.TipoDeComprobante,
      fecha: cfdi.Fecha,
      condiciones_de_pago: cfdi.CondicionesDePago,
      lugar_expedicion: cfdi.LugarExpedicion,
      no_certificado: cfdi.NoCertificado,
      cancelada: cfdi.cancelada === 'false' ? 'Si' : 'No',

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

      uuid: timbreFiscal.UUID,
      fecha_timbrado: timbreFiscal.FechaTimbrado,
      no_certificado_sat: timbreFiscal.NoCertificadoSAT,
      rfc_prov_cert: timbreFiscal.RfcProvCertif,
    };

    const hide = message.loading('Registrando datos de factura', 0);
    insertMutation.mutate(datosFactura, { onSuccess: hide, onError: hide });
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

  const token = useStoreState((state) => state.user.token.access_token);

  const insertMutation = useMutation(CRUD.insertItems, {
    onSuccess: () => {
      queryClient
        .invalidateQueries('facturas_internas')
        .then(message.success('La factura ha sido registrada exitosamente', 2));
    },
    onError: (error) => {
      if (error.response.data.errors[0].message.includes('has to be unique')) {
        message.warn('Esta factura ya ha sido registrada previamente', 2.5);
      } else {
        message.error('Fallo al intentar registrar los datos de factura', 2.5);
      }
    },
  });
  const deleteMutation = useMutation(
    (values) => CRUD.deleteItem(values, token),
    {
      onSuccess: () => {
        queryClient
          .invalidateQueries('facturas_internas')
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

  const descargarFactura = (id) => {
    httpSAT.get(`/cfdi/pdf/issued/${id}`).then((result_pdf) => {
      const linkSource =
        'data:application/pdf;base64,' + result_pdf.data.Content;
      const downloadLink = document.createElement('a');
      const fileName = `${id}.pdf`;
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    });
  };

  return (
    <>
      <ListaFacturas
        onClickItem={showModal}
        seeItem={showModal}
        onConfirmDelete={onConfirmDelete}
      ></ListaFacturas>
      <br />
      <Space>
        <Link to='/venta'>
          <Button type='primary'>Registrar factura por venta</Button>
        </Link>
        <LectorFacturas
          onSuccess={onFacturaLeida}
          hideUploadList
          titulo='Registrar solo datos de factura'
        />
      </Space>
      <Modal
        title={listElement.nombre_receptor ?? listElement.rfc_receptor}
        visible={isModalVisible}
        footer={
          listElement.id_api ? (
            <Button
              type='link'
              onClick={() => {
                descargarFactura(listElement.id_api);
              }}
            >
              Descargar Factura
            </Button>
          ) : null
        }
        onCancel={handleCancel}
        width='70%'
      >
        <Descripciones factura={listElement} />
      </Modal>
    </>
  );
};

export default Index;
