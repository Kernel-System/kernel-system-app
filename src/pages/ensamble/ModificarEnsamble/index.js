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
import { useStoreState } from 'easy-peasy';
import { useQuery } from 'react-query';
import { getUserRole } from 'api/auth';

const { Title } = Typography;
const { TextArea } = Input;

//encargado ensamble, encargado de almacen

const Index = ({ match }) => {
  const history = useHistory();
  const [list, setList] = useState([]);
  const [editable, setEditable] = useState(true);
  const [editar, setEditar] = useState(false);
  const token = useStoreState((state) => state.user.token.access_token);
  const rol = useQuery(['rol_empleado'], () => getUserRole(token))?.data?.data
    ?.data.role.name;
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    http
      .get(
        `/items/ordenes_ensamble/${match.params.id}?fields=*,componentes_ensamble.id,componentes_ensamble.codigo,componentes_ensamble.cantidad,componentes_ensamble.clave,componentes_ensamble.clave_unidad,componentes_ensamble.descripcion,componentes_ensamble.etiqueta,componentes_ensamble.orden_ensamble,componentes_ensamble.series_componentes_ensamble,componentes_ensamble.series_componentes_ensamble.id,componentes_ensamble.series_componentes_ensamble.serie,componentes_ensamble.series_componentes_ensamble.componente_ensamble`,
        putToken
      )
      .then((result) => {
        console.log(result.data.data);
        if (result.data.data.estado === 'Ingresado en almacén')
          ChangeEditable(false);
        ChangeList(result.data.data);
      });
  }, []);

  const ChangeVisible = () => {
    if (list[0].estado !== 'En ensamble')
      if (rol === 'encargado de almacen' || rol === 'administrador')
        return true;
      else return false;
    else if (rol === 'encargado de ensamble') return true;
    else return false;
  };

  const ChangeList = (lista) => {
    setList([lista]);
  };

  const ChangeEditable = (valor) => {
    setEditable(valor);
  };

  const changeSeries = (serie, indice, number) => {
    const lista = JSON.parse(JSON.stringify(list));
    lista[0].componentes_ensamble[indice].series_componentes_ensamble[
      number
    ] = serie;
    console.log(lista);
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
    switch (list[0].estado) {
      case 'Ordenado':
        estado = {
          estado: 'En ensamble',
          fecha_inicio_ensamble: obtenerFecha(),
          observaciones: list[0].observaciones,
        };
        break;
      case 'En ensamble':
        estado = {
          estado: 'Ensamblado',
          observaciones: list[0].observaciones,
        };
        break;
      case 'Ensamblado':
        estado = {
          estado: 'Ingresado en almacén',
          fecha_fin_ensamble: obtenerFecha(),
          observaciones: list[0].observaciones,
        };
        break;
      default:
        estado = {
          estado: list[0].estado,
          observaciones: list[0].observaciones,
        };
        break;
    }
    if (list[0].estado !== 'Ensamblado') {
      http
        .patch(`/items/ordenes_ensamble/${match.params.id}`, {
          estado,
          putToken,
        })
        .then((result_ensamble) => {
          console.log(result_ensamble);
          let series = [];
          list[0].componentes_ensamble.map((componente) => {
            return componente.series_componentes_ensamble.map((serie) => {
              series.push({
                ...serie,
              });
              return { ...serie };
            });
          });
          if (list[0].estado === 'Ordenado')
            http
              .post('/items/series_componentes_ensamble', {
                series,
                putToken,
              })
              .then((result2) => {
                console.log(result2);
                http
                  .post(
                    `/items/movimientos_almacen/`,
                    {
                      fecha: estado.fecha_inicio_ensamble,
                      concepto: 'Componentes de ensamble',
                      comentario: list[0].comentario,
                      folio_ensamble: list[0].folio,
                      rfc_empleado: list[0].rfc_empleado_orden,
                      clave_almacen: list[0].clave_almacen,
                      mostrar: true,
                    },
                    putToken
                  )
                  .then((result) => {
                    let componentes = [];
                    list[0].componentes_ensamble.forEach((componente) => {
                      console.log(componente);
                      componentes.push({
                        codigo: componente.codigo,
                        clave: componente.clave,
                        cantidad: componente.cantidad,
                        clave_unidad: componente.clave_unidad,
                        descripcion: componente.descripcion,
                        id_movimiento: result.data.data.id,
                      });
                    });
                    console.log(componentes);
                    http
                      .post(`/items/productos_movimiento/`, {
                        componentes,
                        putToken,
                      })
                      .then((result_com) => {
                        let series = [];
                        let num = 0;
                        list[0].componentes_ensamble.forEach((componente) => {
                          const idMov = result_com.data.data[num].id;
                          console.log(componente);
                          componente.series_componentes_ensamble.forEach(
                            (serie) => {
                              console.log(serie);
                              if (serie.serie !== '')
                                series.push({
                                  ...serie,
                                  producto_movimiento: idMov,
                                });
                            }
                          );
                          num = num + 1;
                        });
                        console.log(series);
                        if (series.length !== 0)
                          http
                            .post(
                              `/items/series_producto_movimiento/`,
                              series,
                              putToken
                            )
                            .then((result_series) => {
                              agregarInventarios(list[0], false);
                            });
                        else agregarInventarios(list[0], false);
                      });
                  });
              });
          else mensajeSuccess();
        });
    } else {
      http
        .get(`/items/productos/${list[0].codigo_ensamble}`, putToken)
        .then((producto) => {
          http
            .post(
              `/items/movimientos_almacen/`,
              {
                fecha: obtenerFecha(),
                concepto: 'Producto ensamblado',
                comentario: list[0].comentario,
                folio_ensamble: list[0].folio,
                rfc_empleado: list[0].rfc_empleado_orden,
                clave_almacen: list[0].clave_almacen,
                mostrar: true,
              },
              putToken
            )
            .then((result) => {
              http
                .post(
                  `/items/productos_movimiento/`,
                  {
                    codigo: list[0].codigo_ensamble,
                    clave: producto.data.data.clave,
                    cantidad: 1,
                    clave_unidad: producto.data.data.unidad_cfdi,
                    descripcion: producto.data.data.descripcion,
                    id_movimiento: result.data.data.id,
                  },
                  putToken
                )
                .then((result_com) => {
                  http
                    .post(
                      `/items/series_producto_movimiento/`,
                      {
                        serie: list[0].folio,
                        nota: '',
                        producto_movimiento: result_com.data.data.id,
                      },
                      putToken
                    )
                    .then((result_series) => {
                      console.log(result_series);
                      http
                        .patch(
                          `/items/ordenes_ensamble/${match.params.id}`,
                          {
                            observaciones: list[0].observaciones,
                          },
                          putToken
                        )
                        .then((resul) => {
                          http
                            .patch(
                              `/items/ordenes_ensamble/${match.params.id}`,
                              estado,
                              putToken
                            )
                            .then((result_ensamble) => {
                              agregarInventarios(list[0], true);
                            });
                        });
                    });
                });
            });
        });
    }
  };

  const agregarInventarios = (list, introducir = false) => {
    let codigos = [];
    list.componentes_ensamble.forEach((producto) => {
      codigos.push(producto.codigo);
    });
    http
      .get(
        `/items/inventario?filter[codigo_producto][_in]=${codigos.toString()}&filter[clave_almacen][_eq]=${
          list.clave_almacen
        }`,
        putToken
      )
      .then((inventario) => {
        let mostrarMensaje = true;
        console.log(inventario.data.data);
        if (!introducir) {
          mostrarMensaje = false;
          console.log(inventario.data.data);
          inventario.data.data.forEach((producto_inv, index) => {
            http
              .patch(
                `/items/inventario/${producto_inv.id}`,
                {
                  cantidad:
                    parseInt(producto_inv.cantidad, 10) -
                    parseInt(list.componentes_ensamble[index].cantidad, 10),
                  estado: 'normal',
                  clave_almacen: list.clave_almacen,
                  codigo_producto: list.componentes_ensamble[index].codigo,
                },
                putToken
              )
              .then(() => {
                let series = [];
                list.componentes_ensamble[
                  index
                ].series_componentes_ensamble.forEach((serie) => {
                  series.push(serie);
                });
                if (series.length !== 0)
                  http.delete(`/items/series_inventario`, series, putToken);
                if (inventario.data.data.length - 1 === index) mensajeSuccess();
              });
          });
        } else {
          mostrarMensaje = false;
          http
            .get(
              `/items/inventario?filter[codigo_producto][_in]=${list.codigo_ensamble}&filter[clave_almacen][_eq]=${list.clave_almacen}`,
              putToken
            )
            .then((inventario_producto) => {
              //aqui me quede
              console.log('data');
              console.log(inventario_producto.data.data.length);
              if (inventario_producto.data.data.length === 0) {
                http
                  .post(
                    `/items/inventario/`,
                    {
                      codigo_producto: list.codigo_ensamble,
                      cantidad: 1,
                      estado: 'normal',
                      clave_almacen: list.clave_almacen,
                    },
                    putToken
                  )
                  .then((producto_inv_anlf) => {
                    http
                      .post(
                        `/items/series_inventario`,
                        {
                          serie: list.folio,
                          inventario: producto_inv_anlf.data.data.id,
                        },
                        putToken
                      )
                      .then(() => {
                        mensajeSuccess();
                      });
                  });
              } else {
                http
                  .patch(
                    `/items/inventario/${inventario_producto.data.data[0].id}`,
                    {
                      cantidad:
                        parseInt(
                          inventario_producto.data.data[0].cantidad,
                          10
                        ) + 1,
                      estado: 'normal',
                      clave_almacen: list.clave_almacen,
                      codigo_producto: list.codigo_ensamble,
                    },
                    putToken
                  )
                  .then(() => {
                    http
                      .post(
                        `/items/series_inventario`,
                        {
                          serie: list.folio,
                          inventario: inventario_producto.data.data[0].id,
                        },
                        putToken
                      )
                      .then(() => {
                        mensajeSuccess();
                      });
                  });
              }
            });
        }
        if (mostrarMensaje) {
          mensajeSuccess();
        }
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
        observaciones: list[0].observaciones,
        putToken,
      })
      .then((resul) => {
        console.log(resul);
        actualizarSeries();
      });
  };

  const actualizarSeries = () => {
    let series = [];
    list[0].componentes_ensamble.map((componente) => {
      return componente.series_componentes_ensamble.map((serie) => {
        series.push({
          ...serie,
        });
        return { ...serie };
      });
    });
    console.log(series);
    http
      .post('/custom/ensamble/', { series: series }, putToken)
      .then((result2) => {
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

  return list.map((dato) => (
    <Form
      name='basic'
      key={`${match.params.id}`}
      initialValues={{ remember: true }}
      onFinish={!editar ? onFinish : onFinishChange}
      onFinishFailed={onFinishFailed}
    >
      <HeadingBack
        title={`Ensamble ${match.params.id}`}
        extra={dato.fecha_orden}
      />
      <TextLabel title='Estado' subtitle={dato.estado} />
      <TextLabel title='Codigo del Producto' subtitle={dato.codigo_ensamble} />
      <TextLabel
        title='Empleado de Ensamble'
        subtitle={dato.rfc_empleado_ensamble}
      />
      <TextLabel title='Almacén' subtitle={dato.clave_almacen} />
      {dato.fecha_inicio_ensamble != null ? (
        <Row key='Row' gutter={[16, 24]} style={{ marginBottom: '10px' }}>
          <Col className='gutter-row' span={12}>
            <TextLabel
              title='Fecha de Inicio de Ensamble'
              subtitle={dato.fecha_inicio_ensamble}
            />
          </Col>
          <Col className='gutter-row' span={12}>
            <TextLabel
              title='Fecha de Fin de Ensamble'
              subtitle={dato.fecha_fin_ensamble}
            />
          </Col>
        </Row>
      ) : null}

      {dato.componentes_ensamble.length !== 0 ? (
        <ShowProduct
          titulo='Componentes'
          tag='componente'
          filas={dato.componentes_ensamble}
          estado={dato.estado}
          onEdition={dato.estado === 'Ordenado' ? false : !editar}
          onChanged={changeSeries}
        />
      ) : null}
      <Space direction='vertical' style={{ width: '100%' }}>
        <TextLabel title='Descripción' subtitle={dato.descripcion} />
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
              setList([{ ...dato, observaciones: e.target.value }]);
            }}
            disabled={!editar}
            name='observaciones'
            defaultValue={dato.observaciones}
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
            disabled={
              editar
                ? true
                : editable
                ? !ChangeVisible()
                  ? true
                  : false
                : true
            }
            type='primary'
            htmlType='submit'
          >
            {onEstadoTitleButton(dato.estado)}
          </Button>
        </Form.Item>

        {rol !== 'encargado de ensamble' && dato.estado === 'En ensamble' ? (
          editar ? (
            <Space direction='horizontal' align='baseline'>
              <Form.Item name='boton'>
                <Button
                  type='primary'
                  icon={<CheckOutlined />}
                  htmlType='submit'
                >
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
                  dato.estado === 'Ordenado'
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
          )
        ) : null}
      </Space>
    </Form>
  ));
};

export default Index;
