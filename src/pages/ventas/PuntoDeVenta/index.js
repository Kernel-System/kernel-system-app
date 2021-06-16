import {
  AutoComplete,
  Button,
  Card,
  Col,
  Divider,
  Form,
  message,
  Radio,
  Row,
  Space,
  Typography,
} from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import {
  getPuntoDeVentaProducts,
  getPuntoDeVentaServices,
} from 'api/ventas/punto_de_venta';
import ProductsTable from 'components/shared/ProductsTable';
import Summary from 'components/table/Summary';
import Heading from 'components/UI/Heading';
import MetodoPagoModal from 'components/ventas/MetodoPagoModal';
import { useStoreState } from 'easy-peasy';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { calcCantidad } from 'utils/productos';
const { Paragraph } = Typography;

const PuntoDeVenta = () => {
  const queryClient = useQueryClient();
  const breakpoint = useBreakpoint();
  const token = useStoreState((state) => state.user.token.access_token);
  const [puntoDeVentaProducts, setPuntoDeVentaProducts] = useState([]);
  const [productQuery, setProductQuery] = useState(undefined);
  const [serviceQuery, setServiceQuery] = useState(undefined);
  const [tipoComprobante, setTipoComprobante] = useState('ticket');
  const [formaPago, setFormaPago] = useState('exhibicion');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const products = useQuery(['punto-de-venta-products', productQuery], () =>
    getPuntoDeVentaProducts(productQuery, token)
  );

  const productsData = products.data?.data?.data;
  const services = useQuery(['punto-de-venta-services', serviceQuery], () =>
    getPuntoDeVentaServices(serviceQuery, token)
  );

  const servicesData = services.data?.data?.data;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddToOrder = (codigo) => {
    try {
      const existingProduct = puntoDeVentaProducts.find(
        (product) => product.codigo === codigo
      );

      const isProduct = productsData.find(
        (product) => product.codigo === codigo
      );
      let newProduct = isProduct
        ? productsData.find((product) => product.codigo === codigo)
        : servicesData.find((service) => service.codigo === codigo);

      if (existingProduct) {
        setPuntoDeVentaProducts((prevPuntoDeVentaProducts) =>
          prevPuntoDeVentaProducts.map((product) =>
            product.codigo === codigo
              ? {
                  ...product,
                  cantidad: product.cantidad + 1,
                }
              : product
          )
        );
      } else {
        setPuntoDeVentaProducts((prevPuntoDeVentaProducts) => [
          ...prevPuntoDeVentaProducts,
          {
            ...newProduct,
            cantidad: 1,
          },
        ]);
      }
      message.success('Producto añadido correctamente');
    } catch (error) {
      message.error('Lo sentimos, ha ocurrido un error');
    }
  };

  const handleRemoveItem = (codigo) => {
    setPuntoDeVentaProducts((prevPuntoDeVentaProducts) =>
      prevPuntoDeVentaProducts.filter((product) => product.codigo !== codigo)
    );
  };

  const handleAddOneDiscountToItem = (codigo) =>
    setPuntoDeVentaProducts((prevPuntoDeVentaProducts) =>
      prevPuntoDeVentaProducts.map((product) =>
        product.codigo === codigo
          ? {
              ...product,
              descuento: product.descuento + 1,
            }
          : product
      )
    );

  const handleSubOneDiscountToItem = (codigo) =>
    setPuntoDeVentaProducts((prevPuntoDeVentaProducts) =>
      prevPuntoDeVentaProducts.map((product) =>
        product.codigo === codigo
          ? {
              ...product,
              descuento: product.descuento - 1,
            }
          : product
      )
    );

  const handleAddOnePriceToItem = (codigo) =>
    setPuntoDeVentaProducts((prevPuntoDeVentaProducts) =>
      prevPuntoDeVentaProducts.map((product) =>
        product.codigo === codigo
          ? {
              ...product,
              precio_fijo: product.precio_fijo + 1,
            }
          : product
      )
    );

  const handleSubOnePriceToItem = (codigo) =>
    setPuntoDeVentaProducts((prevPuntoDeVentaProducts) =>
      prevPuntoDeVentaProducts.map((product) =>
        product.codigo === codigo
          ? {
              ...product,
              precio_fijo: product.precio_fijo - 1,
            }
          : product
      )
    );

  const handleAddOneToItem = (codigo) =>
    setPuntoDeVentaProducts((prevPuntoDeVentaProducts) =>
      prevPuntoDeVentaProducts.map((product) =>
        product.codigo === codigo
          ? {
              ...product,
              cantidad: product.cantidad + 1,
            }
          : product
      )
    );

  const handleSubOneToItem = (codigo) =>
    setPuntoDeVentaProducts((prevPuntoDeVentaProducts) =>
      prevPuntoDeVentaProducts.map((product) =>
        product.codigo === codigo
          ? {
              ...product,
              cantidad: product.cantidad - 1,
            }
          : product
      )
    );

  const handleSetQuantityToItem = (codigo, cantidad) =>
    setPuntoDeVentaProducts((prevPuntoDeVentaProducts) =>
      prevPuntoDeVentaProducts.map((product) =>
        product.codigo === codigo
          ? {
              ...product,
              cantidad: parseInt(cantidad),
            }
          : product
      )
    );

  const handleSetProductQuery = (query) => {
    setProductQuery(query);
    queryClient.invalidateQueries('punto-de-venta-products');
  };

  const handleSetServiceQuery = (query) => {
    setServiceQuery(query);
    queryClient.invalidateQueries('punto-de-venta-services');
  };

  return (
    <>
      <Heading title='Punto de venta' />
      <Form layout='vertical'>
        <Form.Item label='Buscar producto'>
          <AutoComplete
            style={{ width: '100%' }}
            placeholder='Buscar producto por nombre o código'
            onSelect={handleAddToOrder}
            onChange={handleSetProductQuery}
            allowClear
          >
            {productsData?.map((productData) => (
              <AutoComplete.Option
                key={productData.codigo}
                disabled={calcCantidad(productData) === 0}
              >
                <strong>{productData.codigo}</strong> | {productData.titulo}
              </AutoComplete.Option>
            ))}
          </AutoComplete>
        </Form.Item>
        {!breakpoint.sm && <Divider style={{ marginTop: 0 }} />}
        <Form.Item label='Buscar servicio'>
          <AutoComplete
            style={{ width: '100%' }}
            placeholder='Buscar servicio por nombre'
            onSelect={handleAddToOrder}
            onChange={handleSetServiceQuery}
            allowClear
          >
            {servicesData?.map((serviceData) => (
              <AutoComplete.Option key={serviceData.codigo}>
                <strong>{serviceData.codigo}</strong> | {serviceData.titulo}
              </AutoComplete.Option>
            ))}
          </AutoComplete>
        </Form.Item>
      </Form>
      <ProductsTable
        products={puntoDeVentaProducts}
        type='venta'
        removeItem={handleRemoveItem}
        addOneToItem={handleAddOneToItem}
        subOneToItem={handleSubOneToItem}
        addOneDiscountToItem={handleAddOneDiscountToItem}
        subOneDiscountToItem={handleSubOneDiscountToItem}
        addOnePriceToItem={handleAddOnePriceToItem}
        subOnePriceToItem={handleSubOnePriceToItem}
        setQuantityToItem={handleSetQuantityToItem}
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={6}>
          <Card size='small' title='Factura'>
            <Space direction='vertical'>
              <div>
                <Paragraph type='secondary'>Elija una opción</Paragraph>
                <Radio.Group
                  defaultValue={tipoComprobante}
                  onChange={(e) => setTipoComprobante(e.target.value)}
                >
                  <Space direction='vertical'>
                    <Radio value={'ticket'}>Ticket</Radio>
                    <Radio value={'factura'}>Factura </Radio>
                  </Space>
                </Radio.Group>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card size='small' title='Forma de pago'>
            <Paragraph type='secondary'>Elija una opción</Paragraph>
            <Radio.Group
              defaultValue={formaPago}
              onChange={(e) => setFormaPago(e.target.value)}
            >
              <Space direction='vertical'>
                <Radio value={'exhibicion'}>Pago en una exhibición</Radio>
                <Radio value={'parcialidades'}>Pago en parcialidades</Radio>
              </Space>
            </Radio.Group>
          </Card>
        </Col>
        <Col xs={24} lg={{ span: 7, offset: 5 }}>
          <Summary
            buttonLabel='Proceder a pagar'
            buttonAction={showModal}
            products={puntoDeVentaProducts}
            type='pdv'
          />
          <br />
          <Link to='/cotizacion-cliente/nuevo'>
            <Button type='link' block>
              Generar cotización
            </Button>
          </Link>
        </Col>
      </Row>
      <MetodoPagoModal
        products={puntoDeVentaProducts}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </>
  );
};

export default PuntoDeVenta;
