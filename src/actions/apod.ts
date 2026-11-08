import { Dispatch, AnyAction } from 'redux';
import { typedAction } from 'types';
import * as types from 'actionTypes';
import apodService from 'services/apod';
import { getApodRequestErrorPayload } from 'utilities/apodError';

export type ApodAction = ReturnType<typeof typedAction>;

type ApodFetchHandlers = {
  onPending: string;
  onSuccess: string;
  onFailure: string;
  afterSuccess?: (data: unknown) => void;
};

const fetchApodForDate = (date: string, handlers: ApodFetchHandlers) => async (
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(typedAction(handlers.onPending));
  try {
    const res = await apodService.getPictureOfTheDay(date);
    handlers.afterSuccess?.(res.data);
    dispatch(typedAction(handlers.onSuccess, res.data));
  } catch (error) {
    dispatch(typedAction(handlers.onFailure, getApodRequestErrorPayload(error)));
  }
};

export const getPictureOfTheDay = (date: string) =>
  fetchApodForDate(date, {
    onPending: types.GET_PICTURE_OF_THE_DAY,
    onSuccess: types.GET_PICTURE_OF_THE_DAY_SUCCESS,
    onFailure: types.GET_PICTURE_OF_THE_DAY_FAILURE,
    afterSuccess: (data) => {
      localStorage.setItem('pictureOfTheDay', JSON.stringify(data));
    }
  });

export const getPreviousOrNextPicture = (date: string) =>
  fetchApodForDate(date, {
    onPending: types.GET_PREVIOUS_OR_NEXT_DAY_PICTURE,
    onSuccess: types.GET_PREVIOUS_OR_NEXT_DAY_PICTURE_SUCCESS,
    onFailure: types.GET_PREVIOUS_OR_NEXT_DAY_PICTURE_FAILURE
  });
