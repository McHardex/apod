import { UserAction } from 'actions/user';
import * as types from 'actionTypes';

type UserState = {
  username: string | null;
};

const initialState: UserState = { username: null };

export function userReducer(
  state = initialState,
  action: UserAction
): UserState {
  switch (action.type) {
    case types.LOGIN:
      return { username: action.payload };
    case types.LOGOUT:
      return { username: null };
    default:
      return state;
  }
}
