import asyncComponent from 'hoc/asyncComponent';
import MovimientosAlmacen from 'pages/almacen/MovimientosAlmacen';
import NuevoMovimiento from 'pages/almacen/NuevoMovimiento';
import Login from 'pages/auth/Login';
import Cart from 'pages/Cart';
import Checkout from 'pages/Checkout';
import RegistrarCompra from 'pages/compras/Compras/RegistrarCompra';
import AñadirProveedor from 'pages/compras/Proveedores/AñadirProveedor';
import AgregarEnsambles from 'pages/ensamble/AgregarEnsambles';
import Ensambles from 'pages/ensamble/Ensambles';
import ModificarEnsambles from 'pages/ensamble/ModificarEnsamble';
import FacturarTicket from 'pages/FacturarTicket';
import Home from 'pages/Home';
import NotFound from 'pages/NotFound';
import Order from 'pages/orders/Order';
import Orders from 'pages/orders/Orders';
import Product from 'pages/Product';
import Addresses from 'pages/profile/Addresses';
import ChangePassword from 'pages/profile/ChangePassword';
import NewAddress from 'pages/profile/NewAddress';
import Profile from 'pages/profile/Profile';
import Search from 'pages/Search';
import Proveedores from 'pages/compras/Proveedores';
import ComprasList from 'components/list/ComprasList';
import PuntoDeVenta from 'pages/ventas/PuntoDeVenta';
import Venta from 'pages/ventas/Venta';
import { Route, Switch } from 'react-router';

import Tranferencias from './pages/almacen/Transferencias';
import NuevaTrasferencia from './pages/almacen/NuevaTrasferencia';
import Cuentas from './pages/pagos/Cuentas';
import Pagos from './pages/pagos/Pagos';
import PagoNuevo from './pages/pagos/PagoNuevo';

import Productos from './pages/productos/Productos';
import AgregarProductos from './pages/productos/AgregarProductos';

const asyncForgotPassword = asyncComponent(() =>
  import('pages/auth/ForgotPassword')
);

const Rutas = () => {
  return (
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
      <Route path='/perfil' exact component={Profile} />
      <Route
        path='/perfil/cambiar-contrasena'
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
      <Route path='/pedidos' exact component={Orders} />
      <Route path='/pedidos/:id' exact component={Order} />

      {/* Punto de venta */}
      <Route path='/venta' exact component={PuntoDeVenta} />
      <Route path='/venta/nueva' exact component={Venta} />

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
      <Route path='/almacen' exact component={MovimientosAlmacen} />
      <Route path='/almacen/nuevo' exact component={NuevoMovimiento} />

      <Route path='/transferencia/' exact component={Tranferencias} />
      <Route path='/transferencia/nuevo' exact component={NuevaTrasferencia} />
      <Route path='/transferencia/:id' exact component={NuevaTrasferencia} />

      {/* pagos */}
      <Route path='/cuentas/' exact component={Cuentas} />
      <Route path='/cuentas/pagos/nuevo' exact component={PagoNuevo} />
      <Route path='/cuentas/pagos/:id' exact component={Pagos} />

      {/* productos */}
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

      {/* Not Found */}
      <Route component={NotFound} />
    </Switch>
  );
};

export default Rutas;
