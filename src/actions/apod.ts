import { Dispatch, AnyAction } from 'redux';
import { typedAction } from 'types';
import * as types from 'actionTypes';
import apodService from 'services/apod';

const getApodErrorPayload = (error: unknown) => {
  const axiosError = error as { response?: { data?: unknown }; message?: string };

  if (axiosError?.response?.data) {
    return axiosError.response.data;
  }

  return {
    msg: axiosError?.message ?? (error instanceof Error ? error.message : 'Request failed')
  };
};

export type ApodAction = ReturnType<typeof typedAction>;

export const getPictureOfTheDay = (date: string) => async (dispatch: Dispatch<AnyAction>) => {
  dispatch(typedAction(types.GET_PICTURE_OF_THE_DAY));
  try {
    const res = await apodService.getPictureOfTheDay(date);
    localStorage.setItem('pictureOfTheDay', JSON.stringify(res.data));
    dispatch(typedAction(types.GET_PICTURE_OF_THE_DAY_SUCCESS, res.data));
  } catch (error) {
    dispatch(typedAction(types.GET_PICTURE_OF_THE_DAY_FAILURE, getApodErrorPayload(error)));
  }
};

export const getPreviousOrNextPicture = (date: string) => async (dispatch: Dispatch<AnyAction>) => {
  dispatch(typedAction(types.GET_PREVIOUS_OR_NEXT_DAY_PICTURE));
  try {
    const res = await apodService.getPictureOfTheDay(date);
    dispatch(typedAction(types.GET_PREVIOUS_OR_NEXT_DAY_PICTURE_SUCCESS, res.data));
  } catch (error) {
    dispatch(
      typedAction(types.GET_PREVIOUS_OR_NEXT_DAY_PICTURE_FAILURE, getApodErrorPayload(error))
    );
  }
};
