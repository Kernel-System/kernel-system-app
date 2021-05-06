import { Input, Button, Typography, Form, Select, message } from 'antd';
import InputForm from 'components/shared/InputForm';
import AlmacenTable from 'components/table/NuevoAlmacenTable';
const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const index = () => {
  const onFinish = (values: any) => {
    console.log(values);
    if (!verificacion(values)) {
      message.success('Success');
    } else {
      message.error('Falta de llenar una forma de justificación.');
    }
  };

  const verificacion = (values) => {
    console.log(values.no_devolucion);
    if (
      verificarIndividual(values.no_devolucion) &&
      verificarIndividual(values.rma) &&
      verificarIndividual(values.no_ensamble) &&
      verificarIndividual(values.no_factura) &&
      verificarIndividual(values.no_transferencia)
    ) {
      return true;
    } else return false;
  };

  const verificarIndividual = (valor) => {
    if (valor === undefined) {
      return true;
    } else if (valor.split(' ').join('') === '') {
      return true;
    } else return false;
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  const onSearch = (value) => console.log(value);

  return (
    <div>
      <Form
        name='nuevo_movimiento'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Title>Almacén</Title>
        <Title level={4}>Concepto</Title>
        <Form.Item
          key='concepto'
          name='concepto'
          rules={[
            {
              required: true,
              message: `Seleccione un concepto.`,
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: '50%' }}
            placeholder='Concepto'
            optionFilterProp='children'
            size='large'
            onChange={(value) => {
              handleChange(value);
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
          >
            <Option value='1'>Devolución</Option>
            <Option value='2'>XD</Option>
          </Select>
        </Form.Item>
        <Title level={2}>Justificación</Title>
        <Text type='secondary'>
          Debe llenar mínimo 1 de los campos a continuación.
        </Text>

        <Title level={4}>Folio de RMA</Title>
        <InputForm
          titulo='rma'
          mensaje='Asignar RMA.'
          placeholder='RMA'
          required={false}
        />
        <Title level={4}>Número de Factura</Title>
        <InputForm
          titulo='no_factura'
          mensaje='Asignar un número de factura.'
          placeholder='Número de factura'
          required={false}
        />
        <Title level={4}>Número de Devolución</Title>
        <InputForm
          titulo='no_devolucion'
          mensaje='Asignar un número de devolución.'
          placeholder='Número de devolución'
          required={false}
        />
        <Title level={4}>Número de Ensamble</Title>
        <InputForm
          titulo='no_ensamble'
          mensaje='Asignar un número de ensamble.'
          placeholder='Número de ensamble'
          required={false}
        />
        <Title level={4}>Solicitud de Transferencia</Title>
        <InputForm
          titulo='no_transferencia'
          mensaje='Asignar una solicitud de transferencia.'
          placeholder='Solicitud de transferencia.'
          required={false}
        />
        <Title level={4}>Comentario</Title>
        <Form.Item
          name='comentario'
          rules={[
            {
              required: false,
            },
          ]}
        >
          <TextArea
            //value={value}
            //placeholder='Controlled autosize'observaciones
            onBlur={(e) => {
              console.log(e.target.value, 'comentario');
            }}
            autoSize={{ minRows: 2, maxRows: 5 }}
            showCount
            maxLength={100}
            style={{ fontSize: '20' }}
          />
        </Form.Item>
        <Title level={4}>Productos</Title>
        <Search
          placeholder='Ingrese nombre del producto/codigo.'
          allowClear
          enterButton='Buscar'
          size='large'
          onSearch={onSearch}
        />

        <br />
        <br />
        <AlmacenTable />

        <Form.Item name='boton'>
          <Button
            style={{ margin: '0 auto', display: 'block' }}
            type='primary'
            htmlType='submit'
          >
            Realizar Movimiento
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default index;
