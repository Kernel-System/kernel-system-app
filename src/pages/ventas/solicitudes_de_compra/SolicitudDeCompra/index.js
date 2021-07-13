import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
  AutoComplete,
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Space,
} from 'antd';
import Text from 'antd/lib/typography/Text';
import {
  getPuntoDeVentaProducts,
  getPuntoDeVentaServices,
} from 'api/ventas/punto_de_venta';
import {
  getSolicitudCompra,
  updateSolicitudCompra,
} from 'api/ventas/solicitudes_compra';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import HeadingBack from 'components/UI/HeadingBack';
import TextLabel from 'components/UI/TextLabel';
import SolicitudesCompraProductsTable from 'components/ventas/solicitudes_compra/SolicitudCompraProductsTable';
import { useStoreState } from 'easy-peasy';
import moment from 'moment';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  capitalize,
  formatDateTime,
  formatPhoneNumber,
  toPercent,
} from 'utils/functions';
import { calcCantidad, calcPrecioVariable } from 'utils/productos';
import SolicitudDeCompraSummary from '../SolicitudDeCompraSummary';

const SolicitudDeCompra = () => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [productQuery, setProductQuery] = useState(undefined);
  const [serviceQuery, setServiceQuery] = useState(undefined);
  const [newProducts, setNewProducts] = useState([]);
  const [comentarios, setComentarios] = useState('');
  const token = useStoreState((state) => state.user.token.access_token);
  const products = useQuery(['punto-de-venta-products', productQuery], () =>
    getPuntoDeVentaProducts(productQuery, token)
  );
  const productsData = products.data?.data?.data;
  const services = useQuery(['punto-de-venta-services', serviceQuery], () =>
    getPuntoDeVentaServices(serviceQuery, token)
  );
  const servicesData = services.data?.data?.data;

  const solicitud = useQuery(['solicitud-de-compra', id], () =>
    getSolicitudCompra(id, token)
  );
  const solicitudData = solicitud.data?.data?.data;

  const removeItem = (codigo) => {
    setNewProducts(
      newProducts.filter((product) => product.codigo_producto.codigo !== codigo)
    );
  };

  const addOneToItem = (campo, codigo) => {
    setNewProducts(
      newProducts.map((product) =>
        product.codigo_producto.codigo === codigo
          ? { ...product, [campo]: (product[campo] += 1) }
          : product
      )
    );
  };

  const subOneToItem = (campo, codigo) => {
    setNewProducts(
      newProducts.map((product) =>
        product.codigo_producto.codigo === codigo
          ? { ...product, [campo]: (product[campo] -= 1) }
          : product
      )
    );
  };

  const setValueToItem = ({ campo, codigo, valor }) => {
    setNewProducts(
      newProducts.map((product) =>
        product.codigo_producto.codigo === codigo
          ? {
              ...product,
              [campo]:
                campo === 'precio_ofrecido'
                  ? parseFloat(valor)
                  : parseInt(valor),
            }
          : product
      )
    );
  };

  const handleSetProductQuery = (query) => {
    setProductQuery(query);
    queryClient.invalidateQueries('punto-de-venta-products');
  };

  const handleSetServiceQuery = (query) => {
    setServiceQuery(query);
    queryClient.invalidateQueries('punto-de-venta-services');
  };

  const handleAddToSolicitud = (codigo) => {
    try {
      const existingProduct = newProducts.find(
        (product) => product.codigo_producto.codigo === codigo
      );

      const isProduct = productsData.find(
        (product) => product.codigo === codigo
      );
      let newProduct = isProduct
        ? productsData.find((product) => product.codigo === codigo)
        : servicesData.find((service) => service.codigo === codigo);

      if (existingProduct) {
        addOneToItem('cantidad', codigo);
      } else {
        setNewProducts([
          ...newProducts,
          {
            cantidad: 1,
            codigo_producto: newProduct,
            descuento_ofrecido: newProduct.descuento,
            iva: newProduct.iva,
            precio_ofrecido: calcPrecioVariable(newProduct, 1),
          },
        ]);
      }
      message.success('Producto añadido correctamente');
    } catch (error) {
      message.error('Lo sentimos, ha ocurrido un error');
    }
  };

  const handleSubmit = (estado) => {
    const updatedSolicitud = {
      estado,
      fecha_ultima_revision: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
      total: newProducts.reduce(
        (total, product) =>
          total +
          product.precio_ofrecido *
            toPercent(100 - product.descuento_ofrecido) *
            toPercent(100 + product.iva) *
            product.cantidad,
        0
      ),
      productos_solicitados: newProducts.map((product) => ({
        cantidad: product.cantidad,
        precio_ofrecido: product.precio_ofrecido,
        descuento_ofrecido: product.descuento_ofrecido,
        iva: product.iva,
        codigo_producto: product.codigo_producto.codigo,
      })),
      comentarios,
    };
    setLoading(true);
    updateSolicitudCompra(id, updatedSolicitud, token)
      .then(() => {
        message.success(
          `Se ha ${
            estado === 'aprobada' ? 'aprobado' : 'rechazado'
          } la solicitud correctamente`,
          2,
          () => {
            setLoading(false);
            history.push('/empleado/solicitudes-de-compra');
          }
        );
      })
      .catch(() => {
        message.error('Lo sentimos, ha ocurrido un error');
      });
  };

  return (
    <>
      <HeadingBack
        title='Solicitud de compra'
        extra={solicitud.isFetched && `#${solicitudData.id}`}
      />
      {solicitud.isLoading ? (
        <CenteredSpinner />
      ) : (
        <>
          <Row gutter={[16]}>
            <Col xs={24} md={12}>
              <TextLabel
                title='Cliente'
                subtitle={
                  <>
                    {solicitudData.id_cliente.nombre_comercial} - Tel.
                    <Text underline type='secondary'>
                      {formatPhoneNumber(solicitudData.id_cliente.telefono)}
                    </Text>
                  </>
                }
              />
            </Col>
            <Col xs={24} md={12}>
              <TextLabel
                title='Estado'
                subtitle={capitalize(solicitudData.estado)}
              />
            </Col>
            <Col xs={24} md={12}>
              <TextLabel
                title='Fecha de solicitud'
                subtitle={formatDateTime(solicitudData.fecha_solicitud, 'long')}
              />
            </Col>
            <Col xs={24} md={12}>
              <TextLabel
                title='Fecha de última revisión'
                subtitle={
                  solicitudData.fecha_ultima_revision
                    ? formatDateTime(
                        solicitudData.fecha_ultima_revision,
                        'long'
                      )
                    : '-'
                }
              />
            </Col>
            <Col xs={24} md={12}>
              <TextLabel
                title='Tipo de entrega'
                subtitle={
                  solicitudData.tipo_de_entrega === false
                    ? 'Recoger en una sucursal Kernel System'
                    : 'A domicilio'
                }
              />
            </Col>
            <Col xs={24} md={12}>
              <TextLabel
                title='Forma de pago'
                subtitle={
                  solicitudData.forma_de_pago === false
                    ? 'Pagar en sucursal'
                    : 'Pagar en linea'
                }
              />
            </Col>
            <Col xs={24} md={12}>
              <TextLabel
                title='Método de pago'
                subtitle={
                  solicitudData.metodo_de_pago === false
                    ? 'Pago en una exhibición'
                    : 'Pago en parcialidades'
                }
              />
            </Col>
            <Col xs={24} md={12}>
              <TextLabel
                title='Sucursal'
                subtitle={`${solicitudData.sucursal.clave} - ${solicitudData.sucursal.nombre}`}
              />
            </Col>
            <Divider />
            <Col span={24}>
              <TextLabel title='Productos solicitados' />
              {solicitudData.estado === 'pendiente' && (
                <Form layout='vertical'>
                  <Form.Item label='Buscar producto'>
                    <AutoComplete
                      style={{ width: '100%' }}
                      placeholder='Buscar producto por nombre o código'
                      onSelect={handleAddToSolicitud}
                      onChange={handleSetProductQuery}
                      allowClear
                    >
                      {productsData?.map((productData) => (
                        <AutoComplete.Option
                          key={productData.codigo}
                          disabled={calcCantidad(productData) === 0}
                        >
                          <strong>{productData.codigo}</strong> |{' '}
                          {productData.titulo}
                        </AutoComplete.Option>
                      ))}
                    </AutoComplete>
                  </Form.Item>
                  <Form.Item label='Buscar servicio'>
                    <AutoComplete
                      style={{ width: '100%' }}
                      placeholder='Buscar servicio por nombre'
                      onSelect={handleAddToSolicitud}
                      onChange={handleSetServiceQuery}
                      allowClear
                    >
                      {servicesData?.map((serviceData) => (
                        <AutoComplete.Option key={serviceData.codigo}>
                          <strong>{serviceData.codigo}</strong> |{' '}
                          {serviceData.titulo}
                        </AutoComplete.Option>
                      ))}
                    </AutoComplete>
                  </Form.Item>
                </Form>
              )}
              <SolicitudesCompraProductsTable
                products={solicitudData.productos_solicitados}
                newProducts={newProducts}
                setNewProducts={setNewProducts}
                estado={solicitudData.estado}
                removeItem={removeItem}
                addOneToItem={addOneToItem}
                subOneToItem={subOneToItem}
                setValueToItem={setValueToItem}
              />
            </Col>
            <Col xs={24} md={12}>
              <TextLabel title='Comentarios' />
              <Input.TextArea
                showCount
                maxLength={100}
                value={
                  solicitudData.estado === 'pendiente'
                    ? comentarios
                    : solicitudData.comentarios
                }
                onChange={({ target: { value } }) => setComentarios(value)}
                disabled={solicitudData.estado !== 'pendiente' ? true : false}
                style={{ marginBottom: '1rem' }}
              />
              {solicitudData.estado === 'pendiente' ? (
                <Space>
                  <Button
                    type='primary'
                    icon={<CheckOutlined />}
                    onClick={() => handleSubmit('aprobada')}
                    loading={loading}
                  >
                    Aprobar
                  </Button>
                  <Popconfirm
                    title='¿Está seguro que quiere rechazar esta solicitud?'
                    okText='Rechazar'
                    okType='danger'
                    cancelText='Cancelar'
                    onConfirm={() => handleSubmit('rechazada')}
                  >
                    <Button danger icon={<CloseOutlined />} loading={loading}>
                      Rechazar
                    </Button>
                  </Popconfirm>
                </Space>
              ) : (
                solicitudData.estado === 'aprobada' && (
                  <Link to={`/venta?solicitud=${id}`}>
                    <Button type='primary'>Proceder a pagar</Button>
                  </Link>
                )
              )}
            </Col>
            <Col xs={24} md={12}>
              <TextLabel title='Resumen' />
              <SolicitudDeCompraSummary products={newProducts} />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default SolicitudDeCompra;
