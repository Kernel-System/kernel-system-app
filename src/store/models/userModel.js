import { refreshToken } from 'api/auth/index';
import { action, computed, thunk } from 'easy-peasy';
import { isEmptyObject } from 'utils/functions';

export const userModel = {
  token: {},

  setUserToken: action((state, payload) => {
    state.token = payload;
  }),

  removeUserToken: action((state) => {
    state.token = {};
  }),

  setEmployeeId: action((state, payload) => {
    state.rfc = payload;
  }),

  removeEmployeeId: action((state) => {
    state.rfc = undefined;
  }),

  expirationDate: 0,

  setExpirationDate: action(
    (state, payload) => (state.expirationDate = new Date().getTime() + payload)
  ),

  removeExpirationDate: action((state) => {
    state.expirationDate = 0;
  }),

  role: undefined,

  setUserRole: action((state, payload) => {
    state.role = payload;
  }),

  removeUserRole: action((state) => {
    state.role = undefined;
  }),

  nivel: undefined,

  setUserNivel: action((state, payload) => {
    state.nivel = payload;
  }),

  removeUserNivel: action((state) => {
    state.nivel = undefined;
  }),

  isAuth: computed((state) =>
    state.role !== 'administrador'
      ? !isEmptyObject(state.token) &&
        state.role !== undefined &&
        state.nivel !== undefined
      : !isEmptyObject(state.token) && state.role !== undefined
  ),

  login: thunk((actions, payload) => {
    actions.setUserToken(payload);
    actions.setExpirationDate(payload.expires);
    actions.startAuthTimeout();
  }),

  logout: thunk((actions) => {
    actions.removeUserToken();
    actions.removeExpirationDate();
    actions.removeUserRole();
    actions.removeUserNivel();
    actions.removeEmployeeId();
  }),

  refreshToken: thunk((actions, _, helpers) => {
    refreshToken(helpers.getStoreState().user.token.refresh_token)
      .then(({ data: { data } }) => {
        actions.setUserToken(data);
        actions.setExpirationDate(data.expires);
        actions.startAuthTimeout();
      })
      .catch(() => {
        actions.logout();
      });
  }),

  startAuthTimeout: thunk((actions, _, helpers) => {
    setTimeout(() => {
      actions.refreshToken();
      // }, 5000);
    }, helpers.getStoreState().user.token.expires);
  }),

  checkAuthState: thunk((actions, _, helpers) => {
    if (!helpers.getStoreState().user.isAuth) {
      actions.logout();
    } else {
      if (
        helpers.getStoreState().user.expirationDate > 0 &&
        helpers.getStoreState().user.expirationDate <= new Date().getTime()
      ) {
        actions.refreshToken();
      }
      // console.log(
      //   helpers.getStoreState().user.expirationDate,
      //   new Date().getTime()
      // );
    }
  }),
};
