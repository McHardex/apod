import React from 'react';
import { Apod } from 'components/Apod';
import { picture } from 'mocks';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { Picture } from 'types';
import firebaseService from 'services/firebaseService';

jest.mock('services/firebaseService', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    deleteCollection: jest.fn()
  }
}));

const props = {
  getPictureOfTheDay: jest.fn(),
  picture: picture,
  isLoading: false
};

// Flushes the favorites fetch that Apod starts on mount.
const renderApod = async (ui: React.ReactElement) => {
  await act(async () => {
    render(ui);
  });
};

const TODAY = '2020-10-30';

const stubStoredPicture = () => {
  window.localStorage.getItem = jest.fn((key: string) =>
    key === 'pictureOfTheDay' ? JSON.stringify(picture) : null
  );
};

describe('Apod', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2020, 9, 30, 12));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (firebaseService.get as jest.Mock).mockResolvedValue([]);
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null)
      },
      writable: true
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('render loading component when fetching data', async () => {
    await renderApod(<Apod {...props} isLoading={true} />);
    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();
  });

  test('renders picture details successfullty fetching the picture data', async () => {
    await renderApod(<Apod {...props} />);
    const title = await screen.getByText(/The Ghoul of IC 2118/);
    const backBtn = screen.getByTestId('previous-picture');
    const img = await screen.getByRole('img');
    const nextBtn = screen.getByTestId('next-picture');
    const pictureDescriptionWrapper = screen.getByText(picture.explanation);
    expect(title).toBeInTheDocument();
    expect(backBtn).toBeInTheDocument();
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', picture.url);
    expect(nextBtn).toBeInTheDocument();
    expect(pictureDescriptionWrapper).toBeInTheDocument();
  });

  test('fetches the picture of the day exactly once on mount', async () => {
    await renderApod(<Apod {...props} />);
    expect(props.getPictureOfTheDay).toHaveBeenCalledTimes(1);
    expect(props.getPictureOfTheDay).toHaveBeenCalledWith(TODAY);
  });

  test('fetches the stored picture date on mount when one is cached', async () => {
    stubStoredPicture();
    await renderApod(<Apod {...props} />);
    expect(props.getPictureOfTheDay).toHaveBeenCalledTimes(1);
    expect(props.getPictureOfTheDay).toHaveBeenCalledWith(picture.date);
  });

  test('call getPictureOfTheDay when the user clicks the back button', async () => {
    await renderApod(<Apod {...props} />);
    const backBtn = screen.getByTestId('previous-picture');
    fireEvent.click(backBtn);
    expect(props.getPictureOfTheDay).toHaveBeenLastCalledWith('2020-10-29');
  });

  test('call getPictureOfTheDay when  user changes the date input value', async () => {
    await renderApod(<Apod {...props} />);
    const input = await screen.getByDisplayValue(TODAY);

    await fireEvent.change(input, { target: { value: '2020-01-01' } });
    expect(props.getPictureOfTheDay).toHaveBeenLastCalledWith('2020-01-01');
  });

  test('render error component when there is no picture of the day', async () => {
    await renderApod(<Apod {...props} picture={{ msg: 'no picture of the day' } as Picture} />);
    const errorMessage = await screen.getByText('no picture of the day');
    const rescueMeBtn = await screen.getByRole('button');
    expect(errorMessage).toBeInTheDocument();
    expect(rescueMeBtn).toBeInTheDocument();
  });

  describe('rescue', () => {
    const configuredRescueDate = process.env.REACT_APP_RESCUE_USER_DATE;

    const clickRescue = async () => {
      stubStoredPicture();
      await renderApod(<Apod {...props} picture={{ msg: 'no picture of the day' } as Picture} />);
      fireEvent.click(screen.getByRole('button', { name: 'Rescue me' }));
    };

    afterEach(() => {
      process.env.REACT_APP_RESCUE_USER_DATE = configuredRescueDate;
    });

    test('loads the configured rescue date', async () => {
      process.env.REACT_APP_RESCUE_USER_DATE = '2020-06-16';
      await clickRescue();
      expect(props.getPictureOfTheDay).toHaveBeenLastCalledWith('2020-06-16');
    });

    test('falls back to the first APOD date when no rescue date is configured', async () => {
      delete process.env.REACT_APP_RESCUE_USER_DATE;
      await clickRescue();
      expect(props.getPictureOfTheDay).toHaveBeenLastCalledWith('1995-06-16');
    });
  });
});
