import { Route, Switch } from 'react-router';
import asyncComponent from './hoc/asyncComponent';
import Home from './pages/Home';
import Login from './pages/Login';
import AñadirProveedor from 'pages/compras/Proveedores/AñadirProveedor';

import './App.css';
import Layout from './pages/Layout';
//import Table from "./components/table/GenericTable";
//import List from './components/list/GenericList';
//import List from './components/list/PedidoList';
import List from './components/list/ProveedorList';

//import Summary from './components/table/Summary';

const asyncForgotPassword = asyncComponent(() =>
  import('./pages/ForgotPassword')
);

const App = () => {
  const lista = [
    {
      rfc: 'EJEMPLO RFC1',
      nombre: 'Proveedor chiludo 1',
      razon: 'soy una razon 1',
    },
    {
      rfc: 'EJEMPLO RFC2',
      nombre: 'Proveedor chiludo 2',
      razon: 'soy una razon 2',
    },
  ];
  return (
    <Layout>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/iniciar-sesion' exact component={Login} />
        <Route path='/añadir-proveedor' exact component={AñadirProveedor} />
        <Route
          path='/recuperar-contrasena'
          exact
          component={asyncForgotPassword}
        />
        <Route path='/ejemplo' exact>
          <List list={lista} />
        </Route>
      </Switch>
    </Layout>
  );
};

export default App;
