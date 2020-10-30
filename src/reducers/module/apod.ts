import { ApodAction } from 'actions/apod';
import * as types from 'actionTypes';

export type PictureOfTheDay = {
  picture?: any;
  loading: boolean;
};

type apodState = {
  pictureOfTheDay: PictureOfTheDay;
};

const initialState: apodState = {
  pictureOfTheDay: {
    picture: {},
    loading: false
  }
};

export function apodReducer(state = initialState, action: ApodAction): apodState {
  switch (action.type) {
    case types.GET_PICTURE_OF_THE_DAY:
      return {
        ...state,
        pictureOfTheDay: {
          loading: true
        }
      };
    case types.GET_PICTURE_OF_THE_DAY_SUCCESS:
      return {
        ...state,
        pictureOfTheDay: {
          picture: action.payload,
          loading: false
        }
      };
    case types.GET_PICTURE_OF_THE_DAY_FAILURE:
      return {
        ...state,
        pictureOfTheDay: {
          loading: false
        }
      };
    default:
      return state;
  }
}
