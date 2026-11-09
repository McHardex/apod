import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { getPictureOfTheDay, getPreviousOrNextPicture } from 'actions/apod';
import * as types from 'actionTypes';
import apodService from 'services/apod';
import { resolvedApiResponse } from 'mocks';

jest.mock('services/apod');

const mockedApodService = apodService as jest.Mocked<typeof apodService>;
const middlewares = [thunk];
const mockStore = configureMockStore<unknown, any>(middlewares);

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
    mockedApodService.getPictureOfTheDay.mockImplementation(resolvedApiResponse as any);
    await store.dispatch(getPictureOfTheDay('2020-06-06'));
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('dispatches the API error body on failure', async () => {
    const store = mockStore();
    mockedApodService.getPictureOfTheDay.mockRejectedValue({
      response: { data: { msg: 'Date must be between Jun 16, 1995 and today.' } }
    });
    await store.dispatch(getPictureOfTheDay('1990-01-01'));
    expect(store.getActions()).toContainEqual({
      type: types.GET_PICTURE_OF_THE_DAY_FAILURE,
      payload: { msg: 'Date must be between Jun 16, 1995 and today.' }
    });
  });

  it('dispatches a failure with the error message when there is no response', async () => {
    const store = mockStore();
    mockedApodService.getPictureOfTheDay.mockRejectedValue(new Error('Network Error'));
    await store.dispatch(getPictureOfTheDay('2020-06-06'));
    await store.dispatch(getPreviousOrNextPicture('2020-06-07'));
    expect(store.getActions()).toContainEqual({
      type: types.GET_PICTURE_OF_THE_DAY_FAILURE,
      payload: { msg: 'Network Error' }
    });
    expect(store.getActions()).toContainEqual({
      type: types.GET_PREVIOUS_OR_NEXT_DAY_PICTURE_FAILURE,
      payload: { msg: 'Network Error' }
    });
  });
});
