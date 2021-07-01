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
import { http, httpSAT } from 'api';
import { useStoreState } from 'easy-peasy';
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { calcCantidad, calcPrecioVariable } from 'utils/productos';
const { Paragraph } = Typography;

const PuntoDeVenta = () => {
  const queryClient = useQueryClient();
  const breakpoint = useBreakpoint();
  const token = useStoreState((state) => state.user.token.access_token);
  const [puntoDeVentaProducts, setPuntoDeVentaProducts] = useState([]);
  const [productQuery, setProductQuery] = useState(undefined);
  const [serviceQuery, setServiceQuery] = useState(undefined);
  const [tipoComprobante, setTipoComprobante] = useState('ticket');
  const [formaPago, setFormaPago] = useState('PUE');
  const [metodoPago, setMetodoPago] = useState('01');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [empleado, setEmpleado] = useState({});
  const [almacenes, setAlmacenes] = useState([]);

  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const onSetDato = (lista, setDato) => {
    console.log(lista);
    setDato(lista);
  };

  useEffect(() => {
    http.get(`/users/me?fields=empleado.*`, putToken).then((result) => {
      onSetDato(result.data.data.empleado[0], setEmpleado);
      return http
        .get(
          `/items/almacenes?fields=clave&filter[clave_sucursal][_in]=${result.data.data.empleado[0].sucursal}`,
          putToken
        )
        .then((result) => {
          onSetDato(
            result.data.data.map((almacen) => almacen.clave),
            setAlmacenes
          );
        });
    });
  }, []);

  const products = useQuery(['punto-de-venta-products', productQuery], () =>
    getPuntoDeVentaProducts(productQuery, token, empleado.sucursal)
  );

  const setProductData = () => {
    let productos = [];
    products.data?.data?.data.forEach((producto) => {
      let inventario = producto.inventario
        .filter((inven) => almacenes.includes(inven.clave_almacen))
        .map((inven) => {
          return { cantidad: inven.cantidad };
        });
      if (inventario.length > 0) {
        productos.push({ ...producto, inventario: inventario });
      }
    });
    return productos;
  };

  const productsData = setProductData(products.data?.data?.data);

  const services = useQuery(['punto-de-venta-services', serviceQuery], () =>
    getPuntoDeVentaServices(serviceQuery, token, empleado.sucursal)
  );

  const servicesData = services.data?.data?.data;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = (datos) => {
    console.log(datos);
    setIsModalVisible(false);
    //if (tipoComprobante === 'factura') {
    let items = [];
    console.log(puntoDeVentaProducts);
    puntoDeVentaProducts.forEach((producto) => {
      console.log(producto);
      items.push({
        ProductCode: producto.clave,
        IdentificationNumber: producto.codigo,
        Description: producto.titulo,
        Unit: 'NO APLICA',
        UnitCode: producto.unidad_cfdi,
        UnitPrice: calcPrecioVariable(producto, 1),
        Quantity: producto.cantidad,
        Subtotal: calcPrecioVariable(producto, 1) * producto.cantidad,
        Discount:
          calcPrecioVariable(producto, 1) *
          producto.cantidad *
          (producto.descuento / 100),
        Taxes: [
          {
            Total:
              calcPrecioVariable(producto, 1) *
              producto.cantidad *
              (1 - producto.descuento / 100) *
              (producto.iva / 100),
            Name: 'IVA',
            Rate: producto.iva / 100,
            Base:
              calcPrecioVariable(producto, 1) *
              producto.cantidad *
              (1 - producto.descuento / 100),
            IsRetention: false,
          },
        ],
        Total:
          calcPrecioVariable(producto, 1) *
          producto.cantidad *
          (1 - producto.descuento / 100) *
          (1 + producto.iva / 100),
      });
    });
    console.log({
      Serie: 'F',
      ExpeditionPlace: '06100',
      PaymentConditions: 'CREDITO A SIETE DIAS',
      CfdiType: datos.cfdi,
      PaymentForm: metodoPago,
      PaymentMethod: formaPago,
      Issuer: {
        //emisor
        FiscalRegime: '601',
        Rfc: 'ESO1202108R2',
        Name: 'SinDelantal Mexico',
      },
      Receiver: {
        Rfc: 'SME111110NY1',
        Name: 'SinDelantal Mexico',
        CfdiUse: 'P01',
      },
      Items: items,
    });

    //}
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
        nivel={1}
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
        <Col span={breakpoint.lg ? 6 : 24}>
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
        <Col span={breakpoint.lg ? 6 : 24}>
          <Card size='small' title='Método de Pago'>
            <Paragraph type='secondary'>Elija una opción</Paragraph>
            <Radio.Group
              defaultValue={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
            >
              <Space direction='vertical'>
                <Radio value={'01'}>Pago en efectivo</Radio>
                <Radio value={'04'}>Pago con tarjeta de débito o crédito</Radio>
              </Space>
            </Radio.Group>
          </Card>
        </Col>
        <Col span={breakpoint.lg ? 6 : 24}>
          <Card size='small' title='Forma de pago'>
            <Paragraph type='secondary'>Elija una opción</Paragraph>
            <Radio.Group
              defaultValue={formaPago}
              disabled={tipoComprobante !== 'factura'}
              onChange={(e) => setFormaPago(e.target.value)}
            >
              <Space direction='vertical'>
                <Radio value={'PUE'}>Pago en una exhibición</Radio>
                <Radio value={'PPD'}>Pago en parcialidades</Radio>
              </Space>
            </Radio.Group>
          </Card>
        </Col>
        <Col span={breakpoint.lg ? 6 : 24}>
          <Summary
            nivel={1}
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
        tipoComprobante={tipoComprobante}
        metodoPago={metodoPago}
      />
    </>
  );
};

export default PuntoDeVenta;
