import { parseStoredJson } from 'utilities';

describe('parseStoredJson', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => store[key] ?? null),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete store[key];
        })
      },
      writable: true
    });
  });

  it('returns fallback when the key is missing', () => {
    expect(parseStoredJson('favorites', [])).toEqual([]);
  });

  it('parses valid JSON from storage', () => {
    localStorage.setItem('favorites', JSON.stringify([{ id: '1' }]));
    expect(parseStoredJson('favorites', [])).toEqual([{ id: '1' }]);
  });

  it('removes corrupt JSON and returns fallback', () => {
    localStorage.setItem('favorites', '{not-json');
    expect(parseStoredJson('favorites', [])).toEqual([]);
    expect(localStorage.removeItem).toHaveBeenCalledWith('favorites');
  });
});
