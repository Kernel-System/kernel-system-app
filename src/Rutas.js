import { Route, Switch } from 'react-router';
import asyncComponent from './hoc/asyncComponent';

import Home from './pages/Home';
import Login from './pages/Login';

import AñadirProveedor from 'pages/compras/Proveedores/AñadirProveedor';
import ProveedorList from 'components/list/ProveedorList';
import RegistrarCompra from 'pages/compras/Compras/RegistrarCompra';

import Ensambles from './pages/ensamble/Ensambles';
import AgregarEnsambles from './pages/ensamble/AgregarEnsambles';
import ModificarEnsambles from './pages/ensamble/ModificarEnsamble';

const asyncForgotPassword = asyncComponent(() =>
  import('./pages/ForgotPassword')
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
      <Route path='/' exact component={Home} />
      <Route path='/iniciar-sesion' exact component={Login} />
      <Route
        path='/recuperar-contrasena'
        exact
        component={asyncForgotPassword}
      />

      <Route path='/añadir-proveedor' exact component={AñadirProveedor} />
      <Route path='/proveedores' exact>
        <ProveedorList list={listaProveedores} />
      </Route>
      <Route path='/registrar-compra' exact component={RegistrarCompra} />

      <Route path='/ensambles' exact component={Ensambles}></Route>
      <Route path='/ensambles/nuevo' exact component={AgregarEnsambles}></Route>
      <Route path='/ensambles/:id' exact>
        <ModificarEnsambles />
      </Route>

      <Route path='/ejemplo' exact></Route>
    </Switch>
  );
};

export default Rutas;
