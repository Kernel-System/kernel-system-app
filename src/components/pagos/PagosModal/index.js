import { InboxOutlined } from '@ant-design/icons';
import { Button, Col, Modal, Row, Space, Table, message, Upload } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import TextLabel from 'components/UI/TextLabel';
import { FormasDePago, tiposDeMoneda } from 'utils/facturas/catalogo';
import { http } from 'api';
const { Dragger } = Upload;

const Index = ({
  visible,
  pago,
  setVis,
  putToken,
  token,
  actualizar,
  tipo,
}) => {
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

  const beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'application/pdf';
    if (!isJpgOrPng) {
      message.error(
        'Solo puede subir imágenes en formato JPG/PNG o archivos PDF'
      );
    }
    return isJpgOrPng;
  };

  return Object.keys(pago).length !== 0 ? (
    <>
      <Modal
        title={`Pago No. ${pago?.id}`}
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
        <TextLabel title='Tipo de Factura' subtitle={pago?.tipo} />
        <Row key='columnas' gutter={[16, 8]} style={{ marginBottom: '10px' }}>
          <Col
            className='gutter-row'
            span={breakpoint.lg ? 12 : 24}
            style={{ marginBottom: '10px' }}
          >
            <TextLabel
              title='Id de Factura'
              subtitle={
                tipo === 'facturas_externas'
                  ? pago?.facturas_externas?.id
                  : pago?.facturas_internas?.id
              }
            />
            <TextLabel
              title='Forma de Pago'
              subtitle={FormasDePago[pago?.forma_de_pago_p]}
            />
            <TextLabel title='Tipo de Cambio' subtitle={pago?.tipo_cambio_p} />
          </Col>
          <Col
            className='gutter-row'
            span={breakpoint.lg ? 12 : 24}
            style={{ marginBottom: '10px' }}
          >
            <TextLabel title='Fecha de Pago' subtitle={pago?.fecha_pago} />
            <TextLabel
              title='Moneda'
              subtitle={tiposDeMoneda[pago?.moneda_p]}
            />
            <TextLabel title='Monto' subtitle={pago?.monto} />
          </Col>
        </Row>
        <TextLabel title='Número de Operación' subtitle={pago?.num_operacion} />
        <TextLabel
          title='Nombre del banco'
          subtitle={pago?.nom_banco_ord_ext}
        />
        <TextLabel
          title='RFC Emisor Cuenta Ordenante'
          subtitle={pago?.rfc_emisor_cta_ord}
        />
        <TextLabel title='Cuenta Ordenante' subtitle={pago?.cta_ordenante} />
        <TextLabel
          title='RFC Emisor Cuenta Beneficiario'
          subtitle={pago?.rfc_emisor_cta_ben}
        />
        <TextLabel
          title='Cuenta Beneficiario'
          subtitle={pago?.cta_beneficiario}
        />
        <TextLabel title='Relacionar pago con documento (Opcional)' />
        <Table
          bordered
          scroll={{ x: 1500, y: 600 }}
          dataSource={pago?.doctos_relacionados}
          columns={mergedColumns}
          rowClassName='editable-row'
        />
        <TextLabel
          title='Agregar Archivo Comprobante'
          subtitle='Seleccionar el boton de agregar archivo, ir a la opción de "Archivos Comprobante" y seleccionar "Crear Nuevo", arrastrar o subir los archivos correspondientes, al finalizar confirmar en el boton de la esquina superior derecha'
        />
        <Space direction='vertical'>
          {pago?.archivos_comprobante.map((documento, index) => (
            <Button
              type='link'
              key={index}
              onClick={() => {
                window
                  .open(
                    `${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${documento.directus_files_id.id}`,
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
        <Dragger
          action={`${process.env.REACT_APP_DIRECTUS_API_URL}/files`}
          headers={{
            Authorization: `Bearer ${token}`,
            'X-Requested-With': null,
          }}
          name='file'
          listType='picture-card'
          onChange={(info) => {
            if (info?.file?.response?.data?.id !== undefined) {
              http
                .post(
                  `/items/pagos_directus_files`,
                  {
                    pagos_id: pago?.id,
                    directus_files_id: info?.file?.response?.data?.id,
                  },
                  putToken
                )
                .then((result) => {
                  message.success('Archivo subido con exito');
                  actualizar();
                })
                .catch(() => {
                  message.error('Error al subir el Archivo :c');
                });
            }
          }}
          maxCount={1}
          beforeUpload={beforeUpload}
        >
          <p className='ant-upload-drag-icon'>
            <InboxOutlined />
          </p>
          <p className='ant-upload-text'>Haz clic o arrastre el archivo</p>
        </Dragger>
      </Modal>
    </>
  ) : null;
};

//<DocumentList lista={documentos} cambiarLista={onSetDocumentos} />

export default Index;
