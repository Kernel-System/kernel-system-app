import { Route, Switch } from 'react-router';
import asyncComponent from './hoc/asyncComponent';
import Home from './pages/Home';
import Login from './pages/Login';

import './App.css';
import Layout from './pages/Layout';
//import Table from "./components/table/GenericTable";
import List from './components/list/EnsambleList';

//import Summary from './components/table/Summary';

const asyncForgotPassword = asyncComponent(() =>
  import('./pages/ForgotPassword')
);

const App = () => {
  const lista = [
    {
      folio: 'EJEMPLO FOLIO1',
      fechaorden: '01/01/2020',
      descripcion: 'Para el ingeniero chiludo 1',
      estado: 'Creado',
    },
    {
      folio: 'EJEMPLO FOLIO2',
      fechaorden: '02/01/2020',
      descripcion: 'Para el cliente chiludo 2',
      estado: 'En ensamble',
    },
  ];
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
        <Route path='/ejemplo' exact>
          <List list={lista} />
        </Route>
      </Switch>
    </Layout>
  );
};

export default App;
