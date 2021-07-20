import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Typography,
} from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { http } from 'api';
import InputForm from 'components/shared/InputForm';
import NumericInputForm from 'components/shared/NumericInputForm';
import HeadingBack from 'components/UI/HeadingBack';
import { useStoreState } from 'easy-peasy';
import { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
const { Title } = Typography;
const { Option } = Select;

const Index = () => {
  const [cliente, setCliente] = useState([]);
  const [mail, setMail] = useState('');
  const history = useHistory();
  let match = useRouteMatch();
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (match.params.id !== window.undefined) {
      http
        .get(
          `/items/clientes/${match.params.id}?fields=*,cuenta.id,cuenta.email`,
          putToken
        )
        .then((resul) => {
          console.log(resul.data.data);
          onSetCorreo(resul.data.data.cuenta.email);
          onSetEmpleado(resul.data.data);
        });
    } else onSetEmpleado([{}]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSetEmpleado = (lista) => {
    const newLista = JSON.parse(JSON.stringify(lista));
    console.log(newLista);
    setCliente([newLista]);
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
          role: '76677353-b580-4090-83ca-0ca7c3965848',
          rfc: dato.rfc,
        },
        putToken
      )
      .then((resul) => {
        console.log(resul);
        http
          .post(
            '/items/clientes/',
            {
              rfc: dato.rfc,
              razon_social: dato.razon_social,
              nombre_comercial: dato.nombre_comercial,
              correo: mail,
              extension: dato.extension,
              telefono: dato.telefono,
              telefono_2: dato.telefono_2,
              saldo: dato.saldo,
              notas: dato.notas,
              nivel: dato.nivel,
              cuenta: resul.data.data.id,
            },
            putToken
          )
          .then((resul) => {
            console.log(resul);
            Mensaje();
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
    console.log(`/users/${cliente[0].cuenta.id}`);
    http
      .patch(
        `/users/${cliente[0].cuenta.id}`,
        {
          //email: dato.correo,
          password: dato.password,
        },
        putToken
      )
      .then((resul) => {
        http
          .patch(
            `/items/clientes/${match.params.id}`,
            {
              rfc: dato.rfc,
              razon_social: dato.razon_social,
              nombre_comercial: dato.nombre_comercial,
              correo: mail,
              extension: dato.extension,
              telefono: dato.telefono,
              telefono_2: dato.telefono_2,
              saldo: dato.saldo,
              notas: dato.notas,
              nivel: dato.nivel,
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
      .success('El cliente ha sido registrado exitosamente', 3)
      .then(() => history.goBack());
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const breakpoint = useBreakpoint();

  return cliente.map((dato) => {
    return (
      <Form
        name='basic'
        key='1'
        initialValues={{
          remember: true,
          rfc: dato.rfc,
          razon_social: dato.razon_social,
          nombre_comercial: dato.nombre_comercial,
          correo: mail,
          extension: dato.extension,
          telefono: dato.telefono,
          telefono_2: dato.telefono_2,
          saldo: dato.saldo,
          notas: dato.notas,
          nivel: dato.nivel,
        }}
        onFinish={
          match.params.id === window.undefined ? onFinish : onFinishChange
        }
        onFinishFailed={onFinishFailed}
      >
        <HeadingBack
          title={
            match.params.id === window.undefined
              ? 'Nuevo Cliente'
              : `Cliente ${match.params.id}`
          }
        />
        <Title level={5}>RFC</Title>
        <InputForm
          enable={match.params.id !== window.undefined ? true : false}
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
        <Title level={5}>Razón Social</Title>
        <InputForm
          titulo='razon_social'
          //valueDef={dato.unidad_de_medida}
          mensaje='Asigna un razón social.'
          placeholder='Razón Social'
          //required={false}
          max={45}
        />
        <Title level={5}>Nombre Comercial</Title>
        <InputForm
          titulo='nombre_comercial'
          //valueDef={dato.unidad_de_medida}
          mensaje='Asigna un nombre comercial.'
          placeholder='Nombre'
          //required={false}
          max={45}
        />
        <Title level={5}>Nivel</Title>
        <Form.Item
          name='nivel'
          rules={[
            {
              required: true,
              message: 'Asigna un Puesto',
            },
          ]}
        >
          <Select
            style={{ width: '100%' }}
            placeholder='Seleccionar un nivel'
            optionFilterProp='children'
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value='1' key='1'>
              Normal (1)
            </Option>
            <Option value='2' key='2'>
              Minorista (2)
            </Option>
            <Option value='3' key='3'>
              Mayorista (3)
            </Option>
          </Select>
        </Form.Item>
        <Title level={5}>Correo Electrónico</Title>
        <InputForm
          titulo='correo'
          type='email'
          enable={match.params.id !== window.undefined ? true : false}
          //valueDef={dato.unidad_de_medida}
          mensaje='Asigna un correo.'
          placeholder='Correo Electrónico.'
          //required={false}
          max={45}
        />
        <Title level={5}>Contraseña</Title>
        <Form.Item
          key='password'
          name='password'
          rules={[
            {
              required: true,
              message: `${'Agrega una contraseña'}`,
            },
          ]}
        >
          <Input.Password
            key={`contraseñainput`}
            placeholder='Asigna una contraseña.'
            maxLength={45}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
        <Row key='Row1' gutter={[16, 24]} style={{ marginBottom: '10px' }}>
          <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
            <Row key='Row2' gutter={[16, 24]}>
              <Col className='gutter-row' span={8}>
                <Title level={5}>Extension (Opc.)</Title>
                <NumericInputForm
                  titulo='extension'
                  //   valueDef={dato.extension}
                  min='01'
                  max='999'
                  placeholder='Extension'
                  mensaje='Asigna una extension.'
                />
              </Col>
              <Col className='gutter-row' span={16}>
                <Title level={5}>Teléfono</Title>
                <InputForm
                  titulo='telefono'
                  type='number'
                  //   valueDef={dato.telefono}
                  min='1'
                  max='10'
                  placeholder='Clave'
                  rules={{
                    pattern: '[0-9]{10}',
                    message: '10 digitos numericos',
                  }}
                  mensaje='Asigna una teléfono.'
                />
              </Col>
            </Row>
          </Col>
          <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
            <Title level={5}>Whatsapp (Opcional)</Title>
            <InputForm
              titulo='telefono_2'
              //   valueDef={dato.telefono_2}
              type='number'
              min='1'
              max='10'
              rules={{ pattern: '[0-9]{10}', message: '10 digitos numericos' }}
              placeholder='Whatsapp'
              required={false}
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
            {match.params.id === window.undefined
              ? 'Agregar Cliente'
              : `Modificar Cliente`}
          </Button>
        </Form.Item>
      </Form>
    );
  });
};

export default Index;
