import { DeleteFilled } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  message,
  Popconfirm,
  Radio,
  Row,
  Space,
  Typography,
} from 'antd';
import { insertSolicitudCompra } from 'api/cart';
import { getUserData } from 'api/profile';
import { getCartProducts } from 'api/shared/products';
import ProductsTable from 'components/shared/ProductsTable';
import Summary from 'components/table/Summary';
import Heading from 'components/UI/Heading';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useState } from 'react';
import {
  focusManager,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { useHistory } from 'react-router-dom';
import { toPercent } from 'utils/functions';
import { calcPrecioVariable } from 'utils/productos';
const { Paragraph } = Typography;

const Cart = () => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const cartItems = useStoreState((state) => state.cart.cartItems);
  const nivel = useStoreState((state) => state.user.nivel);
  const token = useStoreState((state) => state.user.token.access_token);
  const addOneToItem = useStoreActions((actions) => actions.cart.addOneToItem);
  const subOneToItem = useStoreActions((actions) => actions.cart.subOneToItem);
  const setQuantityToItem = useStoreActions(
    (actions) => actions.cart.setQuantityToItem
  );
  const removeCartItem = useStoreActions(
    (actions) => actions.cart.removeCartItem
  );
  const clearCartItems = useStoreActions(
    (actions) => actions.cart.clearCartItems
  );
  const { data, isLoading, isFetching } = useQuery('cart-items', () =>
    getCartProducts(cartItems)
  );
  const handleRemoveCartItem = useMutation((codigo) => removeCartItem(codigo), {
    onSuccess: () => {
      focusManager.setFocused(true);
      queryClient.invalidateQueries('cart-items').then(() => {
        focusManager.setFocused(false);
        message.success('Se ha eliminado el producto correctamente');
      });
    },
    onError: () => {
      message.error('Lo sentimos, ha ocurrido un error');
    },
  });
  const handleClearCartItems = useMutation(() => clearCartItems(), {
    onSuccess: () => {
      focusManager.setFocused(true);
      queryClient.invalidateQueries('cart-items').then(() => {
        focusManager.setFocused(false);
        message.success('Se ha vaciado la lista de compra correctamente');
      });
    },
    onError: () => {
      message.error('Lo sentimos, ha ocurrido un error');
    },
  });
  const [loading, setLoading] = useState(false);
  const [tipoDeEntrega, setTipoDeEntrega] = useState(0);
  const [envio, setEnvio] = useState(0);
  const [metodoDePago, setMetodoDePago] = useState(0);
  const [formaDePago, setFormaDePago] = useState(0);

  let cartItemsData = undefined;
  cartItemsData = data?.data?.data.map((cartItemData) => {
    const cartItemId = cartItems.findIndex(
      (cartItem) => cartItemData.codigo === cartItem.id
    );
    return { ...cartItemData, cantidad: cartItems[cartItemId]?.quantity };
  });

  const handlePlaceOrder = async () => {
    const {
      cliente: { id },
    } = await getUserData(token);
    const solicitudCompra = {
      estado: 'pendiente',
      fecha_solicitud: new Date(),
      total: cartItemsData.reduce(
        (total, product) =>
          total +
          calcPrecioVariable(product, nivel) * product.cantidad -
          calcPrecioVariable(product, nivel) *
            product.cantidad *
            toPercent(product.descuento),
        0
      ),
      productos_solicitados: cartItemsData.map((cartItem) => ({
        cantidad: cartItem.cantidad,
        precio_ofrecido: calcPrecioVariable(cartItem, nivel),
        descuento_ofrecido: cartItem.descuento,
        iva: cartItem.iva,
        codigo_producto: cartItem.codigo,
      })),
      id_cliente: id,
      tipo_de_entrega: tipoDeEntrega,
      metodo_de_pago: metodoDePago,
      forma_de_pago: formaDePago,
    };
    setLoading(true);
    insertSolicitudCompra(solicitudCompra, token)
      .then(() =>
        message.success(
          'Se ha creado la solicitud de compra correctamente',
          2,
          () => {
            setLoading(false);
            history.push('/solicitudes-de-compra');
          }
        )
      )
      .catch(() => {
        message.error('Lo sentimos, ha ocurrido un error');
      });
  };

  return (
    <>
      <Heading title='Lista de compra' />
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Popconfirm
            title='¿Está seguro que quiere vaciar su lista de compra?'
            placement='topLeft'
            onConfirm={() => handleClearCartItems.mutate()}
            okText='Vaciar lista'
            okType='danger'
            cancelText='Cancelar'
          >
            <Button danger icon={<DeleteFilled />}>
              Vaciar Lista
            </Button>
          </Popconfirm>
        </Col>
        <Col xs={24}>
          <ProductsTable
            products={cartItemsData}
            loading={isLoading || isFetching}
            type='carrito'
            removeItem={handleRemoveCartItem}
            nivel={nivel}
            addOneToItem={addOneToItem}
            subOneToItem={subOneToItem}
            setQuantityToItem={setQuantityToItem}
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card size='small' title='Tipo de entrega'>
            <Space direction='vertical'>
              <div>
                <Paragraph type='secondary'>Elija una opción</Paragraph>
                <Radio.Group
                  defaultValue={tipoDeEntrega}
                  onChange={(e) => setTipoDeEntrega(e.target.value)}
                >
                  <Space direction='vertical'>
                    <Radio value={0}>
                      Recoger en una sucursal Kernel System
                    </Radio>
                    <Radio value={1}>A domicilio</Radio>
                  </Space>
                </Radio.Group>
              </div>
              {tipoDeEntrega === 1 && (
                <div>
                  <Paragraph type='secondary'>Envío</Paragraph>
                  <Radio.Group
                    defaultValue={envio}
                    onChange={(e) => setEnvio(e.target.value)}
                  >
                    <Space direction='vertical'>
                      <Radio value={0}>$100.00 (Fedex)</Radio>
                    </Space>
                  </Radio.Group>
                </div>
              )}
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card size='small' title='Método de pago'>
            <Paragraph type='secondary'>Elija una opción</Paragraph>
            <Radio.Group
              defaultValue={metodoDePago}
              onChange={(e) => setMetodoDePago(e.target.value)}
            >
              <Space direction='vertical'>
                <Radio value={0}>Pagar en sucursal</Radio>
                <Radio value={1}>Pagar en linea</Radio>
              </Space>
            </Radio.Group>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card size='small' title='Forma de pago'>
            <Paragraph type='secondary'>Elija una opción</Paragraph>
            <Radio.Group
              defaultValue={formaDePago}
              onChange={(e) => setFormaDePago(e.target.value)}
            >
              <Space direction='vertical'>
                <Radio value={0}>Pago en una exhibición</Radio>
                <Radio value={1}>Pago en parcialidades</Radio>
              </Space>
            </Radio.Group>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Summary
            products={cartItemsData}
            buttonLabel='Realizar solicitud de compra'
            buttonAction={handlePlaceOrder}
            buttonLoading={loading}
            nivel={nivel}
          />
        </Col>
      </Row>
    </>
  );
};

export default Cart;
