import { Dispatch, AnyAction } from 'redux';
import { Picture, typedAction } from 'types';
import * as types from 'actionTypes';
import apodService from 'services/apod';

export type ApodAction = ReturnType<typeof typedAction>;

const apodErrorPayload = (error: unknown): Picture | { msg: string } => {
  if (error && typeof error === 'object' && 'response' in error) {
    const { response } = error as { response?: { data?: Picture | { msg: string } } };
    if (response?.data) {
      return response.data;
    }
  }
  return { msg: 'Unable to load the astronomy picture of the day.' };
};

export const getPictureOfTheDay = (date: string) => async (dispatch: Dispatch<AnyAction>) => {
  dispatch(typedAction(types.GET_PICTURE_OF_THE_DAY));
  try {
    const res = await apodService.getPictureOfTheDay(date);
    localStorage.setItem('pictureOfTheDay', JSON.stringify(res.data));
    dispatch(typedAction(types.GET_PICTURE_OF_THE_DAY_SUCCESS, res.data));
  } catch (error) {
    dispatch(typedAction(types.GET_PICTURE_OF_THE_DAY_FAILURE, apodErrorPayload(error)));
  }
};

export const getPreviousOrNextPicture = (date: string) => async (dispatch: Dispatch<AnyAction>) => {
  dispatch(typedAction(types.GET_PREVIOUS_OR_NEXT_DAY_PICTURE));
  try {
    const res = await apodService.getPictureOfTheDay(date);
    dispatch(typedAction(types.GET_PREVIOUS_OR_NEXT_DAY_PICTURE_SUCCESS, res.data));
  } catch (error) {
    dispatch(typedAction(types.GET_PREVIOUS_OR_NEXT_DAY_PICTURE_FAILURE, apodErrorPayload(error)));
  }
};
