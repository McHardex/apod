import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { getPictureOfTheDay, getPreviousOrNextPicture } from 'actions/apod';
import apodService from 'services/apod';
import { resolvedApiResponse } from 'mocks';
import * as types from 'actionTypes';

jest.mock('services/apod');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('APOD actions', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null)
      },
      writable: true
    });
  });

  it('should store picture of the day object into the localstorage', async () => {
    const store = mockStore();
    apodService.getPictureOfTheDay.mockImplementation(resolvedApiResponse);
    await store.dispatch(getPictureOfTheDay('2020-06-06'));
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('should dispatch failure with a msg payload when the request has no response', async () => {
    const store = mockStore();
    apodService.getPictureOfTheDay.mockRejectedValue({ message: 'Network Error' });

    await store.dispatch(getPictureOfTheDay('2020-06-06'));

    expect(store.getActions()).toEqual([
      { type: types.GET_PICTURE_OF_THE_DAY },
      {
        type: types.GET_PICTURE_OF_THE_DAY_FAILURE,
        payload: { msg: 'Network Error' }
      }
    ]);
  });

  it('should dispatch previous/next failure with API msg when response data exists', async () => {
    const store = mockStore();
    apodService.getPictureOfTheDay.mockRejectedValue({
      response: { data: { msg: 'Date must be between Jun 16, 1995 and today.' } }
    });

    await store.dispatch(getPreviousOrNextPicture('1990-01-01'));

    expect(store.getActions()).toEqual([
      { type: types.GET_PREVIOUS_OR_NEXT_DAY_PICTURE },
      {
        type: types.GET_PREVIOUS_OR_NEXT_DAY_PICTURE_FAILURE,
        payload: { msg: 'Date must be between Jun 16, 1995 and today.' }
      }
    ]);
  });
});
