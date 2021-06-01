import ComprasList from 'components/list/ComprasList';
import ProductsTable from 'components/shared/ProductsTable';
import GuestRoute from 'components/utils/GuestRoute';
import PrivateRoute from 'components/utils/PrivateRoute';
import asyncComponent from 'hoc/asyncComponent';
import MovimientosAlmacen from 'pages/almacen/MovimientosAlmacen';
import NuevoMovimiento from 'pages/almacen/NuevoMovimiento';
import Cart from 'pages/Cart';
import Checkout from 'pages/Checkout';
import RegistrarCompra from 'pages/compras/Compras/RegistrarCompra';
import Proveedores from 'pages/compras/Proveedores';
import AñadirProveedor from 'pages/compras/Proveedores/AñadirProveedor';
import AgregarEnsambles from 'pages/ensamble/AgregarEnsambles';
import Ensambles from 'pages/ensamble/Ensambles';
import ModificarEnsambles from 'pages/ensamble/ModificarEnsamble';
import FacturarTicket from 'pages/FacturarTicket';
import Home from 'pages/Home';
import Order from 'pages/orders/Order';
import Orders from 'pages/orders/Orders';
import Product from 'pages/Product';
import Addresses from 'pages/profile/Addresses';
import ChangePassword from 'pages/profile/ChangePassword';
import NewAddress from 'pages/profile/NewAddress';
import Profile from 'pages/profile/Profile';
import Search from 'pages/Search';
import PuntoDeVenta from 'pages/ventas/PuntoDeVenta';
import { Route, Switch } from 'react-router';
import NuevaTrasferencia from './pages/almacen/NuevaTrasferencia';
import Tranferencias from './pages/almacen/Transferencias';
import Cuentas from './pages/pagos/Cuentas';
import PagoNuevo from './pages/pagos/PagoNuevo';
import Pagos from './pages/pagos/Pagos';
import AgregarProductos from './pages/productos/AgregarProductos';
import Productos from './pages/productos/Productos';

import Principal from './pages/administrador/Principal';
import Sucursal from './pages/administrador/sucursales/Sucursales';
import NuevaSucursal from './pages/administrador/sucursales/AgregarSucursal';

import Almacen from './pages/administrador/almacenes/Almacenes';
import NuevoAlmacen from './pages/administrador/almacenes/AgregarAlmacen';

import Empleado from './pages/administrador/empleados/Empleados';
import NuevoEmpleado from './pages/administrador/empleados/AgregarEmpleado';

import Cliente from './pages/administrador/clientes/Clientes';
import NuevoCliente from './pages/administrador/clientes/AgregarCliente';

const asyncLogin = asyncComponent(() => import('pages/auth/Login'));

const asyncLogout = asyncComponent(() => import('pages/auth/Logout'));

const asyncRecoverAccount = asyncComponent(() =>
  import('pages/auth/RecoverAccount')
);

const asyncResetPassword = asyncComponent(() =>
  import('pages/auth/ResetPassword')
);

const asyncNotFound = asyncComponent(() => import('pages/NotFound'));

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
      <GuestRoute path='/iniciar-sesion' exact component={asyncLogin} />
      <GuestRoute
        path='/recuperar-cuenta'
        exact
        component={asyncRecoverAccount}
      />
      <GuestRoute
        path='/restablecer-contrasena'
        exact
        component={asyncResetPassword}
      />
      <PrivateRoute path='/cerrar-sesion' exact component={asyncLogout} />

      {/* Addresses */}
      <PrivateRoute path='/direcciones' exact component={Addresses} />
      <PrivateRoute path='/direcciones/:id' exact component={NewAddress} />
      <PrivateRoute path='/direcciones/nueva' exact component={NewAddress} />

      {/* Profile */}
      <PrivateRoute path='/perfil' exact component={Profile} />
      <PrivateRoute
        path='/perfil/cambiar-contrasena'
        exact
        component={ChangePassword}
      />

      {/* Search Product */}
      <Route path='/b/:query' exact component={Search} />
      <Route path='/c/:query' exact component={Search} />
      <Route path='/producto/:id' exact component={Product} />

      {/* Cart */}
      <PrivateRoute path='/lista-de-compra' exact component={Cart} />

      {/* Checkout */}
      <PrivateRoute path='/checkout' exact component={Checkout} />

      {/* Orders */}
      <PrivateRoute path='/pedidos' exact component={Orders} />
      <PrivateRoute path='/pedidos/:id' exact component={Order} />

      {/* Punto de venta */}
      <PrivateRoute path='/venta' exact component={PuntoDeVenta} />

      {/* Proveedores */}
      <Route path='/proveedores' exact>
        <Proveedores />
      </Route>
      <Route path='/proveedores/nuevo' exact component={AñadirProveedor} />

      {/* Compras */}
      <Route path='/compras' exact>
        <ComprasList />
      </Route>
      <Route path='/compras/registrar' exact component={RegistrarCompra} />

      {/* Ensambles */}
      <Route path='/ensambles' exact component={Ensambles} />
      <Route path='/ensambles/nuevo' exact component={AgregarEnsambles} />
      <Route path='/ensambles/:id' exact component={ModificarEnsambles} />

      {/* Facturar ticket */}
      <Route path='/facturar_ticket' exact component={FacturarTicket} />

      {/* Movimientos de almacen */}
      <Route path='/movimiento_almacen' exact component={MovimientosAlmacen} />
      <Route
        path='/movimiento_almacen/nuevo'
        exact
        component={NuevoMovimiento}
      />

      {/* Transferencias */}
      <Route path='/transferencia/' exact component={Tranferencias} />
      <Route path='/transferencia/nuevo' exact>
        {<NuevaTrasferencia tipo={'agregar'} />}
      </Route>
      <Route path='/transferencia/mostrar/:id' exact>
        {<NuevaTrasferencia tipo={'mostrar'} />}
      </Route>
      <Route path='/transferencia/editar/:id' exact>
        {<NuevaTrasferencia tipo={'editar'} />}
      </Route>

      {/* Pagos */}
      <Route path='/cuentas/' exact component={Cuentas} />
      <Route path='/cuentas/pagos/nuevo' exact component={PagoNuevo} />
      <Route path='/cuentas/pagos/:id' exact component={Pagos} />

      {/* Productos */}
      <Route path='/productos/' exact component={Productos} />
      <Route path='/productos/nuevo' exact>
        {<AgregarProductos tipo={'agregar'} />}
      </Route>
      <Route path='/productos/editar/:codigo' exact>
        {<AgregarProductos tipo={'editar'} />}
      </Route>
      <Route path='/productos/mostrar/:codigo' exact>
        {<AgregarProductos tipo={'mostrar'} />}
      </Route>

      {/* Administrador */}
      <Route path='/admid/' exact component={Principal} />

      <Route path='/admid/sucursal' exact component={Sucursal} />
      <Route path='/admid/sucursal/nuevo' exact component={NuevaSucursal} />
      <Route path='/admid/sucursal/:clave' exact component={NuevaSucursal} />

      <Route path='/admid/almacen' exact component={Almacen} />
      <Route path='/admid/almacen/nuevo' exact component={NuevoAlmacen} />
      <Route path='/admid/almacen/:clave' exact component={NuevoAlmacen} />

      <Route path='/admid/empleado' exact component={Empleado} />
      <Route path='/admid/empleado/nuevo' exact component={NuevoEmpleado} />
      <Route path='/admid/empleado/:rfc' exact component={NuevoEmpleado} />

      <Route path='/admid/cliente' exact component={Cliente} />
      <Route path='/admid/cliente/nuevo' exact component={NuevoCliente} />
      <Route path='/admid/cliente/:id' exact component={NuevoCliente} />

      {/* Test */}
      <Route path='/test' exact component={ProductsTable} />

      {/* Not Found */}
      <Route component={asyncNotFound} />
    </Switch>
  );
};

export default Rutas;
