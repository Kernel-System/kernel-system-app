import 'App.css';
import asyncComponent from 'hoc/asyncComponent';
import Login from 'pages/auth/Login';
import Home from 'pages/Home';
import Layout from 'pages/Layout';
import NotFound from 'pages/NotFound';
import Product from 'pages/Product';
import Profile from 'pages/profile/Profile';
import ChangePassword from 'pages/profile/ChangePassword';
import Search from 'pages/Search';
import { Route, Switch } from 'react-router';
import Addresses from 'pages/profile/Addresses';
import NewAddress from 'pages/profile/NewAddress';
import Cart from 'pages/Cart';
import Checkout from 'pages/Checkout';
import Orders from 'pages/Orders';
//import Table from "./components/table/GenericTable";
// import List from './components/list/GenericList';

const asyncForgotPassword = asyncComponent(() =>
  import('pages/auth/ForgotPassword')
);

const App = () => {
  return (
    <Layout>
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

        {/* Not Found */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
};

export default App;
