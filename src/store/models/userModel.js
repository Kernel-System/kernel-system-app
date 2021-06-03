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

  expirationDate: 0,

  setExpirationDate: action(
    // (state, payload) => (state.expirationDate = new Date().getTime() + 5000)
    (state, payload) => (state.expirationDate = new Date().getTime() + payload)
  ),

  removeExpirationDate: action((state) => {
    state.expirationDate = 0;
  }),

  isAuth: computed((state) => !isEmptyObject(state.token)),

  login: thunk((actions, payload) => {
    actions.setUserToken(payload);
    actions.setExpirationDate(payload.expires);
    actions.startAuthTimeout();
  }),

  logout: thunk((actions) => {
    actions.removeUserToken();
    actions.removeExpirationDate();
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
