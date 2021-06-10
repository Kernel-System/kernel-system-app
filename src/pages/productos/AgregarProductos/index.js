import { PlusOutlined } from '@ant-design/icons';
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
} from 'antd';
import { http } from 'api';
import InputForm from 'components/shared/InputForm';
import NumericInputForm from 'components/shared/NumericInputForm';
import HeadingBack from 'components/UI/HeadingBack';
import TextLabel from 'components/UI/TextLabel';
import { useStoreState } from 'easy-peasy';
import { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { categoriasProductos, tiposDeMoneda } from 'utils/facturas/catalogo';
const { TextArea } = Input;
const { Option } = Select;

//https://ant.design/components/upload/

const Index = ({ tipo }) => {
  let match = useRouteMatch();
  const history = useHistory();
  const [list, setList] = useState([]);
  const [agregar, setAgregar] = useState(true);
  const [precioFijo, setPrecioFijo] = useState(0);
  const [valor, setValor] = useState({
    codigo_producto: 0,
    tipo_de_venta: 0,
    valor_1: 1,
    precio_1: 1,
    valor_2: 1,
    precio_2: 1,
    valor_3: 1,
    precio_3: 1,
    valor_4: 1,
    precio_4: 1,
  });
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
          console.log(result.data.data);
          AgregarValor(result.data.data);
          AgregarLista(result.data.data);
          AgregarPrecioFijo(result.data.data.precio_fijo);
        });
    } else {
      AgregarLista({});
      AgregarPrecioFijo(0);
    }
  }, []);

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
    console.log(datos);
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
            if (datos.tipo_de_venta !== 'Fijo')
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
            else Mensaje();
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
      .success('El producto ha sido registrados exitosamente', 3)
      .then(() => history.goBack());
  };

  const onFinishChange = (datos) => {
    http
      .patch(
        `/items/productos/${datos.codigo}`,
        {
          codigo: datos.codigo,
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
        },
        putToken
      )
      .then((resul) => {
        if (valor.id === window.undefined)
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
        else
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
      })
      .catch((error) => {
        if (
          error.response.data.errors[0].extensions.code === 'RECORD_NOT_UNIQUE'
        ) {
          message.error('Codigo ya existente');
        } else message.error('Un error ha ocurrido');
      });
  };

  return list.map((dato) => (
    <Form
      key={1}
      name='basic'
      initialValues={{
        remember: true,
        codigo: dato.codigo,
        titulo: dato.titulo,
        sku: dato.sku,
        iva: tipo !== 'agregar' ? dato.iva : 16,
        tiempo_surtido: dato.tiempo_surtido,
        peso: dato.peso,
        costo: dato.costo,
        moneda: tipo !== 'agregar' ? dato.moneda : 'MXM',
        tipo_de_venta: dato.tipo_de_venta,
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
        mensaje='Asignar código.'
        placeholder='Código'
        onBlurred={(value) => changeValor(value, 'codigo_producto')}
        max={40}
        //required={false}
      />
      <TextLabel title='Título' />
      <InputForm
        valueDef={dato.titulo}
        enable={tipo === 'mostrar'}
        titulo='titulo'
        mensaje='Asignar Título.'
        placeholder='Título'
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
          <NumericInputForm
            enable={tipo === 'mostrar'}
            valueDef={dato.peso}
            titulo='peso'
            placeholder='Peso'
            required={false}
            max={8}
            paso={0.01}
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
              defaultValue={tipo === 'agregar' ? dato.moneda : 'MXM'}
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
            placeholder='Tipo de Compra'
            required={false}
            max={100}
          />
          <TextLabel title='Clave de Producto/Servicio' />
          <NumericInputForm
            enable={tipo === 'mostrar'}
            titulo='clave'
            valueDef={dato.clave}
            min='01010101'
            max='95141904'
            placeholder='Clave'
            mensaje='Asigna una clave de producto/servicio.'
          />
          <TextLabel title='Mínimo de Producto' />
          <NumericInputForm
            enable={tipo === 'mostrar'}
            titulo='minimo'
            valueDef={dato.minimo}
            placeholder='Mínimo de producto'
            mensaje='Asigna un mínimo de producto en inventario.'
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
              defaultValue={tipo !== 'agregar' ? dato.tipo_de_venta : 'Fijo'}
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
              //onSearch={onSearch}
            >
              <Option value='Fijo'>Fijo</Option>
              <Option value='Mark Up'>Mark Up</Option>
              <Option value='Margen'>Margen</Option>
              <Option value='Volumen'>Volúmen</Option>
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
          <InputForm
            enable={tipo === 'mostrar'}
            titulo='unidad_cfdi'
            valueDef={dato.unidad_cfdi}
            mensaje='Asigna una unidad CFDI.'
            placeholder='Unidad CFDI'
            max={3}
          />
          <TextLabel title='Categorias' />

          {tipo === 'agregar' ? (
            <Form.Item
              name='categorias'
              rules={[
                {
                  required: true,
                  message: 'Llenar una categoría',
                },
              ]}
            >
              <Select
                mode='multiple'
                disabled={tipo !== 'agregar'}
                placeholder='Agrega Etiquetas de Categoria'
                //value={selectedItems}
                //onChange={handleChangeItems}
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
          ) : (
            dato.categorias.map((categoria) => {
              return (
                <Tag key={categoria.id} style={{ marginBottom: '34px' }}>
                  {categoriasProductos[categoria.id]}
                </Tag>
              );
            })
          )}
          <TextLabel title='Máximo de Producto' />
          <NumericInputForm
            enable={tipo === 'mostrar'}
            titulo='maximo'
            valueDef={dato.maximo}
            placeholder='Máximo de producto'
            min={1}
            mensaje='Asigna un máximo de producto en inventario.'
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
      <TextLabel title='Descripción' />
      <Form.Item
        name='descripcion'
        rules={[
          {
            required: false,
            message: 'Agregar una descripción',
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
      {valor.tipo_de_venta !== 'Fijo' ? (
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
                  <TextLabel title='Mínimo' />
                  <NumericInputForm
                    enable={tipo === 'mostrar'}
                    titulo='valor_1'
                    min='1'
                    placeholder='Ingrese el mínimo 1.'
                    mensaje='Asigne un valor.'
                    defaultValue={1}
                    onBlurred={(value) => changeValor(value, 'valor_1')}
                  />
                  <NumericInputForm
                    enable={tipo === 'mostrar'}
                    titulo='valor_2'
                    min={parseFloat(valor.valor_1) + 1}
                    placeholder='Ingrese el mínimo 2.'
                    defaultValue={parseFloat(valor.valor_1) + 1}
                    mensaje='Asigne un mínimo.'
                    onBlurred={(value) => changeValor(value, 'valor_2')}
                  />
                  <NumericInputForm
                    enable={tipo === 'mostrar'}
                    titulo='valor_3'
                    min={parseFloat(valor.valor_2) + 1}
                    placeholder='Ingrese el mínimo 3.'
                    defaultValue={parseFloat(valor.valor_2) + 1}
                    mensaje='Asigne un mínimo.'
                    onBlurred={(value) => changeValor(value, 'valor_3')}
                  />
                  <NumericInputForm
                    enable={tipo === 'mostrar'}
                    titulo='valor_4'
                    min={parseFloat(valor.valor_3) + 1}
                    placeholder='Ingrese el mínimo 4.'
                    defaultValue={parseFloat(valor.valor_3) + 1}
                    mensaje='Asigne un mínimo.'
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
                    <TextLabel title='Máximo' />
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
                    min='10'
                    placeholder='Ingrese el Precio 1.'
                    mensaje='Asigne un precio.'
                    valueDef={valor.precio_1}
                    formato='precio'
                    onBlurred={(value) => changeValor(value, 'precio_1')}
                  />
                  <NumericInputForm
                    enable={tipo === 'mostrar'}
                    titulo='precio_2'
                    min='10'
                    placeholder='Ingrese el Precio 2.'
                    valueDef={valor.precio_2}
                    mensaje='Asigne un precio.'
                    formato='precio'
                    onBlurred={(value) => changeValor(value, 'precio_2')}
                  />
                  <NumericInputForm
                    enable={tipo === 'mostrar'}
                    titulo='precio_3'
                    min='10'
                    placeholder='Ingrese el Precio 3.'
                    valueDef={valor.precio_3}
                    mensaje='Asigne un precio.'
                    formato='precio'
                    onBlurred={(value) => changeValor(value, 'precio_3')}
                  />
                  <NumericInputForm
                    enable={tipo === 'mostrar'}
                    titulo='precio_4'
                    min='10'
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
      {tipo !== 'agregar' ? (
        <div>
          <TextLabel
            title='Imágenes'
            subtitle='Seleccionar el boton de "Agregar Imagen", ir a la opción de "Imagenes" y seleccionar "Crear Nuevo", arrastrar o subir los archivos correspondientes, al finalizar confirmar en el boton de la esquina superior derecha'
          />
          <Image.PreviewGroup style={{ width: '100%' }}>
            {dato.imagenes.map((imagen) => {
              return (
                <Image
                  width={100}
                  src={`${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${imagen.directus_files_id}`}
                  //preview={false}
                />
              );
            })}
          </Image.PreviewGroup>
          {tipo !== 'mostrar' ? (
            <div>
              <br />
              <br />
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={() => {
                  window
                    .open(
                      `${process.env.REACT_APP_DIRECTUS_API_URL}/admin/collections/productos/${dato.codigo}`,
                      '_blank'
                    )
                    .focus();
                }}
              >
                Agregar Imagen
              </Button>
            </div>
          ) : null}
          <br />
          <br />
        </div>
      ) : null}

      <Space
        direction='horizontal'
        align='baseline'
        style={{ width: '100%', justifyContent: 'center' }}
      >
        <Form.Item name='boton'>
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
