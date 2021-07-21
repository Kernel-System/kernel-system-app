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
  Table,
  InputNumber,
  Popconfirm,
  Image,
} from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import HeadingBack from 'components/UI/HeadingBack';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import InputForm from 'components/shared/InputForm';
import ModalProducto from 'components/transferencia/ModalTransferencia';
import { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { useStoreState } from 'easy-peasy';
import { http } from 'api';
const { Search } = Input;
const { Option } = Select;

const { Title } = Typography;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Index = ({ tipo }) => {
  let match = useRouteMatch();
  const history = useHistory();
  const [tipoMuestra, setTipoMuestra] = useState(tipo);
  const [almacen, setAlmacen] = useState('1');
  const [almacenDestino, setAlmacenDestino] = useState('1');
  const [almacenes, setAlmacenes] = useState([]);
  const [empleado, setEmpleado] = useState('');
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    http.get(`/users/me/?fields=*,empleado.*`, putToken).then((result) => {
      onSetArreglo(result.data.data.empleado[0], setEmpleado);
      if (
        result.data.data.empleado[0].puesto ===
        'd5432f92-7a74-4372-907c-9868507e0fd5'
      ) {
        onSetArreglo('Todo', setAlmacenDestino);
      } else {
        onSetArreglo(result.data.data.empleado[0].almacen, setAlmacenDestino);
      }
    });
    if (tipoMuestra !== 'agregar') {
      http
        .get(
          `/items/solicitudes_transferencia/${match.params.id}?fields=*,productos_transferencia.*`,
          putToken
        )
        .then((result) => {
          console.log(result.data.data);
          if (
            result.data.data.estado === 'Rechazado' ||
            result.data.data.estado === 'Recibido con Detalles' ||
            result.data.data.estado === 'Recibido'
          ) {
            setTipoMuestra('mostrar');
          }
          onAddTransferencia(result.data.data);
          onAddProductos(result.data.data.productos_transferencia);
        });
    } else {
      http.get(`/items/almacenes/`, putToken).then((result) => {
        onSetArreglo(result.data.data, setAlmacenes);
      });
    }
  }, []);

  const onSetArreglo = (lista, asignar) => {
    const newLista = JSON.parse(JSON.stringify(lista));
    asignar(newLista);
  };

  useEffect(() => {
    http
      .get(
        `/items/productos?fields=*,imagenes.directus_files_id,categorias.*,inventario.*`,
        putToken
      )
      .then((result) => {
        if (tipoMuestra === 'agregar') onSetProductos(result.data.data);
      });
  }, [almacen]);

  const onSetProductos = (lista) => {
    const newData = JSON.parse(JSON.stringify(lista));
    const newProductos = [];
    lista.forEach((producto, index) => {
      let inventarios = [];
      producto.inventario.forEach((inventario) => {
        if (inventario.clave_almacen === almacen && inventario.cantidad !== 0)
          inventarios.push(inventario);
      });
      if (inventarios.length !== 0) {
        newData[index].inventario = inventarios;
        newProductos.push(newData[index]);
      }
    });
    setListProducts([]);
    setListProductsToShow(newProductos);
  };

  const breakpoint = useBreakpoint();

  const [listProducts, setListProducts] = useState([]);
  const [datosTransferencia, setDatosTransferencia] = useState({});

  const onAddTransferencia = (lista) => {
    const newLista = JSON.parse(JSON.stringify(lista));
    setDatosTransferencia(newLista);
  };

  const onAddProductos = (lista) => {
    const arreglo = [];
    // console.log(lista);
    lista.forEach((producto) => {
      arreglo.push({
        key: arreglo.length.toString(),
        id: producto.id,
        titulo: producto.titulo,
        codigo: producto.codigo,
        clave: producto.clave,
        clave_unidad: producto.unidad_cfdi,
        estado: 'Por transferir',
        cantidad: producto.cantidad,
      });
    });
    setListProducts(arreglo);
    console.log(arreglo);
  };

  const [visible, setVisible] = useState(false);

  const changeVisible = () => {
    setVisible(!visible);
  };

  const addListItem = (item) => {
    const lista = JSON.parse(JSON.stringify(listProducts));
    const dato = lista.findIndex((producto) => producto.codigo === item.codigo);
    if (dato === -1)
      lista.push({
        key: lista.length.toString(),
        titulo: item.titulo,
        codigo: item.codigo,
        clave: item.clave,
        clave_unidad: item.unidad_cfdi,
        estado: 'Por transferir',
        max: item.inventario
          .map((inventario) => inventario.cantidad)
          .reduce((cantidad, sum) => cantidad + sum, 0),
        productimage:
          item.imagenes.length !== 0
            ? `${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${item.imagenes[0].directus_files_id}`
            : '',
        cantidad: 1,
      });
    else lista[dato] = { ...lista[dato], cantidad: lista[dato].cantidad + 1 };
    setListProducts(lista);
  };

  const [listToShow, setListProductsToShow] = useState([]);

  const onFinish = (datos) => {
    console.log(datos);
    if (datos.almacen_origen !== datos.almacen_destino) {
      if (listProducts.length !== 0) {
        http
          .post(
            '/items/solicitudes_transferencia/',
            {
              estado: datos.estado,
              almacen_origen: datos.almacen_origen,
              almacen_destino: datos.almacen_destino,
              factura: datos.factura,
              rfc_empleado: empleado.rfc,
            },
            putToken
          )
          .then((resul) => {
            console.log(resul);
            let productos = [];
            listProducts.map((item) => {
              return productos.push({
                titulo: item.titulo,
                codigo: item.codigo,
                clave: item.clave,
                clave_unidad: item.clave_unidad,
                estado: 'Por transferir',
                //productimage:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                cantidad: item.cantidad,
                transferencia: resul.data.data.id,
              });
            });
            console.log(productos);
            http
              .post(`/items/productos_transferencia`, productos, putToken)
              .then((resul2) => {
                console.log(resul2);
                Mensaje();
              });
          })
          .catch((error) => {
            if (
              error.response.data.errors[0].extensions.code ===
              'RECORD_NOT_UNIQUE'
            ) {
              message.error('Codigo ya existente');
            } else message.error('Un error ha ocurrido');
          });
      } else {
        message.warning('Ingresa los productos a transferir');
      }
    } else {
      message.warn(
        'El almacen origen y el almacen destino deben ser distintos.'
      );
    }
  };

  const onFinishChange = (datos) => {
    console.log();
    http
      .patch(
        `/items/solicitudes_transferencia/${match.params.id}`,
        {
          estado: datos.estado,
          factura: datos.factura,
          fecha_estimada: datosTransferencia.fecha_estimada,
          comentario: datos.comentario,
        },
        putToken
      )
      .then((resul) => {
        console.log(resul);
        Mensaje();
      })
      .catch((error) => {
        console.log(error);
        message.error('Un error ha ocurrido');
      });
  };

  const Mensaje = () => {
    message
      .success('La transferencia ha sido registrada exitosamente', 3)
      .then(() => history.goBack());
  };

  const onFinishFailed = (errorInfo) => {
    message.error('Error al llenar los datos.');
  };

  function onChangeTime(date, dateString) {
    const lista = JSON.parse(JSON.stringify(datosTransferencia));
    const fecha = new Date(dateString);

    setDatosTransferencia({
      ...lista,
      fecha_estimada:
        fecha.getUTCFullYear() +
        '-' +
        ('00' + (fecha.getUTCMonth() + 1)).slice(-2) +
        '-' +
        ('00' + fecha.getUTCDate()).slice(-2) +
        ' ' +
        ('00' + fecha.getUTCHours()).slice(-2) +
        ':' +
        ('00' + fecha.getUTCMinutes()).slice(-2) +
        ':' +
        ('00' + fecha.getUTCSeconds()).slice(-2),
    });
  }

  const switchState = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return ['Confirmado', 'Rechazado'];
      case 'Confirmado':
        return ['Tranferido'];
      case 'Tranferido':
        return ['Recibido', 'Recibido con Detalles'];
      default:
        return ['Pendiente'];
    }
  };

  //#region tabla
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const typeColumn = (type) => {
    switch (type) {
      case 'cantidad':
        return 'number';
      case 'image':
        return 'image';
      case 'expand':
        return null;
      default:
        return 'text';
    }
  };

  const handleDelete = (key) => {
    const dataSource = [...listProducts];
    setListProducts(dataSource.filter((item) => item.key !== key));
  };

  const onChangeCantidad = (value, index) => {
    if (value !== 0) {
      const newData = JSON.parse(JSON.stringify(listProducts));
      newData[index].cantidad = value;
      setListProducts(newData);
      setEditingKey('');
      setListProducts(newData);
    }
  };

  const columns = [
    {
      title: 'IMAGEN',
      dataIndex: 'image',
      width: '20px',
      //fixed: "left",
      render: (_, record) => <Image width={50} src={record.productimage} />,
      editable: false,
    },
    {
      title: 'NOMBRE',
      dataIndex: 'titulo',
      width: '70px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'CANTIDAD',
      dataIndex: 'cantidad',
      width: '30px',
      render: (_, record) => {
        return tipoMuestra === 'agregar' ? (
          <InputNumber
            max={record.max}
            min={1}
            // defaultValue={record.cantidad}
            onChange={(value) => {
              onChangeCantidad(value, record.key);
            }}
          />
        ) : (
          <p>{record.cantidad}</p>
        );
      },
    },
    {
      title: '',
      dataIndex: 'operation',
      //fixed: breakpoint.lg ? "left": false,
      width: '20px',
      render: (_, record) => {
        return tipoMuestra === 'agregar' ? (
          <Popconfirm
            title='¿Estas seguro de querer eliminar?'
            onConfirm={() => handleDelete(record.key)}
          >
            <DeleteOutlined />
          </Popconfirm>
        ) : null;
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,

      onCell: (record) => ({
        record,
        inputType: typeColumn(col.dataIndex),
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  //#endregion

  return (
    <div>
      <HeadingBack
        title={
          tipoMuestra === 'agregar'
            ? `Nueva Transferencia`
            : tipoMuestra === 'mostrar'
            ? `Transferencia ${match.params.id}`
            : `Editar Transferencia ${match.params.id}`
        }
      />
      <Form
        name='nueva_transferencia'
        initialValues={{
          remember: true,
          almacen_origen: datosTransferencia.almacen_origen,
          almacen_destino:
            tipoMuestra !== 'agregar' ? datosTransferencia.almacen_destino : '',
          //estado: tipoMuestra !== 'agregar' ? datosTransferencia.estado : 'Pendiente',
          factura: datosTransferencia.factura,
          fecha_estimada: datosTransferencia.fecha_estimada,
        }}
        onFinish={tipoMuestra === 'agregar' ? onFinish : onFinishChange}
        onFinishFailed={onFinishFailed}
      >
        <Row key='columnas' gutter={[16, 24]}>
          <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
            <Title level={5}>Estado</Title>
            {tipoMuestra === 'mostrar' ? (
              <Form.Item>{datosTransferencia.estado}</Form.Item>
            ) : (
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
                  disabled={tipoMuestra === 'mostrar'}
                  //defaultValue='Pendiente'
                  placeholder='Selecciona un estado'
                  style={{ width: '100%' }}
                  //onChange={handleChange}
                >
                  {switchState(datosTransferencia.estado).map((estado) => {
                    return (
                      <Option key={estado} value={estado}>
                        {estado}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}

            <Title level={5}>Almacen de origen</Title>
            {tipoMuestra === 'agregar' ? (
              <Form.Item
                key='almacen_origen'
                name='almacen_origen'
                rules={[
                  {
                    required: true,
                    message: `Selecciona un almacen de origen.`,
                  },
                ]}
              >
                <Select
                  key='almacen_origen'
                  //defaultValue='Almacen 1'
                  placeholder='Selecciona un almacen.'
                  style={{ width: '100%' }}
                  onChange={(value) => setAlmacen(value)}
                >
                  {almacenes.map((almacen) => (
                    <Option
                      value={almacen.clave}
                      key={almacen.clave}
                    >{`${almacen.clave} : ${almacen.clave_sucursal} `}</Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              <Typography>{datosTransferencia.almacen_origen}</Typography>
            )}
          </Col>
          <Col
            className='gutter-row'
            span={breakpoint.lg ? 12 : 24}
            style={{ marginBottom: '10px' }}
          >
            {datosTransferencia.estado !== 'Confirmado' ? (
              <div>
                <Title level={5}>Fecha Estimada</Title>
                <Form.Item>
                  {datosTransferencia.fecha_estimada ?? 'Sin fecha estimada'}
                </Form.Item>
              </div>
            ) : (
              <div>
                <Title level={5}>Fecha Estimada</Title>
                <Form.Item
                  key='fecha_estimada'
                  name='fecha estimada'
                  rules={[
                    datosTransferencia.estado === 'Confirmado'
                      ? {
                          required: true,
                          message: `Selecciona una fecha estimada`,
                        }
                      : { required: false },
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    onChange={onChangeTime}
                    disabled={
                      datosTransferencia.estado !== 'Confirmado' ? true : false
                    }
                    placeholder='Selecciona la fecha de entrega estimada'
                  />
                </Form.Item>
              </div>
            )}
            <Title level={5}>Almacen Destino</Title>
            {tipoMuestra === 'agregar' ? (
              almacenDestino === 'Todo' ? (
                <Form.Item
                  key='almacen_destino'
                  name='almacen_destino'
                  rules={[
                    {
                      required: true,
                      message: `Selecciona un almacen de origen.`,
                    },
                  ]}
                >
                  <Select
                    key='almacen_destino'
                    //defaultValue='Almacen 1'
                    placeholder='Selecciona un almacen destino.'
                    style={{ width: '100%' }}
                  >
                    {almacenes.map((almacen) => (
                      <Option
                        value={almacen.clave}
                        key={almacen.clave}
                      >{`${almacen.clave} : ${almacen.clave_sucursal} `}</Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : (
                <Typography>{setAlmacenDestino}</Typography>
              )
            ) : (
              <Typography>{datosTransferencia.almacen_destino}</Typography>
            )}
          </Col>
        </Row>
        <Title level={5}>Folio de factura (Opcional)</Title>
        <InputForm
          titulo='factura'
          enable={tipoMuestra === 'mostrar'}
          required={false}
          mensaje='Asignar una factura.'
          placeholder='Factura'
        />
        <Title level={5}>Comentario</Title>
        {datosTransferencia.estado === 'Tranferido' ? (
          <InputForm
            titulo='comentario'
            enable={datosTransferencia.estado !== 'Tranferido'}
            required={datosTransferencia.estado === 'Tranferido'}
            max={100}
            mensaje='Agregar comentario.'
            placeholder='Comentario.'
          />
        ) : (
          <Typography>{datosTransferencia.comentario}</Typography>
        )}
        <Title level={5}>Productos</Title>
        <Search
          disabled={tipoMuestra !== 'agregar'}
          style={tipoMuestra !== 'agregar' ? { visibility: 'hidden' } : null}
          placeholder='Ingrese nombre del producto.'
          allowClear
          enterButton='Buscar'
          onSearch={(value) => {
            setVisible(!visible);
          }}
        />
        <br />
        <br />
        <Form form={form} component={false}>
          <Table
            columnWidth='10px'
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            disabled={tipoMuestra === 'mostrar'}
            // scroll={{ x: 1000, y: 600 }}
            dataSource={listProducts}
            columns={mergedColumns}
            rowClassName='editable-row'
            /*pagination={{
          onChange: cancel,
        }}*/
          />
        </Form>
        <Form.Item
          style={{ margin: '0 auto', marginTop: '5px', display: 'block' }}
        >
          <Button
            disabled={tipoMuestra === 'mostrar'}
            style={tipoMuestra === 'mostrar' ? { visibility: 'hidden' } : null}
            type='primary'
            htmlType='submit'
          >
            {tipoMuestra === 'agregar'
              ? 'Añadir Transferencia'
              : 'Confirmar cambios'}
          </Button>
        </Form.Item>
      </Form>
      <ModalProducto
        lista={listToShow}
        visible={visible}
        setVis={changeVisible}
        onSelection={addListItem}
      />
    </div>
  );
};

export default Index;
