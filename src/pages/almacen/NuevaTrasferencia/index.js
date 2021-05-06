import {
  Input,
  Button,
  Typography,
  Row,
  Col,
  Form,
  Select,
  message,
  DatePicker,
  PageHeader,
} from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import InputForm from 'components/shared/InputForm';
import CantidadTable from 'components/table/CantidadTable';
import { useHistory } from 'react-router-dom';
const { Search } = Input;
const { Option } = Select;

const { Title } = Typography;

const Index = () => {
  const breakpoint = useBreakpoint();
  const history = useHistory();

  const onFinish = (values: any) => {
    console.log(values);
    message.success('Success');
  };
  const onFinishFailed = (errorInfo: any) => {
    message.error('Error al llenar los datos.');
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value) => console.log(value);

  return (
    <div>
      <PageHeader
        className='site-page-header'
        onBack={() => {
          history.goBack();
        }}
        title={<Title level={3}>Transferencia</Title>}
        style={{ padding: 0, marginBottom: '10px' }}
      />
      <Form
        name='nueva_transferencia'
        initialValues={{
          remember: true,
          almacen_origen: 'Almacén Actual',
          estado: 'pendiente',
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row key='columnas' gutter={[16, 24]}>
          <Col
            className='gutter-row'
            span={breakpoint.lg ? 12 : 24}
            style={{ marginBottom: '10px' }}
          >
            <Title level={5}>Estado</Title>
            <Form.Item
              key='estado'
              name='estado'
              rules={[
                {
                  required: true,
                  message: `Selecciona un estado`,
                },
              ]}
            >
              <Select
                key='estado_select'
                defaultValue='1'
                style={{ width: '100%' }}
                onChange={handleChange}
              >
                <Option value='1'>Pendiente</Option>
                <Option value='2'>Tranferido</Option>
                <Option value='3'>Recibido</Option>
              </Select>
            </Form.Item>
            <Title level={5}>Almacen de origen</Title>
            <InputForm
              titulo='almacen_origen'
              mensaje='Asignar un almacen de origen.'
              placeholder='Almacen de origen'
              required={true}
              valueDef='Almacén Actual'
              enable={true}
            />
          </Col>
          <Col
            className='gutter-row'
            span={breakpoint.lg ? 12 : 24}
            style={{ marginBottom: '10px' }}
          >
            <Title level={5}>Fecha estimada</Title>
            <Form.Item
              key='fecha_estimada'
              name='fecha estimada'
              rules={[
                {
                  required: true,
                  message: `Selecciona una fecha estimada`,
                },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder='Selecciona la fecha de entrega estimada'
              />
            </Form.Item>
            <Title level={5}>Almacen destino</Title>
            <Select
              key='almacen_destino'
              defaultValue='1'
              style={{ width: '100%' }}
              onChange={handleChange}
            >
              <Option value='1'>almacen 1</Option>
              <Option value='2'>almacen 2</Option>
              <Option value='3'>almacen 3</Option>
            </Select>
          </Col>
        </Row>
        <Title level={5}>Folio de factura</Title>
        <InputForm
          titulo='factura'
          mensaje='Asignar una factura.'
          placeholder='Factura'
          required={true}
        />
        <Title level={5}>Productos</Title>
        <Search
          placeholder='Ingrese nombre del producto/codigo.'
          allowClear
          enterButton='Buscar'
          onSearch={onSearch}
        />
        <br />
        <br />
        <CantidadTable />
        <Form.Item name='boton'>
          <Button
            style={{ margin: '0 auto', display: 'block' }}
            type='primary'
            htmlType='submit'
          >
            Realizar Transferencia
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Index;
