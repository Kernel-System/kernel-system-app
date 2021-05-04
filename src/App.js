import { Route, Switch } from 'react-router';
import asyncComponent from './hoc/asyncComponent';
import Home from './pages/Home';
import Login from './pages/Login';
import AñadirProveedor from 'pages/compras/Proveedores/AñadirProveedor';
import Ensambles from './pages/ensamble/Ensambles';
import AgregarEnsambles from './pages/ensamble/AgregarEnsambles';
import ModificarEnsambles from './pages/ensamble/ModificarEnsamble';

import './App.css';
import Layout from './pages/Layout';
import ProveedorList from './components/list/ProveedorList';

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
        <Route path='/ensambles' exact component={Ensambles}></Route>
        <Route
          path='/ensambles/nuevo'
          exact
          component={AgregarEnsambles}
        ></Route>
        <Route path='/ensambles/:id' exact>
          <ModificarEnsambles />
        </Route>
        <Route path='/ejemplo' exact></Route>
      </Switch>
    </Layout>
  );
};

export default App;
