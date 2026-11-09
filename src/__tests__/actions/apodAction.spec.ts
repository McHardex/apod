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

  describe.each([
    [
      'getPictureOfTheDay',
      getPictureOfTheDay,
      types.GET_PICTURE_OF_THE_DAY,
      types.GET_PICTURE_OF_THE_DAY_FAILURE
    ],
    [
      'getPreviousOrNextPicture',
      getPreviousOrNextPicture,
      types.GET_PREVIOUS_OR_NEXT_DAY_PICTURE,
      types.GET_PREVIOUS_OR_NEXT_DAY_PICTURE_FAILURE
    ]
  ])('%s failure', (_name, action, pendingType, failureType) => {
    it('dispatches the API error body', async () => {
      const store = mockStore();
      const apiError = { msg: 'Date must be between Jun 16, 1995 and today.' };
      mockedApodService.getPictureOfTheDay.mockRejectedValue({ response: { data: apiError } });
      await store.dispatch(action('1990-01-01'));
      expect(store.getActions()).toEqual([
        { type: pendingType, payload: undefined },
        { type: failureType, payload: apiError }
      ]);
    });

    it('dispatches the error message when there is no response', async () => {
      const store = mockStore();
      mockedApodService.getPictureOfTheDay.mockRejectedValue(new Error('Network Error'));
      await store.dispatch(action('2020-06-06'));
      expect(store.getActions()).toEqual([
        { type: pendingType, payload: undefined },
        { type: failureType, payload: { msg: 'Network Error' } }
      ]);
    });
  });
});
