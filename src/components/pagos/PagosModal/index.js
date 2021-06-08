import { Modal, Button, Row, Col, Table, Space } from 'antd';
import { url } from 'api';

import TextLabel from 'components/UI/TextLabel';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { FormasDePago, tiposDeMoneda } from 'utils/facturas/catalogo';
import { PlusOutlined } from '@ant-design/icons';

const Index = ({ visible, pago, setVis }) => {
  const breakpoint = useBreakpoint();
  console.log(pago);
  const columns = [
    {
      title: 'ID DOC*',
      dataIndex: 'id_documento',
      width: '100px',
      ellipsis: true,
      editable: true,
      max: 36,
    },
    {
      title: 'Folio',
      dataIndex: 'folio',
      width: '100px',
      ellipsis: true,
      editable: true,
      max: 25,
    },
    {
      title: 'Serie',
      dataIndex: 'serie',
      width: '100px',
      ellipsis: true,
      editable: true,
      max: 40,
    },
    {
      title: 'Moneda DR*',
      dataIndex: 'moneda_dr',
      width: '100px',
      ellipsis: true,
      editable: true,
      max: 3,
    },
    {
      title: 'Tipo de cambio DR',
      dataIndex: 'tipo_cambio_dr',
      type: 'number',
      width: '80px',
      editable: true,
    },
    {
      title: 'Metodo de Pago*',
      dataIndex: 'metodo_de_pago_dr',
      width: '100px',
      ellipsis: true,
      editable: true,
      max: 3,
    },
    {
      title: 'Número de Parcialidad*',
      dataIndex: 'numparcialidad',
      max: 2,
      type: 'number',
      width: '80px',
      editable: true,
    },
    {
      title: 'Imp. Saldo Ant.',
      dataIndex: 'imp_saldo_ant',
      type: 'number',
      width: '80px',
      editable: true,
    },
    {
      title: 'Imp. Saldo Ins',
      dataIndex: 'imp_saldo_insoluto',
      type: 'number',
      width: '80px',
      editable: true,
    },
    {
      title: 'Imp. Pagado',
      dataIndex: 'imp_pagado',
      type: 'number',
      width: '80px',
      editable: true,
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        maxLength: col.max,
        dataIndex: col.dataIndex,
        title: col.title,
      }),
    };
  });

  return Object.keys(pago).length !== 0 ? (
    <>
      <Modal
        title={`Pago No. ${pago.pagos_id.id}`}
        centered
        visible={visible}
        onOk={() => {
          setVis();
        }}
        onCancel={() => {
          setVis();
        }}
        width={'85%'}
        footer={[
          <Button
            key='submit'
            type='primary'
            onClick={() => {
              setVis();
            }}
          >
            Confirmar
          </Button>,
        ]}
      >
        <TextLabel title='Tipo de Factura' subtitle={pago.pagos_id.tipo} />
        <Row key='columnas' gutter={[16, 8]} style={{ marginBottom: '10px' }}>
          <Col
            className='gutter-row'
            span={breakpoint.lg ? 12 : 24}
            style={{ marginBottom: '10px' }}
          >
            <TextLabel title='Id de Factura' subtitle={pago.item} />
            <TextLabel
              title='Forma de Pago'
              subtitle={FormasDePago[pago.pagos_id.forma_de_pago_p]}
            />
            <TextLabel
              title='Tipo de Cambio'
              subtitle={pago.pagos_id.tipo_cambio_p}
            />
          </Col>
          <Col
            className='gutter-row'
            span={breakpoint.lg ? 12 : 24}
            style={{ marginBottom: '10px' }}
          >
            <TextLabel
              title='Fecha de Pago'
              subtitle={pago.pagos_id.fecha_pago}
            />
            <TextLabel
              title='Moneda'
              subtitle={tiposDeMoneda[pago.pagos_id.moneda_p]}
            />
            <TextLabel title='Monto' subtitle={pago.pagos_id.monto} />
          </Col>
        </Row>
        <TextLabel
          title='Número de Operación'
          subtitle={pago.pagos_id.num_operacion}
        />
        <TextLabel
          title='Nombre del banco'
          subtitle={pago.pagos_id.nom_banco_ord_ext}
        />
        <TextLabel
          title='RFC Emisor Cuenta Ordenante'
          subtitle={pago.pagos_id.rfc_emisor_cta_ord}
        />
        <TextLabel
          title='Cuenta Ordenante'
          subtitle={pago.pagos_id.cta_ordenante}
        />
        <TextLabel
          title='RFC Emisor Cuenta Beneficiario'
          subtitle={pago.pagos_id.rfc_emisor_cta_ben}
        />
        <TextLabel
          title='Cuenta Beneficiario'
          subtitle={pago.pagos_id.cta_beneficiario}
        />
        <TextLabel title='Relacionar pago con documento (Opcional)' />
        <Table
          bordered
          scroll={{ x: 1500, y: 600 }}
          dataSource={pago.pagos_id.doctos_relacionados}
          columns={mergedColumns}
          rowClassName='editable-row'
        />
        <TextLabel
          title='Agregar Archivo Comprobante'
          subtitle='Seleccionar el boton de agregar archivo, ir a la opción de "Archivos Comprobante" y seleccionar "Crear Nuevo", arrastrar o subir los archivos correspondientes, al finalizar confirmar en el boton de la esquina superior derecha'
        />
        <Space direction='vertical'>
          {pago.pagos_id.archivos_comprobante.map((documento) => (
            <Button
              type='link'
              onClick={() => {
                window
                  .open(
                    `${url}/assets/${documento.directus_files_id.id}`,
                    '_blank'
                  )
                  .focus();
              }}
            >
              {documento.directus_files_id.filename_download}
            </Button>
          ))}
        </Space>
        <br />
        <br />
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => {
            window
              .open(
                `${url}/admin/collections/pagos/${pago.pagos_id.id}`,
                '_blank'
              )
              .focus();
          }}
        >
          Agregar Archivo
        </Button>
      </Modal>
    </>
  ) : null;
};

//<DocumentList lista={documentos} cambiarLista={onSetDocumentos} />

export default Index;
