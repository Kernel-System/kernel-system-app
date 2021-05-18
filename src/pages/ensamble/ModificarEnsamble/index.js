import ShowProduct from 'components/ensamble/ShowProduct';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import {
  Typography,
  Input,
  Space,
  Button,
  Form,
  Row,
  Col,
  Popconfirm,
  message,
} from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import HeadingBack from 'components/UI/HeadingBack';
import TextLabel from 'components/UI/TextLabel';
import { http } from 'api';

const { Title } = Typography;
const { TextArea } = Input;

//encargado ensamble, encargado de almacen

const Index = ({ match }) => {
  const history = useHistory();
  const [list, setList] = useState({
    folio: 1,
    fecha_orden: '',
    fecha_inicio_ensamble: null,
    fecha_fin_ensamble: null,
    estado: 'ejemplo',
    descripcion: '',
    codigo_ensamble: '',
    //observaciones: '',
    rfc_empleado_orden: '',
    rfc_empleado_ensamble: '',
    componentes_ensamble: [],
  });
  const [editable, setEditable] = useState(true);
  const [editar, setEditar] = useState(false);

  useEffect(() => {
    http
      .get(
        `/items/ordenes_ensamble/${match.params.id}?fields=*,componentes_ensamble.id,componentes_ensamble.codigo,componentes_ensamble.cantidad,componentes_ensamble.descripcion,componentes_ensamble.etiqueta,componentes_ensamble.orden_ensamble,componentes_ensamble.series_componentes_ensamble,componentes_ensamble.series_componentes_ensamble.id,componentes_ensamble.series_componentes_ensamble.serie,componentes_ensamble.series_componentes_ensamble.componente_ensamble`
      )
      .then((result) => {
        console.log(result.data.data);
        ChangeList(result.data.data);
        if (result.data.data.estado === 'Ingresado en almacén')
          ChangeEditable(false);
      });
  }, []);

  const ChangeList = (lista) => {
    setList(lista);
  };

  const ChangeEditable = () => {
    setEditable(false);
  };

  const changeSeries = (serie, indice, number) => {
    const lista = JSON.parse(JSON.stringify(list));
    lista.componentes_ensamble[indice].series_componentes_ensamble[
      number
    ] = serie;
    console.log(lista.componentes_ensamble[indice]);
    setList(JSON.parse(JSON.stringify(lista)));
  };

  const onEstadoTitleButton = (estado) => {
    switch (estado) {
      case 'Ordenado':
        return 'Iniciar Ensamble';
      case 'En ensamble':
        return 'Notificar Realización del Ensamblado';
      case 'Ensamblado':
        return 'Ingresado en almacén';
      default:
        return 'Ensamble Finalizado';
    }
  };

  const onFinish = () => {
    let estado = {};
    switch (list.estado) {
      case 'Ordenado':
        estado = {
          estado: 'En ensamble',
          fecha_inicio_ensamble: obtenerFecha(),
          observaciones: list.observaciones,
        };
        break;
      case 'En ensamble':
        estado = {
          estado: 'Ensamblado',
          observaciones: list.observaciones,
        };
        break;
      case 'Ensamblado':
        estado = {
          estado: 'Ingresado en almacén',
          fecha_fin_ensamble: obtenerFecha(),
          observaciones: list.observaciones,
        };
        break;
      default:
        estado = {
          estado: list.estado,
          observaciones: list.observaciones,
        };
        break;
    }
    console.log(estado);
    http
      .patch(`/items/ordenes_ensamble/${match.params.id}`, estado)
      .then((result) => {
        console.log(result);
        let series = [];
        list.componentes_ensamble.map((componente) => {
          componente.series_componentes_ensamble.map((serie) => {
            series.push({
              ...serie,
            });
          });
        });
        if (list.estado === 'Ordenado')
          http
            .post('/items/series_componentes_ensamble', series)
            .then((result2) => {
              console.log(result2);
              console.log('ensamble iniciado');
              /*const ob3 = {
                serie:"",
                producto_movimiento:""
              };*/
              mensajeSuccess();
            });
        else mensajeSuccess();
      });
  };

  const obtenerFecha = () => {
    const date = new Date();
    return (
      date.getUTCFullYear() +
      '-' +
      ('00' + (date.getUTCMonth() + 1)).slice(-2) +
      '-' +
      ('00' + date.getUTCDate()).slice(-2) +
      ' ' +
      ('00' + date.getUTCHours()).slice(-2) +
      ':' +
      ('00' + date.getUTCMinutes()).slice(-2) +
      ':' +
      ('00' + date.getUTCSeconds()).slice(-2)
    );
  };

  const onFinishChange = () => {
    http
      .patch(`/items/ordenes_ensamble/${match.params.id}`, {
        observaciones: list.observaciones,
      })
      .then((resul) => {
        console.log(resul);
        actualizarSeries();
      });
  };

  const actualizarSeries = () => {
    let series = [];
    list.componentes_ensamble.map((componente) => {
      componente.series_componentes_ensamble.map((serie) => {
        series.push({
          ...serie,
        });
      });
    });
    console.log(series);
    http.post('/custom/ensamble/', { series: series }).then((result2) => {
      console.log(result2);
      mensajeSuccess();
    });
  };

  const mensajeSuccess = () => {
    message
      .success('Los cambios han sido registrados exitosamente', 3)
      .then(() => history.goBack());
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error('Ha sucedido un error ' + errorInfo, 5);
  };

  return list.componentes_ensamble.length !== 0 ? (
    <Form
      name='basic'
      initialValues={{ remember: true }}
      onFinish={!editar ? onFinish : onFinishChange}
      onFinishFailed={onFinishFailed}
    >
      <HeadingBack
        title={`Ensamble ${match.params.id}`}
        extra={list.fecha_orden}
      />
      <TextLabel title='Estado' description={list.estado} />
      <TextLabel
        title='Codigo del Producto'
        description={list.codigo_ensamble}
      />
      <TextLabel
        title='Empleado de Ensamble'
        description={list.rfc_empleado_ensamble}
      />
      {list.fecha_inicio_ensamble != null ? (
        <Row key='Row' gutter={[16, 24]} style={{ marginBottom: '10px' }}>
          <Col className='gutter-row' span={12}>
            <TextLabel
              title='Fecha de Inicio de Ensamble'
              description={list.fecha_inicio_ensamble}
            />
          </Col>
          <Col className='gutter-row' span={12}>
            <TextLabel
              title='Fecha de Fin de Ensamble'
              description={list.fecha_fin_ensamble}
            />
          </Col>
        </Row>
      ) : null}

      {list.componentes_ensamble.length !== 0 ? (
        <ShowProduct
          titulo='Componentes'
          tag='componente'
          filas={list.componentes_ensamble}
          onEdition={list.estado === 'Ordenado' ? false : !editar}
          onChanged={changeSeries}
        />
      ) : null}
      <Space direction='vertical' style={{ width: '100%' }}>
        <TextLabel title='Descripción' description={list.descripcion} />
        <Title level={5}>Observaciones</Title>
        <Form.Item
          name='observaciones'
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
              setList({ ...list, observaciones: e.target.value });
            }}
            disabled={!editar}
            name='observaciones'
            defaultValue={list.observaciones}
            autoSize={{ minRows: 2, maxRows: 5 }}
            showCount
            maxLength={100}
            style={{ fontSize: '20' }}
          />
        </Form.Item>
      </Space>
      <Space
        direction='horizontal'
        align='baseline'
        style={{ width: '100%', justifyContent: 'center' }}
      >
        <Form.Item name='boton'>
          <Button
            disabled={editar ? true : !editable ? true : false}
            type='primary'
            htmlType='submit'
          >
            {onEstadoTitleButton(list.estado)}
          </Button>
        </Form.Item>
        {editar ? (
          <Space direction='horizontal' align='baseline'>
            <Form.Item name='boton'>
              <Button type='primary' icon={<CheckOutlined />} htmlType='submit'>
                Guardar Cambios
              </Button>
            </Form.Item>
            <Popconfirm
              title='¿Estas seguro de cancelar?'
              onConfirm={() => {
                setEditar(!editar);
              }}
            >
              <Button type='primary' icon={<CloseOutlined />} danger>
                Cancelar
              </Button>
            </Popconfirm>
          </Space>
        ) : (
          <Button
            icon={<EditOutlined />}
            type='primary'
            style={{
              visibility:
                list.estado === 'Ordenado'
                  ? 'hidden'
                  : editable
                  ? 'visible'
                  : 'hidden',
            }}
            disabled={!editable}
            onClick={() => setEditar(!editar)}
          >
            Editar
          </Button>
        )}
      </Space>
    </Form>
  ) : null;
};

export default Index;
