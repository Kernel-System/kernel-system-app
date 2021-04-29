import { Route, Switch } from 'react-router';
import asyncComponent from './hoc/asyncComponent';
import Home from './pages/Home';
import Login from './pages/Login';

import './App.css';

const asyncForgotPassword = asyncComponent(() =>
  import('./pages/ForgotPassword')
);

const App = () => {
  return (
    <Switch>
      <Route path='/' exact component={Home} />
      <Route path='/iniciar-sesion' exact component={Login} />
      <Route
        path='/recuperar-contrasena'
        exact
        component={asyncForgotPassword}
      />
    </Switch>
  );
};

export default App;
