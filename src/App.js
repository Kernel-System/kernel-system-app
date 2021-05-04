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
import ProveedorList from './components/list/ProveedorList';

//import Summary from './components/table/Summary';

const asyncForgotPassword = asyncComponent(() =>
  import('./pages/ForgotPassword')
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
        <Route path='/' exact component={Home} />
        <Route path='/iniciar-sesion' exact component={Login} />
        <Route path='/añadir-proveedor' exact component={AñadirProveedor} />
        <Route
          path='/recuperar-contrasena'
          exact
          component={asyncForgotPassword}
        />
        <Route path='/proveedores' exact>
          <ProveedorList list={lista} />
        </Route>
      </Switch>
    </Layout>
  );
};

export default App;
