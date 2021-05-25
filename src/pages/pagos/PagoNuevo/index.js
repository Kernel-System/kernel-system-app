import {
  Button,
  Row,
  Col,
  Form,
  Select,
  message,
  DatePicker,
  InputNumber,
  Upload,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import InputForm from 'components/shared/InputForm';
import HeadingBack from 'components/UI/HeadingBack';
import TextLabel from 'components/UI/TextLabel';
import DocumentList from 'components/table/DocumentTable';
const { Option } = Select;
const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const Index = () => {
  const breakpoint = useBreakpoint();

  const onFinish = (value: any) => {
    message.success('Success');
    console.log(value);
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error('error');
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name='pago_nuevo'
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <HeadingBack title='Pago' />
      <Row key='columnas' gutter={[16, 8]} style={{ marginBottom: '10px' }}>
        <Col
          className='gutter-row'
          span={breakpoint.lg ? 12 : 24}
          style={{ marginBottom: '10px' }}
        >
          <TextLabel title='Folio de Factura' />
          <InputForm
            titulo='folio_factura'
            mensaje='Asigna un folio de factura.'
            placeholder='Agrega un folio de factura.'
          />
          <TextLabel title='Forma de Pago' />
          <Form.Item
            key='forma_pago'
            name='forma_pago'
            rules={[
              {
                required: true,
                message: 'Asigna una forma de pago',
              },
            ]}
          >
            <Select
              key='forma_pago_select'
              defaultValue='transferencia'
              style={{ width: '100%' }}
              //onChange={handleChange}
            >
              <Option value='transferencia'>Transferencia</Option>
              <Option value='efectivo'>Efectivo</Option>
            </Select>
          </Form.Item>
          <TextLabel title='Tipo de cambio' />
          <Form.Item
            key='tipo_pago'
            name='tipo_pago'
            rules={[
              {
                required: true,
                message: 'Asigna un tipo de cambio',
              },
            ]}
          >
            <Select
              key='forma_pago_select'
              defaultValue='1'
              style={{ width: '100%' }}
              //onChange={handleChange}
            >
              <Option value='1'>Cambio 1</Option>
              <Option value='2'>Cambio 2</Option>
            </Select>
          </Form.Item>
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
              placeholder='Selecciona la fecha'
            />
          </Form.Item>
          <TextLabel title='Moneda' />
          <Form.Item
            key='moneda'
            name='moneda'
            rules={[
              {
                required: true,
                message: 'Asigna una moneda de pago.',
              },
            ]}
          >
            <Select
              key='moneda_select'
              defaultValue='mxn'
              style={{ width: '100%' }}
              //onChange={handleChange}
            >
              <Option value='mxn'>Pesos Mexicanos</Option>
              <Option value='us'>Dolares Estadounidenses</Option>
            </Select>
          </Form.Item>
          <TextLabel title='Monto' />
          <Form.Item
            key='monto'
            name='monto'
            rules={[
              {
                required: true,
                message: 'Asigna un monto de pago.',
              },
            ]}
          >
            <InputNumber
              defaultValue={0}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              //onChange={onChange}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>
      <TextLabel title='Número de Operación' />
      <InputForm
        titulo='no_operacion'
        mensaje='Asigna un número de operación.'
        placeholder='Agrega un número de operación.'
      />
      <TextLabel title='Nombre del banco' />
      <InputForm
        titulo='nombre_banco'
        mensaje='Asigna el nombre del banco.'
        placeholder='Agrega el nombre del banco.'
      />
      <TextLabel title='RFC Emisor Cuenta Ordenante' />
      <InputForm
        titulo='rfc_ordenante'
        mensaje='Asigna el RFC Emisor Cuenta Ordenante.'
        placeholder='Agrega el RFC Emisor Cuenta Ordenante.'
      />
      <TextLabel title='Cuenta Ordenante' />
      <InputForm
        titulo='cuenta_ordenante'
        mensaje='Asigna el nombre de la Cuenta Ordenante.'
        placeholder='Agrega el nombre de al Cuenta Ordenante.'
      />
      <TextLabel title='RFC Emisor Cuenta Beneficiario' />
      <InputForm
        titulo='rfc_beneficiario'
        mensaje='Asigna el RFC Emisor Cuenta Beneficiario.'
        placeholder='Agrega el RFC Emisor Cuenta Beneficiario.'
      />
      <TextLabel title='Cuenta Beneficiario' />
      <InputForm
        titulo='cuenta_beneficiario'
        mensaje='Asigna el nombre de la Cuenta Beneficiario.'
        placeholder='Agrega el nombre de al Cuenta Beneficiario.'
      />
      <TextLabel title='Relacionar pago con documento (Opcional)' />
      <DocumentList />
      <TextLabel title='Archivo Comprobante' />
      <Dragger {...props}>
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>
          Click o arrastre el archivo para subirlo.
        </p>
        <p className='ant-upload-hint'>
          Soporta multiples archivos con un peso menor a 5 MB.
        </p>
      </Dragger>
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
