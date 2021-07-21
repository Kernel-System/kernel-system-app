import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Select,
  Table,
  Typography,
} from 'antd';
import { http } from 'api';
import InputForm from 'components/shared/InputForm';
import NumericInputForm from 'components/shared/NumericInputForm';
import ModalProducto from 'components/transferencia/ModalTransferencia';
import HeadingBack from 'components/UI/HeadingBack';
import TextLabel from 'components/UI/TextLabel';
import { useStoreState } from 'easy-peasy';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router';
const { Search, TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

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

const Index = () => {
  const [cliente, setCliente] = useState(undefined);
  const [nivel, setNivel] = useState(1);
  const [date, setDate] = useState('');
  const [clientes, setClientes] = useState([]);
  const [empleado, setEmpleado] = useState();
  const [listProducts, setListProducts] = useState([]);
  const [listToShow, setListProductsToShow] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [total, setTotal] = useState(0);
  const [iva, setIva] = useState(0);

  const history = useHistory();
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  function onChangeTime(date, dateString) {
    const fecha = new Date(dateString);
    setDate(
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
        ('00' + fecha.getUTCSeconds()).slice(-2)
    );
  }

  useEffect(() => {
    http
      .get(`/items/clientes?fields=*,cuenta.id,cuenta.email`, putToken)
      .then((resul) => {
        onSetDato(resul.data.data, setClientes);
      });
    http.get(`/users/me/?fields=*,empleado.*`, putToken).then((result) => {
      onSetDato(result.data.data.empleado[0], setEmpleado);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSetDato = (lista, setDato) => {
    const newLista = JSON.parse(JSON.stringify(lista));
    setDato(newLista);
  };

  const onFinish = (datos) => {
    const hide = message.loading('Generando cotización...', 0);
    if (listProducts.length !== 0) {
      let infoCliente =
        cliente !== undefined
          ? {
              nombre_cliente: cliente.nombre_comercial,
              telefono_cliente: cliente.telefono,
              email_cliente: cliente.cuenta.email,
              empresa: cliente.razon_social,
              id_cliente: cliente.id,
            }
          : {
              nombre_cliente: datos.nombre,
              telefono_cliente: datos.telefono,
              email_cliente: datos.correo,
              empresa: datos.empresa,
            };
      const contizacion = {
        total: total,
        iva: iva,
        porcentaje_anticipo: datos.porcentaje,
        fecha_vigencia: date,
        dias_entrega: datos.dias,
        concepto: datos.concepto,
        nota: datos.nota,
        rfc_empleado: empleado.rfc,
        ...infoCliente,
      };
      http
        .post('/items/cotizaciones/', contizacion, putToken)
        .then((resul_cot) => {
          let productos = [];
          listProducts.forEach((producto) => {
            productos.push({
              clave: producto.clave,
              cantidad: producto.cantidad,
              descripcion: producto.titulo,
              clave_unidad: producto.clave_unidad,
              descuento: producto.descuento,
              precio_unitario: producto.precio_unitario,
              folio_cotizacion: resul_cot.data.data.folio,
              iva: producto.iva,
              total: producto.total,
            });
          });
          http
            .post('/items/productos_cotizados', productos, putToken)
            .then(() => {
              hide();
              Mensaje();
            });
        });
    } else {
      hide();
      message.warn('Falta introducir productos.');
    }
  };

  const Mensaje = () => {
    message
      .success('La cotizacion ha sido creada exitosamente', 3)
      .then(() => history.goBack());
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onChangeCliente = (value, index) => {
    const ind = clientes.find((ind) => ind.id === value);
    console.log(ind);
    if (ind !== undefined) setNivel(ind.nivel);
    else setNivel(1);
    setCliente(ind);
  };

  //#region busqueda de productos
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

  const fetchProducts = async () => {
    const { data } = await http.get(
      `/items/productos?fields=*,precios_variables.*,imagenes.directus_files_id,categorias.*`,
      putToken
    );
    return data.data;
  };

  const { data } = useQuery('productos', async () => {
    const result = await fetchProducts();
    setListProductsToShow(result);
    filtrarProductosPorTitulo(result, searchValue);
    return result;
  });

  const changeVisible = () => {
    setVisible(!visible);
  };
  //#endregion

  //#region Tabla informacion
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

  const setPrecioTotalInicial = (item, unitario = false) => {
    if (item.tipo_de_venta === 'Fijo') {
      if (unitario) return item.precio_fijo;
      return setPrecio(item.precio_fijo, item.descuento, 1, item.iva);
    } else if (
      item.tipo_de_venta === 'Mark Up' ||
      item.tipo_de_venta === 'Margen'
    ) {
      switch (nivel) {
        case 1:
          if (unitario) return item.precios_variables[0].precio_1;
          return setPrecio(
            item.precios_variables[0].precio_1,
            item.descuento,
            1,
            item.iva
          );
        case 2:
          if (unitario) return item.precios_variables[0].precio_2;
          return setPrecio(
            item.precios_variables[0].precio_2,
            item.descuento,
            1,
            item.iva
          );
        case 3:
          if (unitario) return item.precios_variables[0].precio_3;
          return setPrecio(
            item.precios_variables[0].precio_3,
            item.descuento,
            1,
            item.iva
          );
        default:
          break;
      }
    } else if (item.tipo_de_venta === 'Volumen') {
      if (unitario) return item.precios_variables[0].precio_1;
      return setPrecio(
        item.precios_variables[0].precio_1,
        item.descuento,
        1,
        item.iva
      );
    } else if (item.tipo_de_venta === 'Servicio') {
      if (unitario) return 0;
      return 0;
    }
  };

  const setPrecio = (precioInd, descuento, cantidad, iva) => {
    if (descuento <= 99)
      return precioInd * ((100 - descuento) / 100) * aplicarIva(iva) * cantidad;
    else return 0;
  };

  const aplicarIva = (iva) => {
    if (iva > 0) {
      return 1 + iva / 100;
    } else return 1;
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...listProducts];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        let item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        if (newData[index].tipo_de_venta === 'Fijo') {
          newData[index].precio_unitario = newData[index].precio_fijo;
          newData[index].total = setPrecio(
            newData[index].precio_fijo,
            newData[index].descuento,
            newData[index].cantidad,
            newData[index].iva
          );
        } else if (
          newData[index].tipo_de_venta === 'Mark Up' ||
          newData[index].tipo_de_venta === 'Margen'
        ) {
          switch (nivel) {
            case 1:
              newData[index].precio_unitario =
                newData[index].precios_variables.precio_1;
              newData[index].total = setPrecio(
                newData[index].precios_variables.precio_1,
                newData[index].descuento,
                newData[index].cantidad,
                newData[index].iva
              );
              break;
            case 2:
              newData[index].precio_unitario =
                newData[index].precios_variables.precio_2;
              newData[index].total = setPrecio(
                newData[index].precios_variables.precio_2,
                newData[index].descuento,
                newData[index].cantidad,
                newData[index].iva
              );
              break;
            case 3:
              newData[index].precio_unitario =
                newData[index].precios_variables.precio_3;
              newData[index].total = setPrecio(
                newData[index].precios_variables.precio_3,
                newData[index].descuento,
                newData[index].cantidad,
                newData[index].iva
              );
              break;
            default:
              break;
          }
        } else if (newData[index].tipo_de_venta === 'Volumen') {
          if (
            newData[index].cantidad < newData[index].precios_variables.valor_2
          ) {
            newData[index].precio_unitario =
              newData[index].precios_variables.precio_1;
            newData[index].total = setPrecio(
              newData[index].precios_variables.precio_1,
              newData[index].descuento,
              newData[index].cantidad,
              newData[index].iva
            );
          } else if (
            newData[index].cantidad >
              newData[index].precios_variables.valor_2 &&
            newData[index].cantidad < newData[index].precios_variables.valor_3
          ) {
            newData[index].precio_unitario =
              newData[index].precios_variables.precio_2;
            newData[index].total = setPrecio(
              newData[index].precios_variables.precio_2,
              newData[index].descuento,
              newData[index].cantidad,
              newData[index].iva
            );
          } else if (
            newData[index].cantidad >
              newData[index].precios_variables.valor_3 &&
            newData[index].cantidad < newData[index].precios_variables.valor_4
          ) {
            newData[index].precio_unitario =
              newData[index].precios_variables.precio_3;

            newData[index].total = setPrecio(
              newData[index].precios_variables.precio_3,
              newData[index].descuento,
              newData[index].cantidad,
              newData[index].iva
            );
          } else if (
            newData[index].cantidad > newData[index].precios_variables.valor_4
          ) {
            newData[index].precio_unitario =
              newData[index].precios_variables.precio_4;

            newData[index].total = setPrecio(
              newData[index].precios_variables.precio_4,
              newData[index].descuento,
              newData[index].cantidad,
              newData[index].iva
            );
          }
        } else if (newData[index].tipo_de_venta === 'Servicio') {
          console.log(newData[index]);
          newData[index].precio_unitario = newData[index].precio_fijo;
          newData[index].total = setPrecio(
            newData[index].precio_fijo,
            0,
            1,
            newData[index].iva
          );
        }
        setListProducts(newData);
        setIva(
          newData
            .reduce(
              (acu, element) => acu + (element.total * element.iva) / 100,
              0
            )
            .toFixed(2)
        );
        setTotal(
          newData.reduce((acu, element) => acu + element.total, 0).toFixed(2)
        );
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

  const onSetTotal = (arreglo) => {
    setTotal(
      arreglo.reduce((acu, element) => acu + element.total, 0).toFixed(2)
    );
    setIva(
      arreglo
        .reduce((acu, element) => acu + (element.total * element.iva) / 100, 0)
        .toFixed(2)
    );
  };

  const handleDelete = (key) => {
    const dataSource = [...listProducts];
    setListProducts(dataSource.filter((item) => item.key !== key));
  };

  const changeServicio = (value, key) => {
    const newData = JSON.parse(JSON.stringify(listProducts));
    const index = newData.findIndex((item) => key === item.key);
    newData[index].precio_fijo = parseFloat(value);
    setListProducts(newData);
  };

  const typeColumn = (type) => {
    switch (type) {
      case 'number':
        return 'number';
      case 'image':
        return 'image';
      default:
        return 'text';
    }
  };

  const columns = [
    {
      title: 'Imagen',
      dataIndex: 'image',
      width: '20px',
      //fixed: "left",
      render: (_, record) => <Image width={50} src={record.productimage} />,
      editable: false,
    },
    {
      title: 'CVE',
      dataIndex: 'clave',
      width: '20px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'NOMBRE',
      dataIndex: 'titulo',
      width: '60px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'Unidad',
      dataIndex: 'clave_unidad',
      width: '20px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'PRECIO UNI.',
      dataIndex: 'precio',
      width: '30px',
      //fixed: 'left',
      ellipsis: true,
      render: (_, record) => {
        if (record.tipo_de_venta === 'Fijo')
          return <Text>{`$ ${record.precio_fijo}`}</Text>;
        else if (
          record.tipo_de_venta === 'Mark Up' ||
          record.tipo_de_venta === 'Margen'
        ) {
          switch (nivel) {
            case 1:
              return <Text>{`$ ${record.precios_variables.precio_1}`}</Text>;
            case 2:
              return <Text>{`$ ${record.precios_variables.precio_2}`}</Text>;
            case 3:
              return <Text>{`$ ${record.precios_variables.precio_3}`}</Text>;
            default:
              return <Text>{`$ ${record.precios_variables.precio_1}`}</Text>;
          }
        } else if (record.tipo_de_venta === 'Volumen') {
          if (record.cantidad < record.precios_variables.valor_2) {
            return <Text>{`$ ${record.precios_variables.precio_1}`}</Text>;
          } else if (
            record.cantidad > record.precios_variables.valor_2 &&
            record.cantidad < record.precios_variables.valor_3
          ) {
            return <Text>{`$ ${record.precios_variables.precio_2}`}</Text>;
          } else if (
            record.cantidad > record.precios_variables.valor_3 &&
            record.cantidad < record.precios_variables.valor_4
          ) {
            return <Text>{`$ ${record.precios_variables.precio_3}`}</Text>;
          } else if (record.cantidad > record.precios_variables.valor_4) {
            return <Text>{`$ ${record.precios_variables.precio_4}`}</Text>;
          }
        } else if (record.tipo_de_venta === 'Servicio') {
          const editable = isEditing(record);
          return (
            <InputNumber
              key={record.key}
              //size='large'
              style={{ width: '100%' }}
              //   defaultValue={record.precio_fijo}
              disabled={!editable}
              onBlur={(e) => {
                changeServicio(
                  e.target.value.replace(/\$\s?|(,*)/g, ''),
                  record.key
                );
              }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              step='0.01'
            />
          );
        }
        console.log(record);
        //return;
      },
    },
    {
      title: 'CANTIDAD',
      dataIndex: 'cantidad',
      type: 'number',
      width: '30px',
      editable: true,
    },

    {
      title: 'IVA',
      dataIndex: 'iva',
      width: '20px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'DESCUENTO',
      dataIndex: 'descuento',
      type: 'number',
      width: '20px',
      max: 3,
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      width: '20px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: '',
      dataIndex: 'operation',
      //fixed: breakpoint.lg ? "left": false,
      width: '50px',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
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
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    if (col.dataIndex !== 'expand') {
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: typeColumn(col.type),
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    } else return col;
  });

  const addListItem = (item) => {
    const lista = JSON.parse(JSON.stringify(listProducts));
    const dato = lista.findIndex((producto) => producto.codigo === item.codigo);
    if (dato === -1)
      lista.push({
        key: lista.length.toString(),
        titulo: item.titulo,
        codigo: item.codigo,
        clave: item.clave,
        precio_unitario: setPrecioTotalInicial(item, true),
        clave_unidad: item.unidad_cfdi,
        servicio: item.servicio,
        iva: item.iva,
        descuento: item.descuento,
        precios_variables: item.precios_variables[0],
        tipo_de_venta: item.tipo_de_venta,
        precio_fijo: item.precio_fijo,
        total: setPrecioTotalInicial(item),
        productimage:
          item.imagenes.length !== 0
            ? `${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${item.imagenes[0].directus_files_id}`
            : '',
        cantidad: 1,
      });
    onSetTotal(lista);
    setListProducts(lista);
  };
  //#endregion

  return (
    <Form
      name='basic'
      key='1'
      initialValues={{
        remember: true,
        cliente: 'nulo',
        porcentaje: 0,
        dias: 1,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <HeadingBack title='Cotización' />
      <TextLabel title='Concepto' />
      <InputForm
        titulo='concepto'
        //valueDef={dato.unidad_de_medida}
        mensaje='Asigna un concepto.'
        placeholder='Concepto.'
        //required={false}
        max={100}
      />
      <TextLabel title='Cliente' />
      <Form.Item
        key='cliente'
        name='cliente'
        rules={[
          {
            required: true,
            message: `Seleccione un concepto.`,
          },
        ]}
      >
        <Select
          showSearch
          style={{ width: '50%' }}
          placeholder='Concepto'
          optionFilterProp='children'
          onChange={(value, index) => {
            onChangeCliente(value, index);
          }}
          value='nulo'
        >
          <Option key='nulo' value='nulo'>
            Ninguno/a
          </Option>
          {clientes.map((cliente) => (
            <Option key={cliente.id} value={cliente.id}>
              {`${cliente.id} : ${cliente.nombre_comercial}`}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {cliente === undefined ? (
        <div>
          <TextLabel title='Nombre del Cliente' />
          <InputForm
            titulo='nombre'
            //valueDef={dato.unidad_de_medida}
            mensaje='Asigna un nombre.'
            placeholder='Nombre del cliente.'
            //required={false}
            max={100}
          />
          <TextLabel title='Teléfono' />
          <InputForm
            titulo='telefono'
            type='number'
            rules={{ pattern: '[0-9]{10}', message: '10 digitos numericos' }}
            //valueDef={dato.unidad_de_medida}
            placeholder='Teléfono.'
            //required={false}
            max={10}
          />
          <TextLabel title='Correo Electrónico' />
          <InputForm
            titulo='correo'
            type='email'
            //valueDef={dato.unidad_de_medida}
            mensaje='Asigna un correo.'
            placeholder='Correo Electrónico.'
            //required={false}
            max={100}
          />
          <TextLabel title='Razón Social' />
          <InputForm
            titulo='empresa'
            //valueDef={dato.unidad_de_medida}
            mensaje='Asigna una razón social.'
            placeholder='Razón Social.'
            //required={false}
            max={100}
          />
        </div>
      ) : (
        <div>
          <TextLabel
            title='Nombre del Cliente'
            subtitle={cliente?.nombre_comercial}
          />
          <TextLabel title='Teléfono' subtitle={cliente?.telefono} />
          <TextLabel
            title='Correo Electrónico'
            subtitle={cliente?.cuenta?.email}
          />
          <TextLabel title='Razón Social' subtitle={cliente?.razon_social} />
        </div>
      )}
      <TextLabel title='Nota' />
      <Form.Item name='nota' key='nota'>
        <TextArea
          //value={value}
          //placeholder='Controlled autosize'
          autoSize={{ minRows: 2, maxRows: 5 }}
          showCount
          maxLength={150}
          style={{ fontSize: '20' }}
        />
      </Form.Item>
      <TextLabel title='Fecha de Vigencia' />
      <Form.Item
        key='fecha_vigencia'
        name='fecha_vigencia'
        rules={[
          {
            required: true,
            message: `Selecciona una fecha de vigencia`,
          },
        ]}
      >
        <DatePicker
          style={{ width: '100%' }}
          onChange={onChangeTime}
          placeholder='Selecciona la fecha de entreg de vigencia'
        />
      </Form.Item>
      <TextLabel title='Porcentaje de Anticipo' />
      <NumericInputForm
        // valueDef={parseFloat(0)}
        formato='porcentaje'
        titulo='porcentaje'
        placeholder='porcentaje_anticipo'
        min={10}
        max={100}
      />
      <TextLabel title='Días de Entrega' />
      <NumericInputForm
        // valueDef={parseFloat(1)}
        formato='dias'
        titulo='dias'
        placeholder='Días de Entrega'
        min={1}
        max={100}
      />
      <Title level={5}>Productos</Title>
      <Search
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
          scroll={{ x: 1500, y: 600 }}
          dataSource={listProducts}
          columns={mergedColumns}
          rowClassName='editable-row'
          /*pagination={{
          onChange: cancel,
        }}*/
        />
      </Form>
      <br />
      <Row
        key='Row'
        gutter={[16, 24]}
        style={{ marginBottom: '10px', width: '100%' }}
        align='middle'
        justify='center'
      >
        <Col className='gutter-row' span={8}>
          <TextLabel title='SUBTOTAL' subtitle={(total - iva).toFixed(2)} />
        </Col>
        <Col className='gutter-row' span={8}>
          <TextLabel title='IVA' subtitle={iva} />
        </Col>
        <Col className='gutter-row' span={8}>
          <TextLabel title='TOTAL' subtitle={total} />
        </Col>
      </Row>
      <Form.Item>
        <Button
          style={{ margin: '0 auto', display: 'block' }}
          type='primary'
          htmlType='submit'
          size='large'
        >
          Crear Cotización
        </Button>
      </Form.Item>
      <ModalProducto
        lista={listToShow}
        visible={visible}
        setVis={changeVisible}
        onSelection={addListItem}
      />
    </Form>
  );
};

export default Index;
