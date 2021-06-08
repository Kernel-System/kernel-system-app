import { logout } from 'api/auth';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useEffect } from 'react';
import { Redirect } from 'react-router';

const Logout = () => {
  const token = useStoreState((state) => state.user.token.refresh_token);
  const removeUserToken = useStoreActions(
    (actions) => actions.user.removeUserToken
  );

  useEffect(() => {
    if (token) {
      removeUserToken();
      logout(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Redirect to='/' />;
};

export default Logout;
