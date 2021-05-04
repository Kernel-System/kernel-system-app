import { Input, Button, Typography, Row, Col, Form, Select, Alert } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import InputForm from 'components/shared/ProductCard/InputForm';
const { Search } = Input;
const { Option } = Select;

const { Title } = Typography;

const Index = () => {
  const breakpoint = useBreakpoint();

  const onFinish = () => {
    console.log('Success:', 'lel');
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
        name='facturar_ticket'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Title>Facturar Ticket de Compra</Title>
        <Title level={4}>Número de ticket</Title>
        <InputForm
          titulo='no_ticket'
          mensaje='Asigna un número de ticket.'
          placeholder='Agrega un número de ticket.'
        />
        <Title level={4}>Nombre del Cliente</Title>
        <Search
          placeholder='Busca direcciones de cuenta.'
          allowClear
          enterButton='Buscar'
          size='large'
          onSearch={onSearch}
        />
        {'Espacio de direcciones'}
        <br />
        <Title level={4}>Agregar Dirección</Title>
        <Row key='columnas' gutter={[16, 24]} style={{ marginBottom: '10px' }}>
          <Col
            className='gutter-row'
            span={breakpoint.lg ? 12 : 24}
            style={{ marginBottom: '10px' }}
          >
            <Title level={5}>Datos Personales</Title>
            <InputForm
              titulo='nombres'
              mensaje='Asignar Nombre(s).'
              placeholder='Nombre(s).'
            />
            <InputForm
              titulo='apellidos'
              mensaje='Asignar Apellidos.'
              placeholder='Apellidos.'
            />
            <InputForm
              titulo='correo'
              mensaje='El correo electrónico no tiene un formato válido'
              placeholder='Correo Electrónico'
              type='email'
            />
            <InputForm
              titulo='telefono'
              mensaje='Asiga un numero tenefónico.'
              placeholder='Número Telefónico'
            />
          </Col>
          <Col
            className='gutter-row'
            span={breakpoint.lg ? 12 : 24}
            style={{ marginBottom: '10px' }}
          >
            <Title level={5}>Datos de facturación</Title>
            <Form.Item
              key='cfdi'
              name='cfdi'
              rules={[
                {
                  required: true,
                  message: `Seleccione un CFDI.`,
                },
              ]}
            >
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder='Uso de CFDI'
                optionFilterProp='children'
                size='large'
                onChange={(value) => {
                  handleChange(value);
                }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                <Option value='1'>Compra lapiz</Option>
                <Option value='2'>Venta de carritos</Option>
              </Select>
            </Form.Item>
            <InputForm
              titulo='razon_social'
              mensaje='Asigna una razón social.'
              placeholder='Razón Social.'
            />
            <InputForm
              titulo='razon_social'
              mensaje='Asigna una razón social.'
              placeholder='Razón Social.'
            />
            <InputForm
              titulo='rfc'
              mensaje='Asigna un RFC.'
              placeholder='RFC.'
            />
            <InputForm
              titulo='calle'
              mensaje='Asigna una calle.'
              placeholder='Calle.'
            />
            <Row key='columnas2' gutter={[8, 16]}>
              <Col className='gutter-row' span={12}>
                <InputForm
                  titulo='calle1'
                  mensaje='Asigna una calle1.'
                  placeholder='Calle1.'
                />
              </Col>
              <Col className='gutter-row' span={12}>
                <InputForm
                  titulo='calle1'
                  mensaje='Asigna una calle1.'
                  placeholder='Calle1.'
                />
              </Col>
            </Row>
            <Row key='columnas3' gutter={[4]}>
              <Col className='gutter-row' span={8}>
                <InputForm
                  titulo='no_int'
                  mensaje='Asigna un Número Interior.'
                  placeholder='No. Int.'
                />
              </Col>
              <Col className='gutter-row' span={8}>
                <InputForm
                  titulo='no_ext'
                  mensaje='Asigna un Número Exterior.'
                  placeholder='No. Ext.'
                />
              </Col>
              <Col className='gutter-row' span={8}>
                <InputForm
                  titulo='cp'
                  mensaje='Asigna un Código Postal.'
                  placeholder='C.P.'
                />
              </Col>
            </Row>
            <InputForm
              titulo='estado'
              mensaje='Asigna un Estado.'
              placeholder='Estado'
            />
            <InputForm
              titulo='municipio'
              mensaje='Asigna un Municipio.'
              placeholder='Municipio.'
            />
            <InputForm
              titulo='localidad'
              mensaje='Asigna una Localidad.'
              placeholder='Localidad.'
            />
            <InputForm
              titulo='colonia'
              mensaje='Asigna una Colonia.'
              placeholder='Colonia.'
            />
          </Col>
        </Row>

        <Alert
          message='La Factura será timbrada 24hrs hábiles después de realizar el pedido'
          type='info'
        />
        <br />
        <Form.Item name='boton'>
          <Button
            style={{ margin: '0 auto', display: 'block' }}
            type='primary'
            htmlType='submit'
          >
            Crear Orden de Ensamble
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Index;
