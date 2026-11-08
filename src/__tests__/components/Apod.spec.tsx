import React from 'react';
import { Apod } from 'components/Apod';
import { picture } from 'mocks';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { formatDate } from 'utilities';
import firebaseService from 'services/firebaseService';

jest.mock('services/firebaseService', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve([])),
    create: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
    deleteCollection: jest.fn(() => Promise.resolve())
  }
}));

const props = {
  getPictureOfTheDay: jest.fn(),
  picture: picture,
  isLoading: false
};

const renderApod = async (overrideProps: Partial<typeof props> = {}) => {
  render(<Apod {...props} {...overrideProps} />);
  await waitFor(() => {
    expect(firebaseService.get).toHaveBeenCalled();
  });
};

describe('Apod', () => {
  beforeEach(() => {
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
    await renderApod({ isLoading: true });
    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();
  });

  test('renders picture details successfullty fetching the picture data', async () => {
    await renderApod();
    const title = await screen.getByText(/The Ghoul of IC 2118/);
    const backBtn = await screen.findByTestId('previous-picture');
    const img = await screen.getByRole('img');
    const nextBtn = await screen.findByTestId('next-picture');
    const pictureDescriptionWrapper = screen.getByText(picture.explanation);
    expect(title).toBeInTheDocument();
    expect(backBtn).toBeInTheDocument();
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', picture.url);
    expect(nextBtn).toBeInTheDocument();
    expect(pictureDescriptionWrapper).toBeInTheDocument();
  });

  test('call getPictureOfTheDay when the user clicks the back button', async () => {
    await renderApod();
    const backBtn = await screen.findByTestId('previous-picture');
    fireEvent.click(backBtn);
    expect(props.getPictureOfTheDay).toBeCalled();
  });

  test('call getPictureOfTheDay when  user changes the date input value', async () => {
    await renderApod();
    const input = await screen.getByDisplayValue(formatDate(new Date()));

    await fireEvent.change(input, { target: { value: '2020-01-01' } });
    expect(props.getPictureOfTheDay).toBeCalled();
  });

  test('render error component when there is no picture of the day', async () => {
    await renderApod({ picture: { msg: 'no picture of the day' } });
    const errorMessage = await screen.getByText('no picture of the day');
    const rescueMeBtn = await screen.getByRole('button');
    expect(errorMessage).toBeInTheDocument();
    expect(rescueMeBtn).toBeInTheDocument();
  });
});
