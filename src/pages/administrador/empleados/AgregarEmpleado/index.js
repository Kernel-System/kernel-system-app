import { Button, Col, Form, message, Row, Select, Typography } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { http } from 'api';
import InputForm from 'components/shared/InputForm';
import NumericInputForm from 'components/shared/NumericInputForm';
import HeadingBack from 'components/UI/HeadingBack';
import { useStoreState } from 'easy-peasy';
import { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import {
  calleRules,
  coloniaRules,
  cpRules,
  noIntRules,
} from 'utils/validations/address';

const { Title } = Typography;
const { Option } = Select;

const Index = () => {
  const [empleado, setEmpleado] = useState([]);
  const [mail, setMail] = useState('');
  const [almacenes, setAlmacenes] = useState([]);
  const [sucursal, setSucursal] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const history = useHistory();
  let match = useRouteMatch();
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (match.params.rfc !== window.undefined) {
      http
        .get(
          `/items/empleados/${match.params.rfc}?fields=*,cuenta.id,cuenta.email`,
          putToken
        )
        .then((resul) => {
          onSetCorreo(resul.data.data.cuenta.email);
          onSetEmpleado(resul.data.data);
        });
    } else onSetEmpleado([{}]);
    http.get(`/items/sucursales/`, putToken).then((result) => {
      onSetSucursales(result.data.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    http
      .get(
        `/items/almacenes/?filter[clave_sucursal][_in]=${sucursal}`,
        putToken
      )
      .then((result) => {
        onSetAlmacenes(result.data.data);
      });
  }, [sucursal]);

  const onSetEmpleado = (lista) => {
    const newLista = JSON.parse(JSON.stringify(lista));
    setEmpleado([newLista]);
  };

  const onSetAlmacenes = (lista) => {
    const newLista = JSON.parse(JSON.stringify(lista));
    setAlmacenes(newLista);
  };

  const onSetSucursales = (lista) => {
    const newLista = JSON.parse(JSON.stringify(lista));
    setSucursales(newLista);
  };

  const onSetCorreo = (correo) => {
    setMail(correo);
  };

  const onFinish = (dato) => {
    console.log(dato);
    http
      .post(
        '/users/',
        {
          email: dato.correo,
          password: dato.password,
          role: dato.puesto,
          rfc: dato.rfc,
        },
        putToken
      )
      .then((resul1) => {
        console.log(resul1);
        http
          .post(
            '/items/empleados/',
            {
              rfc: dato.rfc,
              nombre: dato.nombre,
              puesto: dato.puesto,
              no_seguro_social: dato.no_seguro_social,
              extension: dato.extension,
              telefono: dato.telefono,
              estado: dato.estado,
              municipio: dato.municipio,
              localidad: dato.localidad,
              calle: dato.calle,
              no_ext: dato.no_ext,
              no_int: dato.no_int,
              colonia: dato.colonia,
              cp: dato.cp,
              entre_calle_1: dato.entre_calle_1,
              entre_calle_2: dato.entre_calle_2,
              sucursal: dato.sucursal,
              almacen: dato.almacen,
            },
            putToken
          )
          .then((resul) => {
            console.log(resul);
            http
              .patch(
                `/users/${resul1.data.data.id}`,
                {
                  rfc: dato.rfc,
                },
                putToken
              )
              .then(() => {
                Mensaje();
              });
          })
          .catch((error) => {
            if (
              error.response.data.errors[0].extensions.code ===
              'RECORD_NOT_UNIQUE'
            ) {
              message.error('Clave ya existente');
            } else message.error('Un error ha ocurrido');
          });
      });
  };

  const onFinishChange = (dato) => {
    console.log(dato);
    console.log(`/users/${empleado[0].cuenta.id}`);
    http
      .patch(
        `/users/${empleado[0].cuenta.id}`,
        {
          email: dato.correo,
          password: dato.password,
          role: dato.puesto,
        },
        putToken
      )
      .then((resul) => {
        http
          .patch(
            `/items/empleados/${match.params.rfc}`,
            {
              rfc: dato.rfc,
              nombre: dato.nombre,
              puesto: dato.puesto,
              no_seguro_social: dato.no_seguro_social,
              extension: dato.extension,
              telefono: dato.telefono,
              estado: dato.estado,
              municipio: dato.municipio,
              localidad: dato.localidad,
              calle: dato.calle,
              no_ext: dato.no_ext,
              no_int: dato.no_int,
              colonia: dato.colonia,
              cp: dato.cp,
              entre_calle_1: dato.entre_calle_1,
              entre_calle_2: dato.entre_calle_2,
              sucursal: dato.sucursal,
              almacen: dato.almacen,
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
      });
  };

  const Mensaje = () => {
    message
      .success('El empleado ha sido registrado exitosamente', 3)
      .then(() => history.goBack());
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const breakpoint = useBreakpoint();

  return empleado.map((dato) => {
    return (
      <Form
        name='basic'
        key='1'
        initialValues={{
          remember: true,
          rfc: dato.rfc,
          nombre: dato.nombre,
          puesto: dato.puesto,
          correo: mail,
          no_seguro_social: dato.no_seguro_social,
          extension: dato.extension,
          telefono: dato.telefono,
          estado: dato.estado,
          municipio: dato.municipio,
          localidad: dato.localidad,
          calle: dato.calle,
          no_ext: dato.no_ext,
          no_int: dato.no_int,
          colonia: dato.colonia,
          cp: dato.cp,
          entre_calle_1: dato.entre_calle_1,
          entre_calle_2: dato.entre_calle_2,
        }}
        onFinish={
          match.params.rfc === window.undefined ? onFinish : onFinishChange
        }
        onFinishFailed={onFinishFailed}
      >
        <HeadingBack
          title={
            match.params.rfc === window.undefined
              ? 'Nuevo Empleado'
              : `Empleado ${match.params.rfc}`
          }
        />
        <Title level={5}>RFC</Title>
        <InputForm
          enable={match.params.rfc !== window.undefined ? true : false}
          titulo='rfc'
          //valueDef={dato.unidad_de_medida}
          mensaje='Asigna un rfc.'
          placeholder='RFC'
          rules={{
            pattern:
              '[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]',
            message: 'Ingrese un RFC válido.',
          }}
          //required={false}
          max={13}
        />
        <Title level={5}>Nombre</Title>
        <InputForm
          titulo='nombre'
          enable={match.params.rfc !== window.undefined ? true : false}
          //valueDef={dato.unidad_de_medida}
          mensaje='Asigna un nombre.'
          placeholder='Nombre'
          //required={false}
          max={45}
        />
        <Title level={5}>Correo Electrónico</Title>
        <InputForm
          titulo='correo'
          type='email'
          enable={match.params.rfc !== window.undefined ? true : false}
          //valueDef={dato.unidad_de_medida}
          mensaje='Asigna un correo.'
          placeholder='Correo Electrónico.'
          //required={false}
          max={45}
        />
        <Title level={5}>Contraseña</Title>
        <InputForm
          titulo='password'
          //valueDef={dato.unidad_de_medida}
          mensaje='Asigna una contraseña.'
          placeholder='Contraseña'
          //required={false}
          max={45}
        />
        <Title level={5}>Puesto</Title>
        <Form.Item
          name='puesto'
          style={{ marginBottom: '20px' }}
          rules={[
            {
              required: true,
              message: 'Asigna un Puesto',
            },
          ]}
        >
          <Select
            style={{ width: '100%' }}
            placeholder='Seleccionar un Puesto'
            optionFilterProp='children'
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option
              value='002b6741-eff7-4834-8a79-4f80034f6b40'
              key='002b6741-eff7-4834-8a79-4f80034f6b40'
            >
              Encargado de almacen
            </Option>
            <Option
              value='319af35a-79ae-45b3-99f5-0ee2af47973d'
              key='319af35a-79ae-45b3-99f5-0ee2af47973d'
            >
              Encargado de ventas
            </Option>
            <Option
              value='39234854-dd25-430d-a6ce-0a6ba3532764'
              key='39234854-dd25-430d-a6ce-0a6ba3532764'
            >
              Encargado de compras
            </Option>
            <Option
              value='39de2a37-7c23-4ca1-9c83-ee7263a7adc7'
              key='39de2a37-7c23-4ca1-9c83-ee7263a7adc7'
            >
              Cuentas por cobrar
            </Option>
            <Option
              value='3afe4f4d-7125-45d5-ba57-402221ef956d'
              key='3afe4f4d-7125-45d5-ba57-402221ef956d'
            >
              Encargado de ensambles
            </Option>
            <Option
              value='d5432f92-7a74-4372-907c-9868507e0fd5'
              key='d5432f92-7a74-4372-907c-9868507e0fd5'
            >
              Administrator
            </Option>
          </Select>
        </Form.Item>
        <Title level={5}>Sucursal</Title>
        <Form.Item
          name='sucursal'
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
            placeholder='Buscar un almacén'
            optionFilterProp='children'
            onChange={(value) => {
              setSucursal(value);
            }}
            //onFocus={onFocus}
            //onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {sucursales.map((sucursal) => (
              <Option
                value={sucursal.clave}
                key={sucursal.clave}
              >{`${sucursal.clave} : ${sucursal.nombre} `}</Option>
            ))}
          </Select>
        </Form.Item>

        <Title level={5}>Almacén</Title>
        <Form.Item
          name='almacen'
          rules={[
            {
              required: true,
              message: 'Asigna un almacen',
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder='Buscar un almacén'
            optionFilterProp='children'
            //onFocus={onFocus}
            //onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {almacenes.map((almacen) => (
              <Option
                value={almacen.clave}
                key={almacen.clave}
              >{`${almacen.clave} : ${almacen.clave_sucursal} `}</Option>
            ))}
          </Select>
        </Form.Item>

        <Row key='Row1' gutter={[16, 24]} style={{ marginBottom: '10px' }}>
          <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
            <Title level={5}>Teléfono</Title>
            <InputForm
              titulo='telefono'
              type='number'
              valueDef={dato.telefono}
              min='1'
              max='9999999999'
              placeholder='Clave'
              rules={{
                pattern: '[0-9]{10}',
                message: '10 digitos numericos',
              }}
              mensaje='Asigna una teléfono.'
            />
            <Title level={5}>Municipio</Title>
            <InputForm
              titulo='municipio'
              //valueDef={dato.unidad_de_medida}
              mensaje='Asigna un Municipio.'
              placeholder='Municipio'
              //required={false}
              max={100}
            />
            <Title level={5}>Calle</Title>
            <InputForm
              titulo='calle'
              //valueDef={dato.unidad_de_medida}
              mensaje='Asigna un Calle.'
              placeholder='Calle'
              //required={false}
              rules={{ ...calleRules }}
              max={100}
            />
            <Title level={5}>Entre Calle 1</Title>
            <InputForm
              titulo='entre_calle_1'
              //valueDef={dato.unidad_de_medida}
              mensaje='Asigna una Entre Calle 1.'
              placeholder='Calle 1'
              rules={{ ...calleRules }}
              //required={false}
              max={100}
            />
            <Row key='Row3' gutter={[16, 24]} style={{ marginBottom: '10px' }}>
              <Col className='gutter-row' span={8}>
                <Title level={5}>No. Ext.</Title>
                <NumericInputForm
                  titulo='no_ext'
                  valueDef={dato.no_ext}
                  min='01'
                  max='999999'
                  placeholder='No. Ext.'
                  mensaje='Asigna un No. Ext.'
                />
              </Col>
              <Col className='gutter-row' span={8}>
                <Title level={5}>No. Int.</Title>
                <InputForm
                  titulo='no_int'
                  valueDef={dato.no_int}
                  required={false}
                  min='1'
                  max='5'
                  placeholder='No. Int.'
                  rules={{ ...noIntRules }}
                  mensaje='Asigna un No. Int.'
                />
              </Col>
              <Col className='gutter-row' span={8}>
                <Title level={5}>C.P.</Title>
                <NumericInputForm
                  titulo='cp'
                  valueDef={dato.cp}
                  min='01'
                  max='99999'
                  placeholder='C.P.'
                  rules={{ ...cpRules }}
                  mensaje='Asigna un C.P.'
                />
              </Col>
            </Row>
          </Col>
          <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
            <Title level={5}>Estado</Title>
            <InputForm
              titulo='estado'
              //valueDef={dato.unidad_de_medida}
              mensaje='Asigna un Estado.'
              placeholder='Estado'
              //required={false}
              max={45}
            />
            <Title level={5}>Localidad</Title>
            <InputForm
              titulo='localidad'
              //valueDef={dato.unidad_de_medida}
              mensaje='Asigna un Localidad.'
              placeholder='Localidad'
              //required={false}
              max={100}
            />
            <Title level={5}>Colonia</Title>
            <InputForm
              titulo='colonia'
              //valueDef={dato.unidad_de_medida}
              mensaje='Asigna un Colonia.'
              placeholder='Colonia'
              rules={{ ...coloniaRules }}
              //required={false}
              max={100}
            />
            <Title level={5}>Entre Calle 2</Title>
            <InputForm
              titulo='entre_calle_2'
              //valueDef={dato.unidad_de_medida}
              mensaje='Asigna una Entre Calle 2.'
              placeholder='Calle 2'
              rules={{ ...calleRules }}
              //required={false}
              max={100}
            />
            <Title level={5}>No. Seguro Social</Title>
            <InputForm
              titulo='no_seguro_social'
              type='number'
              valueDef={dato.no_seguro_social}
              min='11'
              max='11'
              placeholder='No. Seguro Social'
              rules={{
                pattern: '[0-9]{11}',
                message: 'Asigna un No. Seguro Social con 11 digitos.',
              }}
            />
          </Col>
        </Row>
        <Form.Item>
          <Button
            style={{ margin: '0 auto', display: 'block' }}
            type='primary'
            htmlType='submit'
            size='large'
          >
            {match.params.rfc === window.undefined
              ? 'Agregar Empleado'
              : `Modificar Empleado`}
          </Button>
        </Form.Item>
      </Form>
    );
  });
};

export default Index;
