import { typedAction, TypedActionReturnType } from 'types';
import * as types from 'actionTypes';

export const login = (username: string): TypedActionReturnType => {
  return typedAction(types.LOGIN, username);
};

export const logout = (): TypedActionReturnType => {
  return typedAction(types.LOGOUT);
};

export type UserAction = ReturnType<typeof login | typeof logout>;
