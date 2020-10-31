import { Dispatch, AnyAction } from 'redux';
import { typedAction } from 'types';
import * as types from 'actionTypes';
import apodService from 'services';

export type ApodAction = ReturnType<typeof typedAction>;

export const getPictureOfTheDay = (date: string) => async (
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(typedAction(types.GET_PICTURE_OF_THE_DAY));
  try {
    const res = await apodService.getPictureOfTheDay(date);
    localStorage.setItem('pictureOfTheDay', JSON.stringify(res.data));
    dispatch(typedAction(types.GET_PICTURE_OF_THE_DAY_SUCCESS, res.data));
    return res.data;
  } catch (error) {
    dispatch(
      typedAction(types.GET_PICTURE_OF_THE_DAY_FAILURE, error.response.data)
    );
  }
};
