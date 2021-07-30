import { useStoreState } from 'easy-peasy';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = (props) => {
  const isAuth = useStoreState((state) => state.user.isAuth);
  const currentRole = useStoreState((state) => state.user.role);
  let newAllowedRoles = [];

  if (props.allowedRoles === '*') {
    newAllowedRoles = [
      'administrador',
      'cliente',
      'cuentas por cobrar',
      'encargado de almacen',
      'encargado de compras',
      'encargado de ensambles',
      'encargado de ventas',
    ];
  } else {
    newAllowedRoles = [...props.allowedRoles, 'administrador'];
  }

  const allowedRole = newAllowedRoles?.find((role) => role === currentRole);

  return isAuth && !!allowedRole ? (
    <Route {...props} />
  ) : (
    <Redirect to='/iniciar-sesion' />
  );
};
export default PrivateRoute;
