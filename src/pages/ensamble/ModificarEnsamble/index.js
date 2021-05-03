import ShowProduct from 'components/ensamble/ShowProduct';
import { useState, useEffect } from 'react';
import { Typography, Input, Space, Button, Form } from 'antd';
const { Title, Text } = Typography;
const { TextArea } = Input;

const Index = () => {
  const [list, setList] = useState({
    folio: '00000001',
    descripcion: 'Soy una descripcion',
    observaciones: 'Observación',
    estado: 'Creado',
    empleado_orden: 'RFC000001',
    productos: {
      tarjeta_madre: [
        {
          id: 1,
          codigo: '01',
          cantidad: 1,
          descripcion: 'tarjeta madre',
          series: [],
        },
      ],
      procesador: [
        {
          id: 2,
          codigo: '02',
          cantidad: 1,
          descripcion: 'procesador',
          series: [],
        },
      ],
      ram: [
        {
          id: 3,
          codigo: '03',
          cantidad: 2,
          descripcion: 'ram',
          series: [],
        },
      ],
      disco_duro: [
        {
          id: 4,
          codigo: '04',
          cantidad: 2,
          descripcion: 'disco duro',
          series: [],
        },
        {
          id: 5,
          codigo: '05',
          cantidad: 1,
          descripcion: 'disco duro 2',
          series: [],
        },
      ],
      tarjeta_video: [
        {
          id: 6,
          codigo: '06',
          cantidad: 1,
          descripcion: 'tarjeta video',
          series: [],
        },
      ],
      gabinete: [
        {
          id: 1,
          codigo: '02',
          cantidad: 1,
          descripcion: 'disco duro',
          series: [],
        },
      ],
      fuente_poder: [
        {
          id: 7,
          codigo: '07',
          cantidad: 1,
          descripcion: 'fuente poder',
          series: [],
        },
      ],
      disco_optico: [],
      perifericos: [],
      sistema_operativo: [
        {
          id: 7,
          codigo: '07',
          cantidad: 1,
          descripcion: 'sistema operativo',
          series: [],
        },
      ],
    },
  });

  useEffect(() => {
    // Your code here
  }, []);

  const changeSeries = (serie, title, indice, number) => {
    const lista = JSON.parse(JSON.stringify(list));
    lista.productos[title][indice].series[number] = serie;
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
      <Title>Mostrar Ensamble {list.folio}</Title>
      <Title level={4}>Estado</Title>
      <Text>{list.estado}</Text>
      <Title level={4}>Empleado de Ensamble</Title>
      <Text>{list.empleado_orden}</Text>
      <ShowProduct
        titulo='Tarjeta Madre'
        tag='tarjeta_madre'
        filas={list.productos.tarjeta_madre}
        onChanged={changeSeries}
      />
      <ShowProduct
        titulo='Procesador'
        tag='procesador'
        filas={list.productos.procesador}
        onChanged={changeSeries}
      />
      <ShowProduct
        titulo='Memoria RAM'
        tag='ram'
        filas={list.productos.ram}
        onChanged={changeSeries}
      />
      <ShowProduct
        titulo='Disco Duro'
        tag='disco_duro'
        filas={list.productos.disco_duro}
        onChanged={changeSeries}
      />
      <ShowProduct
        titulo='Tarjeta de Video'
        tag='tarjeta_video'
        filas={list.productos.tarjeta_video}
        onChanged={changeSeries}
      />
      <ShowProduct
        titulo='Gabinete'
        tag='gabinete'
        filas={list.productos.gabinete}
        onChanged={changeSeries}
      />
      <ShowProduct
        titulo='Fuente de Poder'
        tag='fuente_poder'
        filas={list.productos.fuente_poder}
        onChanged={changeSeries}
      />
      <ShowProduct
        titulo='Unidad de disco óptico'
        tag='disco_optico'
        filas={list.productos.disco_optico}
        onChanged={changeSeries}
      />
      <ShowProduct
        titulo='Periféricos'
        tag='perifericos'
        filas={list.productos.perifericos}
        onChanged={changeSeries}
      />
      <ShowProduct
        titulo='Sistema Operativo'
        tag='sistema_operativo'
        filas={list.productos.sistema_operativo}
        onChanged={changeSeries}
      />
      <Title level={4}>Descripción</Title>
      <Space direction='vertical' style={{ width: '100%' }}>
        <Text>{list.descripcion}</Text>
        <Title level={4} style={{ marginTop: '20px' }}>
          Observaciones
        </Title>
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
              //             changeElements(e.target.value, 'observaciones');
            }}
            defaultValue={list.observaciones}
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
          Iniciar Ensamble
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Index;
