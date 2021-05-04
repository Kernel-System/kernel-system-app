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

//import Summary from './components/table/Summary';

const asyncForgotPassword = asyncComponent(() =>
  import('./pages/ForgotPassword')
);

const App = () => {
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
