import { InboxOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  message,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  Upload,
} from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { http, httpSAT } from 'api';
import InputForm from 'components/shared/InputForm';
import NumericInputForm from 'components/shared/NumericInputForm';
import HeadingBack from 'components/UI/HeadingBack';
import TextLabel from 'components/UI/TextLabel';
import { useStoreState } from 'easy-peasy';
import { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { categoriasProductos, tiposDeMoneda } from 'utils/facturas/catalogo';
import './styles.css';
const { TextArea, Search } = Input;
const { Option } = Select;
const { Dragger } = Upload;

//https://ant.design/components/upload/

const Index = ({ tipo }) => {
  let match = useRouteMatch();
  const breakpoint = useBreakpoint();
  const history = useHistory();
  const [list, setList] = useState([]);
  const [agregar, setAgregar] = useState(true);
  const [precioFijo, setPrecioFijo] = useState(0);
  const [valor, setValor] = useState({
    codigo_producto: 0,
    tipo_de_venta: 'Fijo',
    valor_1: 1,
    precio_1: 1,
    valor_2: 1,
    precio_2: 1,
    valor_3: 1,
    precio_3: 1,
    valor_4: 1,
    precio_4: 1,
  });
  const [listPS, setListPS] = useState([]);
  const [listUnidad, setListUnidad] = useState([]);
  const [agregarIma, setAgregarIma] = useState(true);

  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (tipo !== 'agregar') {
      http
        .get(
          `/items/productos/${match.params.codigo}?fields=*,precios_variables.*,imagenes.*,categorias.*`,
          putToken
        )
        .then((result) => {
          AgregarValor(result.data.data);
          AgregarLista(result.data.data);
          AgregarPrecioFijo(result.data.data.precio_fijo);
        });
    } else {
      AgregarLista({});
      AgregarPrecioFijo(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agregarIma]);

  const onSearch = (value) => {
    httpSAT
      .get(`https://apisandbox.facturama.mx/Catalogs/Units?keyword=${value}`)
      .then((result) => {
        setListUnidad(result.data);
      });
  };

  const onSearchPS = (value) => {
    httpSAT
      .get(`/Catalogs/ProductsOrServices?keyword=${value}`)
      .then((result) => {
        console.log(result.data);
        setListPS(result.data);
      });
  };

  const AgregarLista = (lista) => {
    const newList = JSON.parse(JSON.stringify(lista));
    setList([newList]);
  };

  const AgregarPrecioFijo = (precio) => {
    setPrecioFijo(precio);
  };

  const AgregarValor = (lista) => {
    console.log({
      ...valor,
      codigo_producto: lista.codigo,
      tipo_de_venta: lista.tipo_de_venta,
    });
    if (lista.categorias.length !== 0)
      if (lista.precios_variables.length !== 0)
        setValor({
          codigo_producto: lista.codigo,
          tipo_de_venta: lista.tipo_de_venta,
          id: lista.precios_variables[0].id,
          valor_1: lista.precios_variables[0].valor_1,
          precio_1: lista.precios_variables[0].precio_1,
          valor_2: lista.precios_variables[0].valor_2,
          precio_2: lista.precios_variables[0].precio_2,
          valor_3: lista.precios_variables[0].valor_3,
          precio_3: lista.precios_variables[0].precio_3,
          valor_4: lista.precios_variables[0].valor_4,
          precio_4: lista.precios_variables[0].precio_4,
        });
      else
        setValor({
          ...valor,
          codigo_producto: lista.codigo,
          tipo_de_venta: lista.tipo_de_venta,
        });
  };

  const changePrecioValue = (value) => {
    setPrecioFijo(parseFloat(value));
  };

  useEffect(() => {
    if (valor.tipo_de_venta !== 'Volumen') {
      setValor({
        ...valor,
        precio_1: cambiarPrecio(valor.valor_1),
        precio_2: cambiarPrecio(valor.valor_2),
        precio_3: cambiarPrecio(valor.valor_3),
        precio_4: cambiarPrecio(valor.valor_4),
      });
    } else
      setValor({
        ...valor,
        precio_1: valor.precio_1,
        precio_2: valor.precio_2,
        precio_3: valor.precio_3,
        precio_4: valor.precio_4,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [precioFijo, agregar]);

  const changeValor = (value, tag) => {
    setValor({ ...valor, [tag]: value });
    setAgregar(!agregar);
  };

  const cambiarPrecio = (value) => {
    switch (valor.tipo_de_venta) {
      case 'Mark Up':
        return (precioFijo * (1 + value / 100)).toFixed(2);
      case 'Margen':
        return (precioFijo / (1 - value / 100)).toFixed(2);
      case 'Volumen':
        return value;
      default:
        return precioFijo;
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error(
      'Ha sucedido un error ' + errorInfo.errorFields[0].errors[0],
      5
    );
  };

  const onFinish = (datos) => {
    // console.log({datos});
    http
      .post(
        '/items/productos/',
        {
          codigo: datos.codigo,
          titulo: datos.titulo,
          sku: datos.sku,
          tiempo_surtido: datos.tiempo_surtido,
          iva: datos.iva,
          peso: datos.peso,
          costo: datos.costo,
          moneda: datos.moneda,
          tipo_de_venta: datos.tipo_de_venta,
          tipo_de_compra: datos.tipo_de_compra,
          costeo: datos.costeo,
          //ieps: datos.ieps,
          //tipo_de_ieps: datos.tipo_de_ieps,
          unidad_de_medida: datos.unidad_de_medida,
          descripcion: datos.descripcion,
          precio_fijo: datos.precio_fijo,
          unidad_cfdi: datos.unidad_cfdi,
          maximo: datos.maximo,
          minimo: datos.minimo,
          descuento: datos.descuento,
          disponibilidad: datos.disponibilidad,
          clave: datos.clave,
          nombre_unidad_cfdi: nombreUnidad,
        },
        putToken
      )
      .then((resul) => {
        console.log(resul);
        let categorias = [];
        datos.categorias.map((categoria) => {
          return categorias.push({
            productos_codigo: datos.codigo,
            categorias_id: categoria,
          });
        });
        http
          .post(`/items/productos_categorias`, categorias, putToken)
          .then((resul2) => {
            console.log(resul2);
            http
              .post(
                `/items/precios_variables`,
                {
                  ...valor,
                  codigo_producto: datos.codigo,
                },
                putToken
              )
              .then((resul3) => {
                console.log(resul3);
                Mensaje();
              });
          });
      })
      .catch((error) => {
        if (
          error.response.data.errors[0].extensions.code === 'RECORD_NOT_UNIQUE'
        ) {
          message.error('Codigo ya existente');
        } else message.error('Un error ha ocurrido');
      });
  };

  const Mensaje = () => {
    message
      .success('El producto ha sido registrado exitosamente', 3)
      .then(() => history.goBack());
  };

  const onFinishChange = (datos) => {
    const nombreU =
      nombreUnidad !== '' ? { nombre_unidad_cfdi: nombreUnidad } : {};
    http
      .patch(
        `/items/productos/${datos.codigo}`,
        {
          titulo: datos.titulo,
          iva: datos.iva,
          sku: datos.sku,
          tiempo_surtido: datos.tiempo_surtido,
          peso: datos.peso,
          costo: datos.costo,
          moneda: datos.moneda,
          tipo_de_venta: datos.tipo_de_venta,
          tipo_de_compra: datos.tipo_de_compra,
          costeo: datos.costeo,
          //ieps: datos.ieps,
          //tipo_de_ieps: datos.tipo_de_ieps,
          unidad_de_medida: datos.unidad_de_medida,
          descripcion: datos.descripcion,
          precio_fijo: datos.precio_fijo,
          unidad_cfdi: datos.unidad_cfdi,
          maximo: datos.maximo,
          minimo: datos.minimo,
          descuento: datos.descuento,
          disponibilidad: datos.disponibilidad,
          clave: datos.clave,
          ...nombreU,
        },
        putToken
      )
      .then((resul) => {
        if (
          valor.id === window.undefined &&
          valor.tipo_de_venta !== 'Servicio' &&
          valor.tipo_de_venta !== 'Fijo'
        )
          http
            .post(
              `/items/precios_variables`,
              {
                ...valor,
                codigo_producto: datos.codigo,
              },
              putToken
            )
            .then((resul3) => {
              console.log(resul3);
              Mensaje();
            });
        else if (valor.id !== window.undefined)
          http
            .patch(
              `/items/precios_variables/${valor.id}`,
              {
                ...valor,
                codigo_producto: datos.codigo,
              },
              putToken
            )
            .then((resul3) => {
              console.log(resul3);
              Mensaje();
            });
        else Mensaje();
      })
      .catch((error) => {
        if (
          error.response.data.errors[0].extensions.code === 'RECORD_NOT_UNIQUE'
        ) {
          message.error('Codigo ya existente');
        } else message.error('Un error ha ocurrido');
      });

    const categoriasIniciales = list[0].categorias;
    const ids = categoriasIniciales.map((cat) => cat.id);
    console.log({ ids });
    if (ids.length) {
      http.patch(
        `/items/productos_categorias`,
        {
          keys: ids,
          data: {
            categorias_id: null,
            productos_codigo: null,
          },
        },
        putToken
      );
    }
    console.log(datos.categorias);
    const categoriasNuevas = datos.categorias?.map((cat) => ({
      productos_codigo: datos.codigo,
      categorias_id: categoriasProductos[cat]
        ? cat
        : Object.keys(categoriasProductos).find(
            (key) => categoriasProductos[key] === cat
          ),
    }));
    console.log({ categoriasNuevas });
    if (categoriasNuevas?.length)
      http.post(`/items/productos_categorias`, categoriasNuevas, putToken);
  };

  const [nombreUnidad, setNombreUnidad] = useState(''); //  nombre_unidad_cfdi;

  const handleChange = (value, data) => {
    setNombreUnidad(data.nombre);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/jpg' ||
      file.type === 'image/png' ||
      file.type === 'image/jfif';
    if (!isJpgOrPng) {
      message.error('Solo puede subir im??genes en formato JPG/PNG/jfif');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('La imagen debe pesar menos de 2MB');
    }
    return isJpgOrPng && isLt2M;
  };

  return list.map((dato) => (
    <Form
      key={1}
      name='basic'
      onKeyDown={(e) => (e.keyCode === 13 ? e.preventDefault() : '')}
      initialValues={{
        remember: true,
        codigo: dato.codigo,
        titulo: dato.titulo,
        sku: dato.sku,
        iva: tipo !== 'agregar' ? dato.iva : 16,
        tiempo_surtido: dato.tiempo_surtido,
        peso: dato.peso,
        costo: dato.costo,
        moneda: tipo !== 'agregar' ? dato.moneda : 'MXN',
        tipo_de_venta: tipo !== 'agregar' ? dato.tipo_de_venta : 'Fijo',
        tipo_de_compra: dato.tipo_de_compra,
        costeo: dato.costeo,
        //ieps: dato.ieps,
        //tipo_de_ieps: dato.tipo_de_ieps,
        unidad_de_medida: dato.unidad_de_medida,
        descripcion: dato.descripcion,
        precio_fijo: dato.precio_fijo,
        unidad_cfdi: dato.unidad_cfdi,
        maximo: dato.maximo,
        minimo: dato.minimo,
        descuento: dato.descuento,
        disponibilidad: tipo !== 'agregar' ? dato.disponibilidad : true,
        clave: dato.clave,
        valor_1: valor.valor_1,
        valor_2: valor.valor_2,
        valor_3: valor.valor_3,
        precio_1: valor.precio_1,
        precio_2: valor.precio_2,
        precio_3: valor.precio_3,
        categorias: dato.categorias?.map(
          (cat) => categoriasProductos[cat.categorias_id]
        ),
      }}
      onFinish={tipo === 'agregar' ? onFinish : onFinishChange}
      onFinishFailed={onFinishFailed}
    >
      <HeadingBack
        title={
          tipo === 'agregar'
            ? `Nuevo Producto`
            : tipo === 'mostrar'
            ? `Mostrar Producto ${match.params.codigo}`
            : `Editar Producto ${match.params.codigo}`
        }
      />
      <TextLabel title='Codigo' />
      <InputForm
        enable={tipo !== 'agregar'}
        valueDef={dato.codigo}
        titulo='codigo'
        mensaje='Asignar c??digo.'
        placeholder='C??digo'
        onBlurred={(value) => changeValor(value, 'codigo_producto')}
        max={40}
        //required={false}
      />
      <TextLabel title='T??tulo' />
      <InputForm
        valueDef={dato.titulo}
        enable={tipo === 'mostrar'}
        titulo='titulo'
        mensaje='Asignar T??tulo.'
        placeholder='T??tulo'
        max={50}
      />
      <TextLabel title='SKU' />
      <InputForm
        enable={tipo === 'mostrar'}
        titulo='sku'
        valueDef={dato.sku}
        mensaje='Asignar SKU.'
        placeholder='SKU'
        max={19}
        //required={false}
        //disponibilidad
      />
      <TextLabel title='IVA' />
      <NumericInputForm
        enable={tipo === 'mostrar'}
        valueDef={dato.iva}
        formato='porcentaje'
        titulo='iva'
        placeholder='iva'
        min={0}
        max={100}
      />
      <Row key='Row' gutter={[16, 24]} style={{ marginBottom: '10px' }}>
        <Col className='gutter-row' span={12}>
          <TextLabel title='Disponibilidad a venta' />
          <Form.Item
            name='disponibilidad'
            rules={[
              {
                required: true,
                message: 'Seleccione la disponibilidad',
              },
            ]}
          >
            <Switch
              checked={dato.disponibilidad}
              disabled={tipo === 'mostrar'}
              checkedChildren='Disponible'
              unCheckedChildren='No disponible '
            />
          </Form.Item>
          <TextLabel title='Peso (Opcional)' />
          <InputForm
            enable={tipo === 'mostrar'}
            valueDef={dato.peso}
            titulo='peso'
            placeholder='Peso'
            required={false}
            max={100}
          />
          <TextLabel title='Tipo de Compra (Opcional)' />
          <InputForm
            enable={tipo === 'mostrar'}
            valueDef={dato.tipo_de_compra}
            titulo='tipo_de_compra'
            mensaje='Asigna un tipo de Compra.'
            placeholder='Tipo de Compra'
            required={false}
            max={45}
          />
          <TextLabel title='Moneda' />
          <Form.Item
            name='moneda'
            rules={[
              {
                required: true,
                message: 'Ingrese un tipo de moneda',
              },
            ]}
          >
            <Select
              showSearch
              style={{ width: '100%' }}
              disabled={tipo === 'mostrar'}
              placeholder='Tipo de moneda'
              optionFilterProp='children'
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              //defaultValue={'MXM'}
              value={tipo === 'agregar' ? dato.moneda : 'MXN'}
            >
              {Object.keys(tiposDeMoneda).map((item) => {
                return (
                  <Option value={item} key={item}>
                    {`${item} : ${tiposDeMoneda[item]}`}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          {/*<TextLabel title='IEPS (Opcional)' />*/}
          <TextLabel title='Unidad de Medida' />
          <InputForm
            enable={tipo === 'mostrar'}
            titulo='unidad_de_medida'
            valueDef={dato.unidad_de_medida}
            mensaje='Asigna una unidad de medida.'
            placeholder='Unidad de medida'
            required={false}
            max={100}
          />
          <TextLabel title='Clave de Producto/Servicio' />
          <Row key='Row4' gutter={[16, 24]}>
            {tipo !== 'mostrar' ? (
              <Col
                className='gutter-row'
                style={{ width: '100%' }}
                span={breakpoint.lg ? 8 : 24}
              >
                <Search
                  placeholder='Buscar por nombre de producto'
                  onSearch={onSearchPS}
                  style={{ width: '100%' }}
                />
              </Col>
            ) : null}
            <Col
              className='gutter-row'
              style={{ width: '100%' }}
              span={tipo !== 'mostrar' ? (breakpoint.lg ? 16 : 24) : 24}
            >
              <Form.Item
                name='clave'
                rules={[
                  {
                    required: true,
                    message: 'Ingrese un tipo de moneda',
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  disabled={tipo === 'mostrar'}
                  placeholder='Selecciona el producto/servicio.'
                  optionFilterProp='children'
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0 ||
                    option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {listPS.map((item) => {
                    return (
                      <Option value={item.Value} key={item.Value}>
                        {`${item.Value} : ${item.Name}`}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <TextLabel title='M??nimo de Producto' />
          <NumericInputForm
            enable={tipo === 'mostrar'}
            titulo='minimo'
            valueDef={dato.minimo}
            placeholder='M??nimo de producto'
            mensaje='Asigna un m??nimo de producto en inventario.'
            min={1}
          />
          <TextLabel title='Precio Fijo' />
          <NumericInputForm
            enable={tipo === 'mostrar'}
            titulo='precio_fijo'
            valueDef={dato.precio_fijo}
            min='.01'
            placeholder='Precio Fijo'
            formato='precio'
            onBlurred={changePrecioValue}
            paso={0.01}
          />
        </Col>
        <Col className='gutter-row' span={12}>
          <TextLabel title='Tiempo de Surtido (Opcional)' />
          <NumericInputForm
            valueDef={dato.tiempo_surtido}
            enable={tipo === 'mostrar'}
            titulo='tiempo_surtido'
            min='1'
            placeholder='Dias de disponibilidad'
            required={false}
          />
          <TextLabel title='Costo' />
          <NumericInputForm
            enable={tipo === 'mostrar'}
            valueDef={dato.costo}
            titulo='costo'
            min='0.01'
            placeholder='Costo'
            mensaje='Asigna un costo promedio.'
            formato='precio'
            paso={0.01}
          />
          <TextLabel title='Tipo de Venta' />
          <Form.Item
            name='tipo_de_venta'
            rules={[
              {
                required: true,
                message: 'Asigne un tipo de venta.',
              },
            ]}
          >
            <Select
              style={{ width: '100%' }}
              disabled={tipo === 'mostrar'}
              placeholder='Tipo de venta'
              optionFilterProp='children'
              value={tipo !== 'agregar' ? dato.tipo_de_venta : 'Fijo'}
              onChange={(value) => {
                setValor({
                  tipo_de_venta: value,
                  valor_1: 1,
                  precio_1: 1,
                  valor_2: 1,
                  precio_2: 1,
                  valor_3: 1,
                  precio_3: 1,
                  valor_4: 1,
                  precio_4: 1,
                });
              }}
              //onFocus={onFocus}
            >
              <Option value='Fijo'>Fijo</Option>
              <Option value='Mark Up'>Mark Up</Option>
              <Option value='Margen'>Margen</Option>
              <Option value='Volumen'>Volumen</Option>
              <Option value='Servicio'>Servicio</Option>
            </Select>
          </Form.Item>
          <TextLabel title='Costeo' />
          <InputForm
            enable={tipo === 'mostrar'}
            titulo='costeo'
            valueDef={dato.costeo}
            mensaje='Asigna un Costeo.'
            placeholder='Costeo'
            required={false}
            max={45}
          />
          {/*<TextLabel title='Tipo de IEPS (Opcional)' />*/}
          <TextLabel title='Clave Unidad de CFDI' />
          <Row key='Row4' gutter={[16, 24]}>
            {tipo !== 'mostrar' ? (
              <Col
                className='gutter-row'
                style={{ width: '100%' }}
                span={breakpoint.lg ? 8 : 24}
              >
                <Search
                  placeholder='Buscar por nombre'
                  onSearch={onSearch}
                  style={{ width: '100%' }}
                />
              </Col>
            ) : null}
            <Col
              className='gutter-row'
              style={{ width: '100%' }}
              span={tipo !== 'mostrar' ? (breakpoint.lg ? 16 : 24) : 24}
            >
              <Form.Item
                name='unidad_cfdi'
                rules={[
                  {
                    required: true,
                    message: 'Ingrese un tipo de moneda',
                  },
                ]}
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  disabled={tipo === 'mostrar'}
                  placeholder='Selecciona la unidad'
                  optionFilterProp='children'
                  onChange={(value, data) => handleChange(value, data)}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0 ||
                    option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {listUnidad.map((item) => {
                    return (
                      <Option
                        value={item.Value}
                        key={item.Value}
                        nombre={item.Name}
                      >
                        {`${item.Value} : ${item.Name}`}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <TextLabel title='Categorias' />
          {tipo === 'mostrar' ? (
            dato.categorias.map(({ categorias_id }) => {
              return (
                <Tag key={categorias_id} style={{ marginBottom: '34px' }}>
                  {categoriasProductos[categorias_id]}
                </Tag>
              );
            })
          ) : (
            <Form.Item
              name='categorias'
              rules={[
                {
                  required: true,
                  message: 'Llenar una categor??a',
                },
              ]}
            >
              <Select
                mode='multiple'
                placeholder='Agrega Etiquetas de Categoria'
                // onChange={handleChangeCategorias}
                style={{ width: '100%' }}
              >
                {Object.keys(categoriasProductos).map((item) => {
                  return (
                    <Option value={item} key={item}>
                      {categoriasProductos[item]}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          )}
          <TextLabel title='M??ximo de Producto' />
          <NumericInputForm
            enable={tipo === 'mostrar'}
            titulo='maximo'
            valueDef={dato.maximo}
            placeholder='M??ximo de producto'
            min={1}
            mensaje='Asigna un m??ximo de producto en inventario.'
          />
          <TextLabel title='Descuento (Opcional)' />
          <NumericInputForm
            enable={tipo === 'mostrar'}
            valueDef={dato.descuento}
            titulo='descuento'
            min='0'
            placeholder='Descuento'
            required={false}
            formato='porcentaje'
          />
        </Col>
      </Row>
      <TextLabel title='Descripci??n' />
      <Form.Item
        name='descripcion'
        rules={[
          {
            required: false,
            message: 'Agregar una descripci??n',
          },
        ]}
      >
        <TextArea
          disabled={tipo === 'mostrar'}
          //value={value}
          //placeholder='Controlled autosize'descripcion
          name='descripcion'
          autoSize={{ minRows: 2, maxRows: 5 }}
          showCount
          maxLength={100}
          style={{ fontSize: '20' }}
        />
      </Form.Item>
      {valor.tipo_de_venta !== 'Fijo' && valor.tipo_de_venta !== 'Servicio' ? (
        <div>
          <TextLabel title='Precios Variables' />
          <Row
            key='Row2'
            gutter={[16]}
            style={{ marginBottom: '10px' }}
            align='top'
          >
            <Col className='gutter-row' span={6}>
              {valor.tipo_de_venta !== 'Volumen' ? (
                <div>
                  <Space direction='vertical' size='middle'>
                    <TextLabel title='Nivel' />
                    <TextLabel title='Normal (1)' />
                    <TextLabel title='Minorista (2)' />
                    <TextLabel title='Mayorista (3)' />
                  </Space>
                </div>
              ) : (
                <div>
                  <TextLabel title='M??nimo' />
                  <NumericInputForm
                    enable={tipo === 'mostrar'}
                    titulo='valor_1'
                    min='1'
                    placeholder='Ingrese el m??nimo 1.'
                    mensaje='Asigne un valor.'
                    defaultValue={1}
                    onBlurred={(value) => changeValor(value, 'valor_1')}
                  />
                  <NumericInputForm
                    enable={tipo === 'mostrar'}
                    titulo='valor_2'
                    min={parseFloat(valor.valor_1) + 1}
                    placeholder='Ingrese el m??nimo 2.'
                    defaultValue={parseFloat(valor.valor_1) + 1}
                    mensaje='Asigne un m??nimo.'
                    onBlurred={(value) => changeValor(value, 'valor_2')}
                  />
                  <NumericInputForm
                    enable={tipo === 'mostrar'}
                    titulo='valor_3'
                    min={parseFloat(valor.valor_2) + 1}
                    placeholder='Ingrese el m??nimo 3.'
                    defaultValue={parseFloat(valor.valor_2) + 1}
                    mensaje='Asigne un m??nimo.'
                    onBlurred={(value) => changeValor(value, 'valor_3')}
                  />
                  <NumericInputForm
                    enable={tipo === 'mostrar'}
                    titulo='valor_4'
                    min={parseFloat(valor.valor_3) + 1}
                    placeholder='Ingrese el m??nimo 4.'
                    defaultValue={parseFloat(valor.valor_3) + 1}
                    mensaje='Asigne un m??nimo.'
                    onBlurred={(value) => changeValor(value, 'valor_4')}
                  />
                </div>
              )}
            </Col>
            <Col className='gutter-row' span={6}>
              {valor.tipo_de_venta !== 'Volumen' ? (
                <div>
                  <Space direction='vertical' size='middle'>
                    <TextLabel title='Precio Fijo' />
                    <TextLabel title={`$ ${precioFijo}`} />
                    <TextLabel title={`$ ${precioFijo}`} />
                    <TextLabel title={`$ ${precioFijo}`} />
                  </Space>
                </div>
              ) : (
                <div>
                  <Space direction='vertical' size='middle'>
                    <TextLabel title='M??ximo' />
                    <TextLabel title={`${parseFloat(valor.valor_2) - 1}`} />
                    <TextLabel title={`${parseFloat(valor.valor_3) - 1}`} />
                    <TextLabel title={`${parseFloat(valor.valor_4) - 1}`} />
                    <TextLabel title={`+ ${parseFloat(valor.valor_4)}`} />
                  </Space>
                </div>
              )}
            </Col>
            <Col className='gutter-row' span={6}>
              {valor.tipo_de_venta !== 'Volumen' ? (
                <div>
                  <TextLabel title='Valor Porcentual de Ganancia' />
                  <NumericInputForm
                    enable={tipo === 'mostrar'}
                    titulo='valor_1'
                    min='10'
                    placeholder='Ingrese el Valor 1.'
                    mensaje='Asigne un valor porcentual.'
                    valueDef={valor.valor_1}
                    formato='porcentaje'
                    onBlurred={(value) => changeValor(value, 'valor_1')}
                  />
                  <NumericInputForm
                    enable={tipo === 'mostrar'}
                    titulo='valor_2'
                    min='10'
                    placeholder='Ingrese el Valor 2.'
                    valueDef={valor.valor_2}
                    mensaje='Asigne un valor porcentual.'
                    formato='porcentaje'
                    onBlurred={(value) => changeValor(value, 'valor_2')}
                  />
                  <NumericInputForm
                    enable={tipo === 'mostrar'}
                    titulo='valor_3'
                    min='10'
                    placeholder='Ingrese el Valor 3.'
                    valueDef={valor.valor_3}
                    mensaje='Asigne un valor porcentual.'
                    formato='porcentaje'
                    onBlurred={(value) => changeValor(value, 'valor_3')}
                  />
                </div>
              ) : (
                <div>
                  <TextLabel title='Valor' />
                  <NumericInputForm
                    enable={tipo === 'mostrar'}
                    titulo='precio_1'
                    min='1'
                    placeholder='Ingrese el Precio 1.'
                    mensaje='Asigne un precio.'
                    valueDef={valor.precio_1}
                    formato='precio'
                    onBlurred={(value) => changeValor(value, 'precio_1')}
                  />
                  <NumericInputForm
                    enable={tipo === 'mostrar'}
                    titulo='precio_2'
                    min='1'
                    placeholder='Ingrese el Precio 2.'
                    valueDef={valor.precio_2}
                    mensaje='Asigne un precio.'
                    formato='precio'
                    onBlurred={(value) => changeValor(value, 'precio_2')}
                  />
                  <NumericInputForm
                    enable={tipo === 'mostrar'}
                    titulo='precio_3'
                    min='1'
                    placeholder='Ingrese el Precio 3.'
                    valueDef={valor.precio_3}
                    mensaje='Asigne un precio.'
                    formato='precio'
                    onBlurred={(value) => changeValor(value, 'precio_3')}
                  />
                  <NumericInputForm
                    enable={tipo === 'mostrar'}
                    titulo='precio_4'
                    min='1'
                    placeholder='Ingrese el Precio 4.'
                    valueDef={valor.precio_4}
                    mensaje='Asigne un precio.'
                    formato='precio'
                    onBlurred={(value) => changeValor(value, 'precio_4')}
                  />
                </div>
              )}
            </Col>
            <Col className='gutter-row' span={6}>
              <Space direction='vertical' size='middle'>
                <TextLabel title='Precio' />
                <TextLabel title={`$ ${valor.precio_1}`} />
                <TextLabel title={`$ ${valor.precio_2}`} />
                <TextLabel title={`$ ${valor.precio_3}`} />
                {valor.tipo_de_venta === 'Volumen' ? (
                  <TextLabel title={`$ ${valor.precio_4}`} />
                ) : null}
              </Space>
            </Col>
          </Row>
        </div>
      ) : null}
      <div>
        <TextLabel
          title='Im??genes'
          subtitle={
            tipo === 'mostrar' || tipo === 'agregar'
              ? undefined
              : 'Presione Shift + Clic sobre la im??gen para eliminarla.'
          }
        />
        <Image.PreviewGroup style={{ width: '100%' }}>
          {dato.imagenes?.length
            ? dato.imagenes.map((imagen) => {
                return (
                  <Image
                    width={100}
                    key={imagen.directus_files_id}
                    style={{ marginRight: '5px' }}
                    preview={tipo === 'mostrar'}
                    className={tipo !== 'mostrar' ? 'img-hover' : undefined}
                    onClick={(e) => {
                      if (tipo !== 'mostrar' && e.shiftKey) {
                        http
                          .delete(
                            `/items/productos_directus_files/${imagen.id}`,
                            putToken
                          )
                          .then(() => {
                            http
                              .delete(
                                `/files/${imagen.directus_files_id}`,
                                putToken
                              )
                              .then(() => {
                                setAgregarIma(!agregarIma);
                                message.success('Im??gen eliminada con exito');
                              });
                          })
                          .catch(() => {
                            message.error('Error al eliminar la im??gen :c');
                          });
                      }
                    }}
                    src={`${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${imagen.directus_files_id}`}
                  />
                );
              })
            : null}
        </Image.PreviewGroup>
      </div>
      {tipo !== 'mostrar' ? (
        <>
          <Dragger
            action={`${process.env.REACT_APP_DIRECTUS_API_URL}/files`}
            headers={{
              Authorization: `Bearer ${token}`,
              'X-Requested-With': null,
            }}
            showUploadList={tipo === 'agregar'}
            name='file'
            listType='picture-card'
            onChange={(info) => {
              if (info?.file?.response?.data?.id !== undefined) {
                http
                  .post(
                    `/items/productos_directus_files`,
                    {
                      productos_codigo: dato.codigo,
                      directus_files_id: info?.file?.response?.data?.id,
                    },
                    putToken
                  )
                  .then((result) => {
                    setAgregarIma(!agregarIma);
                    message.success('Imagen subida con ??xito');
                  })
                  .catch(() => {
                    message.error('Error al subir la imagen');
                  });
              }
            }}
            maxCount={1}
            beforeUpload={beforeUpload}
          >
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>Haz clic o arrastre el archivo</p>
          </Dragger>
          <br />
        </>
      ) : null}
      <Space
        direction='horizontal'
        align='baseline'
        style={{ width: '100%', justifyContent: 'center' }}
      >
        <Form.Item
          name='boton'
          onKeyDown={(e) => (e.keyCode === 13 ? e.preventDefault() : '')}
        >
          <Button
            disabled={tipo === 'mostrar'}
            type='primary'
            htmlType='submit'
            style={tipo === 'mostrar' ? { visibility: 'hidden' } : null}
          >
            Guardar Producto
          </Button>
        </Form.Item>
      </Space>
    </Form>
  ));
};

export default Index;
