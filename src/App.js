import { Route, Switch } from 'react-router';
import asyncComponent from './hoc/asyncComponent';
import Home from './pages/Home';
import Login from './pages/Login';

import './App.css';
import Layout from './pages/Layout';
//import Table from "./components/table/GenericTable";
import List from './components/list/GenericList';
//import List from './components/list/PedidoList';
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
        <Route
          path='/recuperar-contrasena'
          exact
          component={asyncForgotPassword}
        />
      </Switch>
    </Layout>
  );
};

export default App;
