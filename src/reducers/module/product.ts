import { ProductAction } from 'actions/product';
import * as types from 'actionTypes';

export type Product = {
  id: number;
  name: string;
  price: number;
  img: string;
};

type CartItem = {
  id: number;
  quantity: number;
};

type ProductState = {
  products: Product[];
  loading: boolean;
  cart: CartItem[];
};

const initialState: ProductState = {
  products: [],
  loading: false,
  cart: []
};

export function productsReducer(state = initialState, action: ProductAction): ProductState {
  switch (action.type) {
    case types.ADD_PRODUCTS:
      return {
        ...state,
        products: [...state.products, ...action.payload]
      };
    case types.ADD_TO_CART:
      return {
        ...state,
        cart: [
          ...state.cart,
          {
            id: action.payload.product.id,
            quantity: action.payload.quantity
          }
        ]
      };
    default:
      return state;
  }
}
