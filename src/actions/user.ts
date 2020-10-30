import { typedAction } from 'types';
import * as types from 'actionTypes';

export const login = (username: string) => {
  return typedAction(types.LOGIN, username);
};

export const logout = () => {
  return typedAction(types.LOGOUT);
};

export type UserAction = ReturnType<typeof login | typeof logout>;
