import { readStoredJson } from 'utilities';

describe('readStoredJson', () => {
  const stubStorage = (value: string | null) => {
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: jest.fn(() => value) },
      writable: true
    });
  };

  test('returns the parsed value', () => {
    stubStorage('{"date":"2020-10-29"}');
    expect(readStoredJson('pictureOfTheDay', {})).toEqual({ date: '2020-10-29' });
  });

  test('returns the fallback when the key is missing', () => {
    stubStorage(null);
    expect(readStoredJson('favorites', [])).toEqual([]);
  });

  test('returns the fallback when the stored value is not JSON', () => {
    stubStorage('not-json');
    expect(readStoredJson('favorites', [])).toEqual([]);
  });
});
