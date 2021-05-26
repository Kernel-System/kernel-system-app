import { useStoreState } from 'easy-peasy';
import { Redirect, Route } from 'react-router-dom';

const GuestRoute = (props) => {
  const isAuth = useStoreState((state) => state.user.isAuth);

  return isAuth ? (
    <Redirect to='/' />
  ) : (
    <Route path={props.path} exact={props.exact} component={props.component} />
  );
};

export default GuestRoute;
