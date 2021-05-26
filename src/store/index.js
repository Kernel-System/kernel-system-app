import { createStore, persist } from 'easy-peasy';
import { userModel } from './models/userModel';

export const store = createStore({
  user: persist(userModel),
});
