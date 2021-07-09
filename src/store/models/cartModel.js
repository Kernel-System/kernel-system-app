import { action, computed } from 'easy-peasy';

export const cartModel = {
  cartItems: [],

  cartItemsCount: computed((state) => state.cartItems.length),

  addCartItem: action((state, payload) => {
    const existingItem = state.cartItems.find((item) => item.id === payload.id);

    const existingItemId = state.cartItems.findIndex(
      (item) => item.id === payload.id
    );

    if (existingItem) {
      state.cartItems[existingItemId].cantidad += payload.cantidad;
    } else {
      state.cartItems.push(payload);
    }
  }),

  addOneToItem: action((state, payload) => {
    const existingItemId = state.cartItems.findIndex(
      (item) => item.id === payload
    );
    state.cartItems[existingItemId].cantidad += 1;
  }),

  subOneToItem: action((state, payload) => {
    const existingItemId = state.cartItems.findIndex(
      (item) => item.id === payload
    );
    state.cartItems[existingItemId].cantidad -= 1;
  }),

  setQuantityToItem: action((state, payload) => {
    const existingItemId = state.cartItems.findIndex(
      (item) => item.id === payload.id
    );
    state.cartItems[existingItemId].cantidad = parseInt(payload.cantidad);
  }),

  removeCartItem: action((state, payload) => {
    state.cartItems = state.cartItems.filter(
      (cartItem) => cartItem.id !== payload
    );
  }),

  clearCartItems: action((state) => {
    state.cartItems = [];
  }),
};
