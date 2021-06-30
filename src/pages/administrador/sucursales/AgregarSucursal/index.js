import { Button, Col, Form, message, Row, Typography } from 'antd';
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
  noExtRules,
  noIntRules,
} from 'utils/validations/address';

const { Title } = Typography;

const Index = () => {
  const [sucursal, setSucursal] = useState([]);
  const history = useHistory();
  let match = useRouteMatch();
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (match.params.clave !== window.undefined) {
      http
        .get(`/items/sucursales/${match.params.clave}`, putToken)
        .then((resul) => {
          onSetSucursal(resul.data.data);
        });
    } else onSetSucursal([{}]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSetSucursal = (lista) => {
    const newLista = JSON.parse(JSON.stringify(lista));
    console.log(newLista);
    setSucursal([newLista]);
  };

  const onFinish = (datos) => {
    console.log(datos);
    http
      .post(
        '/items/sucursales/',
        {
          clave: datos.clave,
          nombre: datos.nombre,
          rfc: datos.rfc,
          extension: datos.extension,
          telefono: datos.telefono,
          estado: datos.estado,
          municipio: datos.municipio,
          localidad: datos.localidad,
          calle: datos.calle,
          no_ext: datos.no_ext,
          no_int: datos.no_int,
          colonia: datos.colonia,
          cp: datos.cp,
          entre_calle_1: datos.entre_calle_1,
          entre_calle_2: datos.entre_calle_2,
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
    console.log(`/items/sucursales/${match.params.clave}`);
    http
      .patch(
        `/items/sucursales/${match.params.clave}`,
        {
          clave: datos.clave,
          nombre: datos.nombre,
          rfc: datos.rfc,
          extension: datos.extension,
          telefono: datos.telefono,
          estado: datos.estado,
          municipio: datos.municipio,
          localidad: datos.localidad,
          calle: datos.calle,
          no_ext: datos.no_ext,
          no_int: datos.no_int,
          colonia: datos.colonia,
          cp: datos.cp,
          entre_calle_1: datos.entre_calle_1,
          entre_calle_2: datos.entre_calle_2,
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
      .success('La sucursal ha sido registrada exitosamente', 3)
      .then(() => history.goBack());
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const breakpoint = useBreakpoint();

  return sucursal.map((dato) => {
    return (
      <Form
        name='basic'
        key='1'
        initialValues={{
          remember: true,
          clave: dato.clave,
          nombre: dato.nombre,
          rfc: dato.rfc,
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
          match.params.clave === window.undefined ? onFinish : onFinishChange
        }
        onFinishFailed={onFinishFailed}
      >
        <HeadingBack
          title={
            match.params.clave === window.undefined
              ? 'Nueva Sucursal'
              : `Sucursal ${match.params.clave}`
          }
        />
        <Title level={5}>Clave</Title>
        <InputForm
          enable={match.params.clave !== window.undefined}
          titulo='clave'
          mensaje='Asigna una clave.'
          placeholder='Clave'
          //required={false}
          max={100}
        />
        <Title level={5}>Nombre</Title>
        <InputForm
          titulo='nombre'
          enable={
            match.params.clave !== window.undefined
              ? dato.almacenes.length === 0
                ? false
                : true
              : false
          }
          //valueDef={dato.unidad_de_medida}
          mensaje='Asigna un nombre.'
          placeholder='Nombre'
          //required={false}
          max={45}
        />
        <Title level={5}>RFC</Title>
        <InputForm
          enable={
            match.params.clave !== window.undefined
              ? dato.almacenes.length === 0
                ? false
                : true
              : false
          }
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
        <Row key='Row1' gutter={[16, 24]} style={{ marginBottom: '10px' }}>
          <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
            <Row key='Row2' gutter={[16, 24]}>
              <Col className='gutter-row' span={12}>
                <Title level={5}>Extension</Title>
                <NumericInputForm
                  titulo='extension'
                  valueDef={dato.extension}
                  min='01'
                  max='999'
                  rules={{ ...noExtRules }}
                  placeholder='Extension'
                  mensaje='Asigna una extension.'
                />
              </Col>
              <Col className='gutter-row' span={12}>
                <Title level={5}>Teléfono</Title>
                <NumericInputForm
                  titulo='telefono'
                  valueDef={dato.telefono}
                  min='1'
                  max='9999999999'
                  placeholder='Clave'
                  mensaje='Asigna una teléfono.'
                />
              </Col>
            </Row>
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
          </Col>
        </Row>
        <Form.Item>
          <Button
            style={{ margin: '0 auto', display: 'block' }}
            type='primary'
            htmlType='submit'
            size='large'
          >
            {match.params.clave === window.undefined
              ? 'Agregar Sucursal'
              : `Modificar Sucursal`}
          </Button>
        </Form.Item>
      </Form>
    );
  });
};

export default Index;
