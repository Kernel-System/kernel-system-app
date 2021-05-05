import { Route, Switch } from 'react-router';
import asyncComponent from 'hoc/asyncComponent';
import Login from 'pages/auth/Login';
import Cart from 'pages/Cart';
import Checkout from 'pages/Checkout';
import AñadirProveedor from 'pages/compras/Proveedores/AñadirProveedor';
import Home from 'pages/Home';
import NotFound from 'pages/NotFound';
import Orders from 'pages/Orders';
import Product from 'pages/Product';
import Addresses from 'pages/profile/Addresses';
import ChangePassword from 'pages/profile/ChangePassword';
import NewAddress from 'pages/profile/NewAddress';
import Profile from 'pages/profile/Profile';
import Search from 'pages/Search';
import RegistrarCompra from 'pages/compras/Compras/RegistrarCompra';
import ProveedorList from './components/list/ProveedorList';
import AgregarEnsambles from './pages/ensamble/AgregarEnsambles';
import Ensambles from './pages/ensamble/Ensambles';
import ModificarEnsambles from './pages/ensamble/ModificarEnsamble';
import FacturarTicket from './pages/FacturarTicket';

const asyncForgotPassword = asyncComponent(() =>
  import('pages/auth/ForgotPassword')
);

const listaProveedores = [
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

const Rutas = () => {
  return (
    <Switch>
      {/* Home */}
      <Route path='/' exact component={Home} />

      {/* Auth */}
      <Route path='/iniciar-sesion' exact component={Login} />
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

      <Route path='/registrar-compra' exact component={RegistrarCompra} />
      <Route path='/proveedores' exact>
        <ProveedorList list={listaProveedores} />
      </Route>
      <Route path='/añadir-proveedor' exact component={AñadirProveedor} />

      {/* Search Product */}
      <Route path='/b/:query' exact component={Search} />
      <Route path='/c/:query' exact component={Search} />
      <Route path='/p/:id' exact component={Product} />

      {/* Cart */}
      <Route path='/lista-de-compra' exact component={Cart} />

      {/* Checkout */}
      <Route path='/checkout' exact component={Checkout} />

      {/* Orders */}
      <Route path='/mis-pedidos' exact component={Orders} />

      {/* Ensambles */}
      <Route path='/ensambles' exact component={Ensambles} />
      <Route path='/ensambles/nuevo' exact component={AgregarEnsambles} />
      <Route path='/ensambles/:id' exact component={ModificarEnsambles} />

      {/* Facturar ticket */}
      <Route path='/facturar_ticket' exact component={FacturarTicket} />

      {/* Not Found */}
      <Route component={NotFound} />
    </Switch>
  );
};

export default Rutas;
