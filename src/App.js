import 'App.css';
import asyncComponent from 'hoc/asyncComponent';
import Login from 'pages/auth/Login';
import Cart from 'pages/Cart';
import Checkout from 'pages/Checkout';
import AñadirProveedor from 'pages/compras/Proveedores/AñadirProveedor';
import Home from 'pages/Home';
import Layout from 'pages/Layout';
import NotFound from 'pages/NotFound';
import Order from 'pages/orders/Order';
import Orders from 'pages/orders/Orders';
import Product from 'pages/Product';
import Addresses from 'pages/profile/Addresses';
import ChangePassword from 'pages/profile/ChangePassword';
import NewAddress from 'pages/profile/NewAddress';
import Profile from 'pages/profile/Profile';
import PuntoDeVenta from 'pages/PuntoDeVenta';
import Search from 'pages/Search';
import { Route, Switch } from 'react-router';
import './App.css';
import ProveedorList from './components/list/ProveedorList';
import AgregarEnsambles from './pages/ensamble/AgregarEnsambles';
import Ensambles from './pages/ensamble/Ensambles';
import ModificarEnsambles from './pages/ensamble/ModificarEnsamble';
import FacturarTicket from './pages/FacturarTicket';

const asyncForgotPassword = asyncComponent(() =>
  import('pages/auth/ForgotPassword')
);

const App = () => {
  const lista = [
    {
      rfc: 'ARR-860120',
      nombre: 'LA @ S.A. DE C.V',
      razon_social: 'soy una razon 1',
    },
    {
      rfc: 'APO-830120',
      nombre: 'LA @ DEL % SA DE CV',
      razon_social: 'soy una razon 2',
    },
    {
      rfc: 'ACO-800210',
      nombre: '@ COMER.COM',
      razon_social: 'soy una razon 3',
    },
  ];
  return (
    <Layout>
      <Switch>
        {/* Home */}
        <Route path='/' exact component={Home} />

        {/* Auth */}
        <Route path='/iniciar-sesion' exact component={Login} />
        <Route path='/añadir-proveedor' exact component={AñadirProveedor} />
        <Route
          path='/recuperar-contrasena'
          exact
          component={asyncForgotPassword}
        />

        {/* Addresses */}
        <Route path='/direcciones' exact component={Addresses} />
        <Route path='/direcciones/nueva' exact component={NewAddress} />

        {/* Profile */}
        <Route path='/u/:id' exact component={Profile} />
        <Route
          path='/u/:id/cambiar-contrasena'
          exact
          component={ChangePassword}
        />

        {/* Search Product */}
        <Route path='/b/:query' exact component={Search} />
        <Route path='/c/:query' exact component={Search} />
        <Route path='/producto/:id' exact component={Product} />

        {/* Cart */}
        <Route path='/lista-de-compra' exact component={Cart} />

        {/* Checkout */}
        <Route path='/checkout' exact component={Checkout} />

        {/* Orders */}
        <Route path='/mis-pedidos' exact component={Orders} />
        <Route path='/pedido/:id' exact component={Order} />

        {/* Proveedores */}
        <Route path='/proveedores' exact>
          <ProveedorList list={lista} />
        </Route>

        {/* Ensambles */}
        <Route path='/ensambles' exact component={Ensambles} />
        <Route path='/ensambles/nuevo' exact component={AgregarEnsambles} />
        <Route path='/ensambles/:id' exact component={ModificarEnsambles} />

        {/* Facturar ticket */}
        <Route path='/facturar_ticket' exact component={FacturarTicket} />

        {/* Punto de venta */}
        <Route path='/venta' exact component={PuntoDeVenta} />
        <Route path='/venta/nueva' exact component={PuntoDeVenta} />

        {/* Not Found */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
};

export default App;
