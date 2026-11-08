import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { getPictureOfTheDay } from 'actions/apod';
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

  it('should dispatch a safe failure payload when the request has no response', async () => {
    const store = mockStore();
    apodService.getPictureOfTheDay.mockRejectedValue(new Error('Network Error'));
    await store.dispatch(getPictureOfTheDay('2020-06-06'));

    const failureAction = store
      .getActions()
      .find((action) => action.type === types.GET_PICTURE_OF_THE_DAY_FAILURE);
    expect(failureAction?.payload).toEqual({
      msg: 'Unable to load the picture of the day. Please try again.'
    });
  });
});
