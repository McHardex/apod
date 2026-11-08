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

  it('dispatches a safe failure payload when the request throws', async () => {
    const store = mockStore();
    apodService.getPictureOfTheDay.mockRejectedValue(new Error('Network Error'));
    await store.dispatch(getPictureOfTheDay('2020-06-06'));
    const actions = store.getActions();
    expect(actions[1]).toEqual({
      type: types.GET_PICTURE_OF_THE_DAY_FAILURE,
      payload: { msg: 'Unable to load the astronomy picture of the day.' }
    });
  });
});
