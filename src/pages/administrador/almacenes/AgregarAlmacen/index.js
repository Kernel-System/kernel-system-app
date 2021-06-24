import { Button, Form, Select, message } from 'antd';
import { useHistory, useRouteMatch } from 'react-router';
import HeadingBack from 'components/UI/HeadingBack';
import InputForm from 'components/shared/InputForm';
import { useEffect, useState } from 'react';
import { http } from 'api';
import TextLabel from 'components/UI/TextLabel';
import { useStoreState } from 'easy-peasy';
const { Option } = Select;

const Index = () => {
  const [almacen, setAlmacen] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const history = useHistory();
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let match = useRouteMatch();

  useEffect(() => {
    http.get(`/items/sucursales/`, putToken).then((resul) => {
      console.log(resul.data.data);
      onSetSucursales(resul.data.data);
    });
    http.get(`/items/empleados/`, putToken).then((resul) => {
      console.log(resul.data.data);
      onSetEmpleados(resul.data.data);
    });
    if (match.params.clave !== window.undefined) {
      http
        .get(`/items/almacenes/${match.params.clave}`, putToken)
        .then((resul) => {
          onSetAlmacen(resul.data.data);
        });
    } else onSetAlmacen([{}]);
  }, []);

  const onSetAlmacen = (lista) => {
    const newLista = JSON.parse(JSON.stringify(lista));
    setAlmacen([newLista]);
  };

  const onSetSucursales = (lista) => {
    const newLista = JSON.parse(JSON.stringify(lista));
    console.log(newLista);
    setSucursales(newLista);
  };

  const onSetEmpleados = (lista) => {
    const newLista = JSON.parse(JSON.stringify(lista));
    console.log(newLista);
    setEmpleados(newLista);
  };

  const onFinish = (datos) => {
    console.log(datos);
    http
      .post(
        '/items/almacenes/',
        {
          dimensiones: datos.dimensiones,
          rfc_encargado: datos.rfc_encargado,
          clave_sucursal: datos.clave_sucursal,
        },
        putToken
      )
      .then((resul) => {
        console.log(resul);
        Mensaje();
      })
      .catch((error) => {
        if (
          error.response.data.errors[0].extensions.code === 'RECORD_NOT_UNIQUE'
        ) {
          message.error('Clave ya existente');
        } else message.error('Un error ha ocurrido');
      });
  };

  const onFinishChange = (datos) => {
    console.log(datos);
    console.log(`/items/almacenes/${match.params.clave}`);
    http
      .patch(
        `/items/almacenes/${match.params.clave}`,
        {
          dimensiones: datos.dimensiones,
          rfc_encargado: datos.rfc_encargado,
          clave_sucursal: datos.clave_sucursal,
        },
        putToken
      )
      .then((resul) => {
        console.log(resul);
        Mensaje();
      })
      .catch((error) => {
        message.error('Un error ha ocurrido');
      });
  };

  const Mensaje = () => {
    message
      .success('El almacen ha sido registrado exitosamente', 3)
      .then(() => history.goBack());
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return almacen.map((dato) => {
    return (
      <Form
        name='basic'
        key='1'
        initialValues={{
          remember: true,
          clave: dato.clave,
          dimensiones: dato.dimensiones,
          rfc_encargado: dato.rfc_encargado,
          clave_sucursal: dato.clave_sucursal,
        }}
        onFinish={
          match.params.clave === window.undefined ? onFinish : onFinishChange
        }
        onFinishFailed={onFinishFailed}
      >
        <HeadingBack
          title={
            match.params.clave === window.undefined
              ? 'Nuevo Almacen'
              : `Almacen ${match.params.clave}`
          }
        />
        {match.params.clave === window.undefined ? null : (
          <TextLabel title='Clave' subtitle={dato.clave} />
        )}

        <TextLabel title='Dimensiones' />
        <InputForm
          titulo='dimensiones'
          //valueDef={dato.unidad_de_medida}
          mensaje='Asigna un nombre.'
          placeholder='Nombre'
          //required={false}
          max={45}
        />
        <TextLabel title='Encargado' />
        <Form.Item
          name='rfc_encargado'
          style={{ marginBottom: '20px' }}
          rules={[
            {
              required: true,
              message: 'Asigna un Encargado de Almacen',
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder='Seleccionar encargado'
            optionFilterProp='children'
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {empleados.map((empleado) => (
              <Option value={empleado.rfc} key={empleado.rfc}>
                {empleado.nombre}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <TextLabel title='Sucursal' />
        <Form.Item
          name='clave_sucursal'
          style={{ marginBottom: '20px' }}
          rules={[
            {
              required: true,
              message: 'Asigna una sucursal',
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder='Selecciona una sucursal'
            optionFilterProp='children'
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {sucursales.map((sucursal) => {
              return (
                <Option value={sucursal.clave} key={sucursal.clave}>
                  {`${sucursal.clave} : ${sucursal.nombre}`}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            style={{ margin: '0 auto', display: 'block' }}
            type='primary'
            htmlType='submit'
            size='large'
          >
            {match.params.clave === window.undefined
              ? 'Agregar Almacen'
              : `Modificar Almacen`}
          </Button>
        </Form.Item>
      </Form>
    );
  });
};

export default Index;
