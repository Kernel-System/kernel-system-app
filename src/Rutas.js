import { Route, Switch } from 'react-router';
import ProductsTable from 'components/shared/ProductsTable';
import GuestRoute from 'components/utils/GuestRoute';
import PrivateRoute from 'components/utils/PrivateRoute';
import asyncComponent from 'hoc/asyncComponent';
import MovimientosAlmacen from 'pages/almacen/MovimientosAlmacen';
import NuevoMovimiento from 'pages/almacen/NuevoMovimiento';
import Cart from 'pages/Cart';
import Checkout from 'pages/Checkout';
import Compras from 'pages/compras/Compras';
import RegistrarCompra from 'pages/compras/Compras/RegistrarCompra';
import Proveedores from 'pages/compras/Proveedores';
import AñadirProveedor from 'pages/compras/Proveedores/AñadirProveedor';
import EmpleadoProfile from 'pages/empleado/EmpleadoProfile';
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

import FacturasExternas from 'pages/facturas/FacturasExternas';
import FacturasInternas from 'pages/facturas/FacturasInternas';

import NuevoAlmacen from './pages/administrador/almacenes/AgregarAlmacen';
import Almacen from './pages/administrador/almacenes/Almacenes';
import NuevoCliente from './pages/administrador/clientes/AgregarCliente';
import Cliente from './pages/administrador/clientes/Clientes';
import NuevoEmpleado from './pages/administrador/empleados/AgregarEmpleado';
import Empleado from './pages/administrador/empleados/Empleados';
import NuevaSucursal from './pages/administrador/sucursales/AgregarSucursal';
import Sucursal from './pages/administrador/sucursales/Sucursales';
import NuevaTrasferencia from './pages/almacen/NuevaTrasferencia';
import Tranferencias from './pages/almacen/Transferencias';
import Cuentas from './pages/pagos/Cuentas';
import PagoNuevo from './pages/pagos/PagoNuevo';
import Pagos from './pages/pagos/Pagos';
import AgregarProductos from './pages/productos/AgregarProductos';
import Productos from './pages/productos/Productos';
import AgregarCotizacionClientes from './pages/cotizacion_clientes/CrearCotizacion';
import CotizacionClientes from './pages/cotizacion_clientes/Cotizaciones';

const asyncLogin = asyncComponent(() => import('pages/auth/Login'));

const asyncLogout = asyncComponent(() => import('pages/auth/Logout'));

const asyncRecoverAccount = asyncComponent(() =>
  import('pages/auth/RecoverAccount')
);

const asyncResetPassword = asyncComponent(() =>
  import('pages/auth/ResetPassword')
);

const asyncNotFound = asyncComponent(() => import('pages/NotFound'));

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
      <PrivateRoute
        allowedRoles='*'
        path='/cerrar-sesion'
        exact
        component={asyncLogout}
      />

      {/* Addresses */}
      <PrivateRoute
        allowedRoles={['cliente']}
        path='/direcciones'
        exact
        component={Addresses}
      />
      <PrivateRoute
        allowedRoles={['cliente']}
        path='/direcciones/:id'
        exact
        component={NewAddress}
      />
      <PrivateRoute
        allowedRoles={['cliente']}
        path='/direcciones/nueva'
        exact
        component={NewAddress}
      />

      {/* Profile */}
      <PrivateRoute
        allowedRoles={['cliente']}
        path='/perfil'
        exact
        component={Profile}
      />
      <PrivateRoute
        allowedRoles={['cliente']}
        path='/perfil/cambiar-contrasena'
        exact
        component={ChangePassword}
      />

      {/* Search Product */}
      <Route path='/b/:query' exact component={Search} />
      <Route path='/c/:query' exact component={Search} />
      <Route path='/producto/:id' exact component={Product} />

      {/* Cart */}
      <PrivateRoute
        allowedRoles={['cliente']}
        path='/lista-de-compra'
        exact
        component={Cart}
      />

      {/* Checkout */}
      <PrivateRoute
        allowedRoles={['cliente']}
        path='/checkout'
        exact
        component={Checkout}
      />

      {/* Orders */}
      <PrivateRoute
        allowedRoles={['cliente']}
        path='/solicitudes-de-compra'
        exact
        component={Orders}
      />
      <PrivateRoute
        allowedRoles={['cliente']}
        path='/solicitudes-de-compra/:id'
        exact
        component={Order}
      />

      {/* Empleados */}
      <PrivateRoute
        allowedRoles={[
          'cuentas por cobrar',
          'encargado de almacen',
          'encargado de compras',
          'encargado de ensamble',
          'encargado de ventas',
        ]}
        path='/empleado/perfil'
        exact
        component={EmpleadoProfile}
      />

      {/* Punto de venta */}
      <PrivateRoute
        allowedRoles={['encargado de ventas']}
        path='/venta'
        exact
        component={PuntoDeVenta}
      />

      {/* Cotizacion a clientes */}

      <PrivateRoute
        allowedRoles={['encargado de ventas']}
        path='/cotizacion-cliente'
        exact
        component={CotizacionClientes}
      />
      <PrivateRoute
        allowedRoles={['encargado de ventas']}
        path='/cotizacion-cliente/nuevo'
        exact
        component={AgregarCotizacionClientes}
      />

      {/* Proveedores */}
      <PrivateRoute
        allowedRoles={['encargado de compras']}
        path='/proveedores'
        exact
      >
        <Proveedores />
      </PrivateRoute>
      <PrivateRoute
        allowedRoles={['encargado de compras']}
        path='/proveedores/nuevo'
        exact
        component={AñadirProveedor}
      />

      {/* Facturas Externas */}
      <PrivateRoute
        allowedRoles={['encargado de compras']}
        path='/facturas-externas'
        exact
      >
        <FacturasExternas />
      </PrivateRoute>

      {/* Facturas Internas */}
      <PrivateRoute
        allowedRoles={['encargado de ventas']}
        path='/facturas-internas'
        exact
      >
        <FacturasInternas />
      </PrivateRoute>
      {/* Compras */}
      <PrivateRoute
        allowedRoles={['encargado de compras']}
        path='/compras'
        exact
      >
        <Compras />
      </PrivateRoute>
      <PrivateRoute
        allowedRoles={['encargado de compras']}
        path='/compras/registrar'
        exact
        component={RegistrarCompra}
      />

      {/* Ensambles */}
      <PrivateRoute
        allowedRoles={[
          'encargado de ensamble',
          'encargado de ventas',
          'encargado de almacen',
        ]}
        path='/ensambles'
        exact
        component={Ensambles}
      />
      <PrivateRoute
        allowedRoles={[
          'encargado de ensamble',
          'encargado de ventas',
          'encargado de almacen',
        ]}
        path='/ensambles/nuevo'
        exact
        component={AgregarEnsambles}
      />
      <PrivateRoute
        allowedRoles={[
          'encargado de ensamble',
          'encargado de ventas',
          'encargado de almacen',
        ]}
        path='/ensambles/:id'
        exact
        component={ModificarEnsambles}
      />

      {/* Facturar ticket */}
      <PrivateRoute
        allowedRoles='*'
        path='/facturar-ticket'
        exact
        component={FacturarTicket}
      />

      {/* Movimientos de almacen */}
      <PrivateRoute
        allowedRoles={['encargado de almacen']}
        path='/movimientos'
        exact
        component={MovimientosAlmacen}
      />
      <PrivateRoute
        allowedRoles={['encargado de almacen']}
        path='/movimientos/nuevo'
        exact
        component={NuevoMovimiento}
      />

      {/* Transferencias */}
      <PrivateRoute
        allowedRoles={['encargado de almacen']}
        path='/transferencia'
        exact
        component={Tranferencias}
      />
      <PrivateRoute
        allowedRoles={['encargado de almacen']}
        path='/transferencia/nuevo'
        exact
      >
        {<NuevaTrasferencia tipo={'agregar'} />}
      </PrivateRoute>
      <PrivateRoute
        allowedRoles={['encargado de almacen']}
        path='/transferencia/mostrar/:id'
        exact
      >
        {<NuevaTrasferencia tipo={'mostrar'} />}
      </PrivateRoute>
      <PrivateRoute
        allowedRoles={['encargado de almacen']}
        path='/transferencia/editar/:id'
        exact
      >
        {<NuevaTrasferencia tipo={'editar'} />}
      </PrivateRoute>

      {/* Pagos */}
      <PrivateRoute
        allowedRoles={['cuentas por cobrar']}
        path='/cuentas'
        exact
        component={Cuentas}
      />
      <PrivateRoute
        allowedRoles={['cuentas por cobrar']}
        path='/cuentas/pagos/nuevo'
        exact
        component={PagoNuevo}
      />
      <PrivateRoute
        allowedRoles={['cuentas por cobrar']}
        path='/cuentas/pagos_int/:id_fac/'
        exact
      >
        {<Pagos tipo={'facturas_internas'} />}
      </PrivateRoute>
      <PrivateRoute
        allowedRoles={['cuentas por cobrar']}
        path='/cuentas/pagos_ext/:id_fac/'
        exact
      >
        {<Pagos tipo={'facturas_externas'} />}
      </PrivateRoute>

      {/* Productos */}
      <PrivateRoute
        allowedRoles={['encargado de compras', 'encargado de ventas']}
        path='/productos'
        exact
        component={Productos}
      />
      <PrivateRoute
        allowedRoles={['encargado de compras', 'encargado de ventas']}
        path='/productos/nuevo'
        exact
      >
        {<AgregarProductos tipo={'agregar'} />}
      </PrivateRoute>
      <PrivateRoute
        allowedRoles={['encargado de compras', 'encargado de ventas']}
        path='/productos/editar/:codigo'
        exact
      >
        {<AgregarProductos tipo={'editar'} />}
      </PrivateRoute>
      <PrivateRoute
        allowedRoles={['encargado de compras', 'encargado de ventas']}
        path='/productos/mostrar/:codigo'
        exact
      >
        {<AgregarProductos tipo={'mostrar'} />}
      </PrivateRoute>

      {/* Administrador */}

      <PrivateRoute
        allowedRoles={['administrador']}
        path='/admin/sucursal'
        exact
        component={Sucursal}
      />
      <PrivateRoute
        allowedRoles={['administrador']}
        path='/admin/sucursal/nuevo'
        exact
        component={NuevaSucursal}
      />
      <PrivateRoute
        allowedRoles={['administrador']}
        path='/admin/sucursal/:clave'
        exact
        component={NuevaSucursal}
      />

      <PrivateRoute
        allowedRoles={['administrador']}
        path='/admin/almacen'
        exact
        component={Almacen}
      />
      <PrivateRoute
        allowedRoles={['administrador']}
        path='/admin/almacen/nuevo'
        exact
        component={NuevoAlmacen}
      />
      <PrivateRoute
        allowedRoles={['administrador']}
        path='/admin/almacen/:clave'
        exact
        component={NuevoAlmacen}
      />

      <PrivateRoute
        allowedRoles={['administrador']}
        path='/admin/empleado'
        exact
        component={Empleado}
      />
      <PrivateRoute
        allowedRoles={['administrador']}
        path='/admin/empleado/nuevo'
        exact
        component={NuevoEmpleado}
      />
      <PrivateRoute
        allowedRoles={['administrador']}
        path='/admin/empleado/:rfc'
        exact
        component={NuevoEmpleado}
      />

      <PrivateRoute
        allowedRoles={['administrador']}
        path='/admin/cliente'
        exact
        component={Cliente}
      />
      <PrivateRoute
        allowedRoles={['administrador']}
        path='/admin/cliente/nuevo'
        exact
        component={NuevoCliente}
      />
      <PrivateRoute
        allowedRoles={['administrador']}
        path='/admin/cliente/:id'
        exact
        component={NuevoCliente}
      />

      {/* Test */}
      <Route path='/test' exact component={ProductsTable} />

      {/* Not Found */}
      <Route component={asyncNotFound} />
    </Switch>
  );
};

export default Rutas;
