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
      state.cartItems[existingItemId].quantity += payload.quantity;
    } else {
      state.cartItems.push(payload);
    }
  }),

  removeCartItem: action((state, payload) => {
    state.cartItems = state.cartItems.filter(
      (cartItem) => cartItem.codigo !== payload.id
    );
  }),

  clearCartItems: action((state) => {
    state.cartItems = [];
  }),
};
