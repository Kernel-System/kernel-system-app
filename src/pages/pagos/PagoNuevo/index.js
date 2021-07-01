import { Button, Row, Col, Form, Select, message, DatePicker } from 'antd';
import { FormasDePago, tiposDeMoneda } from 'utils/facturas/catalogo';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import InputForm from 'components/shared/InputForm';
import NumericInputForm from 'components/shared/NumericInputForm';
import HeadingBack from 'components/UI/HeadingBack';
import TextLabel from 'components/UI/TextLabel';
import DocumentList from 'components/table/DocumentTable';
import { useStoreState } from 'easy-peasy';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { http } from 'api';
const { Option } = Select;

const Index = () => {
  const breakpoint = useBreakpoint();
  const [facturas, setFacturas] = useState([]);
  const [tipo, setTipo] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [documentos, setDocumentos] = useState([]);
  const [fecha, setFecha] = useState();
  const history = useHistory();
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const onFinish = (value: any) => {
    let errorDocument = false;
    for (let i = 0; i < documentos.length; i++) {
      if (
        documentos[i].id_documento === '' ||
        documentos[i].metodo_de_pago_dr === '' ||
        documentos[i].numparcialidad === ''
      ) {
        errorDocument = true;
        break;
      }
    }
    if (!errorDocument) {
      console.log(value);
      let dato =
        tipo === 'facturas_externas'
          ? { facturas_externas: value.folio_factura }
          : { facturas_internas: value.folio_factura };
      http
        .post(
          '/items/pagos/',
          {
            fecha_pago: fecha,
            forma_de_pago_p: value.forma_de_pago_p,
            moneda_p: value.moneda_p,
            tipo_cambio_p: value.tipo_cambio_p,
            monto: value.monto,
            num_operacion: value.num_operacion,
            rfc_emisor_cta_ord: value.rfc_emisor_cta_ord,
            nom_banco_ord_ext: value.nom_banco_ord_ext,
            cta_ordenante: value.cta_ordenante,
            rfc_emisor_cta_ben: value.rfc_emisor_cta_ben,
            cta_beneficiario: value.cta_beneficiario,
            tipo: value.tipo,
            ...dato,
          },
          putToken
        )
        .then((resul_pago) => {
          console.log(resul_pago);
          if (documentos.length !== 0) {
            let newDocumento = [];
            documentos.forEach((documento) => {
              newDocumento.push({
                id_pago: resul_pago.data.data.id,
                id_documento: documento.id_documento, //25
                folio: documento.folio, //25
                serie: documento.serie, //40
                moneda_dr: documento.moneda_dr, //char 3
                tipo_cambio_dr: documento.tipo_cambio_dr, //decimal 10
                metodo_de_pago_dr: documento.metodo_de_pago_dr, //char 3
                numparcialidad: documento.numparcialidad, //36
                imp_saldo_ant: documento.imp_saldo_ant,
                imp_saldo_insoluto: documento.imp_saldo_insoluto,
                imp_pagado: documento.imp_pagado,
              });
            });
            http
              .post('/items/doctos_relacionados/', newDocumento, putToken)
              .then((resul) => {
                console.log(resul);
                Mensaje();
              });
          } else Mensaje();
        });
    } else message.warning('Falta llenar datos de documentos');
  };

  const Mensaje = () => {
    message
      .success('El pago ha sido registrado exitosamente', 3)
      .then(() => history.goBack());
  };

  const onSetDocumentos = (cambio) => {
    console.log(cambio);
    const newCambio = JSON.parse(JSON.stringify(cambio));
    setDocumentos(newCambio);
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error('error');
    console.log('Failed:', errorInfo);
  };

  const handleChange = (value) => {
    setTipo(value);
    setEnabled(false);
    const dir =
      value === 'facturas_internas'
        ? `/items/facturas_internas/`
        : `/items/facturas_externas/`;
    http.get(dir, putToken).then((resul) => {
      setFacturas(resul.data.data);
    });
  };

  function onChangeTime(date, dateString) {
    const fecha = new Date(dateString);
    setFecha(
      fecha.getUTCFullYear() +
        '-' +
        ('00' + (fecha.getUTCMonth() + 1)).slice(-2) +
        '-' +
        ('00' + fecha.getUTCDate()).slice(-2) +
        ' ' +
        ('00' + fecha.getUTCHours()).slice(-2) +
        ':' +
        ('00' + fecha.getUTCMinutes()).slice(-2) +
        ':' +
        ('00' + fecha.getUTCSeconds()).slice(-2)
    );
  }

  return (
    <Form
      name='pago_nuevo'
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <HeadingBack title='Pago' />
      <TextLabel title='Tipo de Factura' />
      <Form.Item
        key='tipo'
        name='tipo'
        rules={[
          {
            required: true,
            message: 'Asigna un tipo de factura',
          },
        ]}
      >
        <Select
          //defaultValue='transferencia'
          style={{ width: '50%' }}
          onChange={handleChange}
        >
          <Option value='facturas_internas'>Facturas Internas</Option>
          <Option value='facturas_externas'>Facturas Externa</Option>
        </Select>
      </Form.Item>
      <Row key='columnas' gutter={[16, 8]} style={{ marginBottom: '10px' }}>
        <Col
          className='gutter-row'
          span={breakpoint.lg ? 12 : 24}
          style={{ marginBottom: '10px' }}
        >
          <TextLabel title='Folio de Factura' />
          <Form.Item
            key='folio_factura'
            name='folio_factura'
            rules={[
              {
                required: true,
                message: 'Asigna un folio de factura.',
              },
            ]}
          >
            <Select
              //defaultValue='transferencia'
              style={{ width: '100%' }}
              placeholder='Agrega un folio de factura.'
              disabled={enabled}
            >
              {facturas.map((factura) => {
                return tipo === 'facturas_internas' ? (
                  <Option key={factura.folio} value={factura.folio}>
                    {factura.folio}
                  </Option>
                ) : (
                  <Option key={factura.id} value={factura.id}>
                    {factura.folio}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <TextLabel title='Forma de Pago' />
          <Form.Item
            key='forma_de_pago_p'
            name='forma_de_pago_p'
            rules={[
              {
                required: true,
                message: 'Asigna una forma de pago',
              },
            ]}
          >
            <Select
              key='forma_pago_select'
              defaultValue='01'
              style={{ width: '100%' }}
              //onChange={handleChange}
            >
              {Object.keys(FormasDePago).map((item) => {
                return (
                  <Option value={item} key={item}>
                    {`${item} : ${FormasDePago[item]}`}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <TextLabel title='Tipo de Cambio' />
          <NumericInputForm
            paso={0.01}
            titulo='tipo_pago_p'
            min={0}
            defaultValue={parseFloat(1)}
            formato='precio'
            //onChange={onChange}
            style={{ width: '100%' }}
          />
        </Col>
        <Col
          className='gutter-row'
          span={breakpoint.lg ? 12 : 24}
          style={{ marginBottom: '10px' }}
        >
          <TextLabel title='Fecha de Pago' />
          <Form.Item
            key='fecha_pago'
            name='fecha_pago'
            rules={[
              {
                required: true,
                message: 'Asigna un folio de factura',
              },
            ]}
          >
            <DatePicker
              style={{ width: '100%' }}
              onChange={onChangeTime}
              placeholder='Selecciona la fecha'
            />
          </Form.Item>
          <TextLabel title='Moneda' />
          <Form.Item
            key='moneda_p'
            name='moneda_p'
            rules={[
              {
                required: true,
                message: 'Ingrese un tipo de moneda',
              },
            ]}
          >
            <Select
              showSearch
              style={{ width: '100%' }}
              disabled={tipo === 'mostrar'}
              placeholder='Tipo de moneda'
              optionFilterProp='children'
              defaultValue={'MXM'}
              value={'MXM'}
            >
              {Object.keys(tiposDeMoneda).map((item) => {
                return (
                  <Option value={item} key={item}>
                    {`${item} : ${tiposDeMoneda[item]}`}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <TextLabel title='Monto' />
          <NumericInputForm
            paso={0.01}
            titulo='monto'
            min={0}
            defaultValue={parseFloat(0)}
            formato='precio'
            //onChange={onChange}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>
      <TextLabel title='Número de Operación' />
      <InputForm
        titulo='num_operacion'
        mensaje='Asigna un número de operación.'
        placeholder='Agrega un número de operación.'
      />
      <TextLabel title='Nombre del banco' />
      <InputForm
        titulo='nom_banco_ord_ext'
        mensaje='Asigna el nombre del banco.'
        placeholder='Agrega el nombre del banco.'
      />
      <TextLabel title='RFC Emisor Cuenta Ordenante' />
      <InputForm
        titulo='rfc_emisor_cta_ord'
        mensaje='Asigna el RFC Emisor Cuenta Ordenante.'
        placeholder='Agrega el RFC Emisor Cuenta Ordenante.'
        rules={{
          pattern:
            '[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]',
          message: 'Ingrese un RFC válido.',
        }}
        //required={false}
        max={13}
      />
      <TextLabel title='Cuenta Ordenante' />
      <InputForm
        titulo='cta_ordenante'
        mensaje='Asigna el nombre de la Cuenta Ordenante.'
        placeholder='Agrega el nombre de al Cuenta Ordenante.'
      />
      <TextLabel title='RFC Emisor Cuenta Beneficiario' />
      <InputForm
        titulo='rfc_emisor_cta_ben'
        mensaje='Asigna el RFC Emisor Cuenta Beneficiario.'
        placeholder='Agrega el RFC Emisor Cuenta Beneficiario.'
        rules={{
          pattern:
            '[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]',
          message: 'Ingrese un RFC válido.',
        }}
        //required={false}
        max={13}
      />
      <TextLabel title='Cuenta Beneficiario' />
      <InputForm
        titulo='cta_beneficiario'
        mensaje='Asigna el nombre de la Cuenta Beneficiario.'
        placeholder='Agrega el nombre de al Cuenta Beneficiario.'
      />
      <TextLabel title='Relacionar pago con documento (Opcional)' />
      <DocumentList lista={documentos} cambiarLista={onSetDocumentos} />
      <TextLabel title='Archivo Comprobante' />
      {'subir archivos cms'}
      <br />
      <Form.Item name='boton'>
        <Button
          style={{ margin: '0 auto', display: 'block' }}
          type='primary'
          htmlType='submit'
        >
          Guardar Pago
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Index;
