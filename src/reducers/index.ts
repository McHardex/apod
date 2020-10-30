import { combineReducers } from 'redux';
import { userReducer } from './module/user';
import { productsReducer } from './module/product';

export const rootReducer = combineReducers({
  user: userReducer,
  products: productsReducer
});

export type RootState = ReturnType<typeof rootReducer>;
