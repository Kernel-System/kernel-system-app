import { useStoreState } from 'easy-peasy';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = (props) => {
  const isAuth = useStoreState((state) => state.user.isAuth);

  return isAuth ? (
    <Route path={props.path} exact={props.exact} component={props.component} />
  ) : (
    <Redirect to='/iniciar-sesion' />
  );
};
export default PrivateRoute;
