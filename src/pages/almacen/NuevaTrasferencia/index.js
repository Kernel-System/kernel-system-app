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

import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import HeadingBack from 'components/UI/HeadingBack';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import InputForm from 'components/shared/InputForm';
import ModalProducto from 'components/transferencia/ModalTransferencia';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
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
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (tipoMuestra !== 'agregar') {
      http
        .get(
          `/items/solicitudes_transferencia/${match.params.id}?fields=*,productos_transferencia.id,productos_transferencia.codigo,productos_transferencia.clave,productos_transferencia.cantidad,productos_transferencia.clave_unidad,productos_transferencia.estado,productos_transferencia.transferencia,productos_transferencia.titulo`,
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
    }
  }, []);

  const breakpoint = useBreakpoint();

  const [listProducts, setListProducts] = useState([]);
  const [datosTransferencia, setDatosTransferencia] = useState({});

  const onAddTransferencia = (lista) => {
    const newLista = JSON.parse(JSON.stringify(lista));
    setDatosTransferencia(newLista);
  };

  const onAddProductos = (lista) => {
    const arreglo = [];
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
    console.log(item);
    lista.push({
      key: lista.length.toString(),
      titulo: item.titulo,
      codigo: item.codigo,
      clave: item.clave,
      clave_unidad: item.unidad_cfdi,
      estado: 'Por transferir',
      //productimage:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      cantidad: 1,
    });
    console.log(lista);
    setListProducts(lista);
  };

  const fetchProducts = async () => {
    const { data } = await http.get(`/items/productos`, putToken);
    return data.data;
  };

  const onSearchChange = (value) => {
    setSearchValue(value);
    filtrarProductosPorTitulo(data, value);
  };

  const filtrarProductosPorTitulo = async (productos, value) => {
    if (productos) {
      setListProductsToShow(
        productos.filter((item) => item.titulo.includes(value))
      );
    }
  };

  const [searchValue, setSearchValue] = useState('');

  const { data } = useQuery('productos', async () => {
    const result = await fetchProducts();
    setListProductsToShow(result);
    filtrarProductosPorTitulo(result, searchValue);
    return result;
  });

  const [listToShow, setListProductsToShow] = useState([]);

  const onFinish = (datos: any) => {
    console.log(datos);

    if (listProducts.length !== 0) {
      http
        .post(
          '/items/solicitudes_transferencia/',
          {
            estado: datos.estado,
            almacen_origen: datos.almacen_origen,
            almacen_destino: datos.almacen_destino,
            factura: datos.factura,
            rfc_empleado: 'Empleado Actual',
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
  };

  const onFinishChange = (datos: any) => {
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

  const onFinishFailed = (errorInfo: any) => {
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

  const edit = (record) => {
    form.setFieldsValue({
      titulo: '',
      cantidad: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...listProducts];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setListProducts(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setListProducts(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

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
      editable: true,
    },
    {
      title: '',
      dataIndex: 'operation',
      //fixed: breakpoint.lg ? "left": false,
      width: '50px',
      render: (_, record) => {
        const editable = isEditing(record);
        return tipoMuestra === 'agregar' ? (
          editable ? (
            <span>
              <Button
                type='link'
                onClick={() => save(record.key)}
                icon={<CheckOutlined />}
                style={{
                  marginRight: 8,
                }}
              />
              <Popconfirm title='¿Estas seguro de cancelar?' onConfirm={cancel}>
                <CloseOutlined />
              </Popconfirm>
            </span>
          ) : (
            <span>
              <Button
                icon={<EditOutlined />}
                type='link'
                disabled={editingKey !== ''}
                onClick={() => edit(record)}
              >
                Editar
              </Button>
              <Popconfirm
                title='¿Estas seguro de querer eliminar?'
                onConfirm={() => handleDelete(record.key)}
              >
                <DeleteOutlined />
              </Popconfirm>
            </span>
          )
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
            ? `Nueva Tranferencia`
            : tipoMuestra === 'mostrar'
            ? `Tranferencia ${match.params.id}`
            : `Editar Tranferencia ${match.params.id}`
        }
      />
      <Form
        name='nueva_transferencia'
        initialValues={{
          remember: true,
          almacen_origen: datosTransferencia.almacen_origen,
          almacen_destino:
            tipoMuestra !== 'agregar'
              ? datosTransferencia.almacen_destino
              : '1',
          //estado: tipoMuestra !== 'agregar' ? datosTransferencia.estado : 'Pendiente',
          factura: datosTransferencia.factura,
          fecha_estimada: datosTransferencia.fecha_estimada,
        }}
        onFinish={tipoMuestra === 'agregar' ? onFinish : onFinishChange}
        onFinishFailed={onFinishFailed}
      >
        <Row key='columnas' gutter={[16, 24]}>
          <Col
            className='gutter-row'
            span={breakpoint.lg ? 12 : 24}
            style={{ marginBottom: '10px' }}
          >
            <Title level={5}>Estado</Title>
            {tipoMuestra === 'mostrar' ? (
              <Typography>{datosTransferencia.estado}</Typography>
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
                  //onChange={handleChange}
                >
                  <Option value='1'>Almacen 1</Option>
                  <Option value='2'>Almacen 2</Option>
                  <Option value='3'>Almacen 3</Option>
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
            <Title level={5}>Fecha Estimada</Title>
            {datosTransferencia.estado !== 'Confirmado' ? (
              <Typography>{datosTransferencia.fecha_estimada}</Typography>
            ) : (
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
            )}

            <Title level={5}>Almacen Destino</Title>
            {tipoMuestra === 'agregar' ? (
              <InputForm
                titulo='almacen_destino'
                mensaje='Asignar un almacen de destino.'
                //placeholder='Almacen de origen'
                required={true}
                valueDef={
                  tipoMuestra === 'agregar'
                    ? '1'
                    : datosTransferencia.almacen_destino
                }
                enable={true}
              />
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
            onSearchChange(value);
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
            scroll={{ x: 1000, y: 600 }}
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
            Realizar Transferencia
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
