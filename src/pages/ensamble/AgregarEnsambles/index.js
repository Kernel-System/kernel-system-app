import AddProduct from 'components/ensamble/AddProduct';
import { useState } from 'react';
import { Typography, Input, Space, Button, Form, Select } from 'antd';
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Index = () => {
  const [list, setList] = useState({
    descripcion: '',
    observaciones: '',
    empleado_orden: '',
    productos: {
      //{ codigo: '', cantidad: 0, descripcion: '' }
      tarjeta_madre: [],
      procesador: [],
      ram: [],
      disco_duro: [],
      tarjeta_video: [],
      gabinete: [],
      fuente_poder: [],
      disco_optico: [],
      perifericos: [],
      sistema_operativo: [],
    },
  });

  const changeProducts = (element, title) => {
    const lista = JSON.parse(JSON.stringify(list));
    lista.productos[title] = element;
    setList(JSON.parse(JSON.stringify(lista)));
  };

  const changeElements = (value, title) => {
    const lista = JSON.parse(JSON.stringify(list));
    lista[title] = value;
    setList(JSON.parse(JSON.stringify(lista)));
  };

  const onFinish = () => {
    console.log('Success:', list);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name='basic'
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Title>Nuevo Ensamble</Title>
      <Title level={4}>Empleado de Ensamble</Title>
      <Form.Item
        name='ensamblador asignado'
        rules={[
          {
            required: true,
            message: `Asigna un Empleado`,
          },
        ]}
      >
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder='Buscar empleado'
          optionFilterProp='children'
          //onChange={onChange}
          //onFocus={onFocus}
          onChange={(value) => {
            changeElements(value, 'empleado_orden');
          }}
          //onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().iOf(input.toLowerCase()) >= 0
          }
        >
          <Option value='RFC 1'>Juan</Option>
          <Option value='RFC 2'>Pedro</Option>
        </Select>
      </Form.Item>
      <AddProduct
        titulo='Tarjeta Madre'
        tag='tarjeta_madre'
        noAdd={true}
        onChanged={changeProducts}
      />
      <AddProduct
        titulo='Procesador'
        tag='procesador'
        onChanged={changeProducts}
      />
      <AddProduct titulo='Memoria RAM' tag='ram' onChanged={changeProducts} />
      <AddProduct
        titulo='Disco Duro'
        tag='disco_duro'
        onChanged={changeProducts}
      />
      <AddProduct
        titulo='Tarjeta de Video'
        tag='tarjeta_video'
        isNeeded={false}
        onChanged={changeProducts}
      />
      <AddProduct
        titulo='Gabinete'
        tag='gabinete'
        noAdd={true}
        onChanged={changeProducts}
      />
      <AddProduct
        titulo='Fuente de Poder'
        tag='fuente_poder'
        onChanged={changeProducts}
      />
      <AddProduct
        titulo='Unidad de disco óptico'
        tag='disco_optico'
        isNeeded={false}
        onChanged={changeProducts}
      />
      <AddProduct
        titulo='Periféricos'
        tag='perifericos'
        isNeeded={false}
        onChanged={changeProducts}
      />
      <AddProduct
        titulo='Sistema Operativo'
        tag='sistema_operativo'
        noAdd={true}
        onChanged={changeProducts}
      />
      <Title level={4}>Descripción</Title>
      <Space direction='vertical' style={{ width: '100%' }}>
        <Form.Item
          name='descripcion'
          rules={[
            {
              required: true,
              message: `Asigna un(a) descripción`,
            },
          ]}
        >
          <TextArea
            //value={value}
            //placeholder='Controlled autosize'
            onBlur={(e) => {
              changeElements(e.target.value, 'descripcion');
            }}
            autoSize={{ minRows: 2, maxRows: 5 }}
            showCount
            maxLength={100}
            style={{ fontSize: '20' }}
          />
        </Form.Item>
        <Title level={4}>Observaciones</Title>
        <Form.Item
          name='observacion'
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
              changeElements(e.target.value, 'observaciones');
            }}
            autoSize={{ minRows: 2, maxRows: 5 }}
            showCount
            maxLength={100}
            style={{ fontSize: '20' }}
          />
        </Form.Item>
      </Space>
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
  );
};

export default Index;
