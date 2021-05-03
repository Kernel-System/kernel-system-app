import { Route, Switch } from 'react-router';
import asyncComponent from './hoc/asyncComponent';
import Home from './pages/Home';
import Login from './pages/Login';
import Ensambles from './pages/ensamble/Ensambles';
import AgregarEnsambles from './pages/ensamble/AgregarEnsambles';

import './App.css';
import Layout from './pages/Layout';

//import Summary from './components/table/Summary';

const asyncForgotPassword = asyncComponent(() =>
  import('./pages/ForgotPassword')
);

const App = () => {
  const listaProductos = [
    [
      {
        idComponenteEnsamble: '1',
        codigo: '1',
        descripcion: 'Tarjeta Madre 1',
        nota: '',
        cantidad: 1,
        series: { idSerieComponente: '1', serie: '00001' },
      },
    ],
    [
      {
        idComponenteEnsamble: '2',
        codigo: '2',
        descripcion: 'Disco Duro 1',
        nota: '',
        cantidad: 1,
        series: { idSerieComponente: '2', serie: '00002' },
      },
    ],
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
        <Route path='/ensambles' exact component={Ensambles}></Route>
        <Route
          path='/ensambles/nuevo'
          exact
          component={AgregarEnsambles}
        ></Route>
        <Route path='/ensambles/:id' exact component={AgregarEnsambles}></Route>
        <Route path='/ejemplo' exact></Route>
      </Switch>
    </Layout>
  );
};

export default App;
