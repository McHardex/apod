import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { getPictureOfTheDay } from 'actions/apod';
import apodService from 'services/apod';

jest.mock('services/apod');

export const resolvedApiResponse = () =>
  Promise.resolve({
    data: {
      id: 'id',
      copyright: 'Casey Good/Steve Timmons',
      date: '2020-10-29',
      explanation:
        "Inspired by the halloween season, this telescopic portrait captures a cosmic cloud with a scary visage. The interstellar scene lies within the dusty expanse of reflection nebula IC 2118 in the constellation Orion, the Hunter. IC 2118 is about 800 light-years from your neighborhood, close to bright bluish star Rigel at Orion's foot. Often identified as the Witch Head nebula for its appearance in a wider field of view it now rises before the witching hour. With spiky stars for eyes, the ghoulish apparition identified here seems to extend an arm many light-years long toward Orion's hot supergiant star. The source of illumination for IC 2118, Rigel is just beyond this frame at the upper left.",
      hdurl: 'https://apod.nasa.gov/apod/image/2010/GhoulGood.jpg',
      media_type: 'image',
      service_version: 'v1',
      title: 'The Ghoul of IC 2118',
      url: 'https://apod.nasa.gov/apod/image/2010/GhoulGood_1024.jpg'
    }
  });

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

  it('should store picture of the day in the localstorage after fetching pictures data successfully', async () => {
    const store = mockStore();
    apodService.getPictureOfTheDay.mockImplementation(resolvedApiResponse);
    await store.dispatch(getPictureOfTheDay('2020-06-06'));
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
  });
});
