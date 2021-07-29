import { action, computed } from 'easy-peasy';

export const cartModel = {
  cartItems: [],

  cartItemsCount: computed((state) => state.cartItems.length),

  addCartItem: action((state, payload) => {
    const existingItem = state.cartItems.find((item) => item.id === payload);

    const existingItemId = state.cartItems.findIndex(
      (item) => item.id === payload
    );

    if (existingItem) {
      state.cartItems[existingItemId].cantidad += 1;
    } else {
      state.cartItems.push({ id: payload, cantidad: 1 });
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
    state.cartItems[existingItemId].cantidad = payload.cantidad;
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
