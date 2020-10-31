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
    const payload = {
      original: res.data.url,
      thumbnail: res.data.url,
      ...res.data
    };
    localStorage.setItem('pictureOfTheDay', JSON.stringify(res.data));
    dispatch(typedAction(types.GET_PICTURE_OF_THE_DAY_SUCCESS, payload));
    return res.data;
  } catch (error) {
    console.log(error.response, 'error here \n\n\n\n'); // eslint-disable-line no-console
  }
};
