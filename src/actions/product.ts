import { Dispatch, AnyAction } from 'redux';
import { typedAction } from 'types';
import { Product } from 'reducers/module/product';
import * as types from 'actionTypes';

const addProducts = (products: Product[]) => {
  return typedAction(types.ADD_PRODUCTS, products);
};

export const addToCart = (product: Product, quantity: number) => {
  return typedAction(types.ADD_TO_CART, { product, quantity });
};

export type ProductAction = ReturnType<typeof addProducts | typeof addToCart>;

export const loadProducts = () => {
  return (dispatch: Dispatch<AnyAction>) => {
    setTimeout(() => {
      dispatch(
        addProducts([
          {
            id: 1,
            name: 'Cool Headphones',
            price: 4999,
            img: 'https://placeimg.com/640/480/tech/5'
          }
        ])
      );
    }, 500);
  };
};
