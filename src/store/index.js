import { createStore, persist } from 'easy-peasy';
import { cartModel } from './models/cartModel';
import { userModel } from './models/userModel';

export const store = createStore({
  user: persist(userModel),
  cart: persist(cartModel),
});
