import { formatDate, nextDay, previousDay } from 'utilities';

// jest.globalSetup.js pins TZ=America/New_York: the UTC-parsing bug only shows up behind UTC.
describe('date utilities', () => {
  test('runs in a timezone behind UTC', () => {
    expect(new Date(2020, 5, 6).getTimezoneOffset()).toBeGreaterThan(0);
  });

  test('formatDate zero-pads month and day', () => {
    expect(formatDate(new Date(2020, 0, 5))).toBe('2020-01-05');
    expect(formatDate(new Date(2020, 11, 31))).toBe('2020-12-31');
  });

  test('nextDay moves forward one calendar day in a timezone behind UTC', () => {
    expect(nextDay('2020-06-06')).toBe('2020-06-07');
  });

  test('previousDay moves back one calendar day in a timezone behind UTC', () => {
    expect(previousDay('2020-06-06')).toBe('2020-06-05');
  });

  test('handles month, year and leap-day rollover', () => {
    expect(nextDay('2020-01-31')).toBe('2020-02-01');
    expect(nextDay('2020-12-31')).toBe('2021-01-01');
    expect(nextDay('2020-02-28')).toBe('2020-02-29');
    expect(previousDay('2021-03-01')).toBe('2021-02-28');
    expect(previousDay('2021-01-01')).toBe('2020-12-31');
  });

  test('handles daylight saving transitions', () => {
    expect(nextDay('2020-03-08')).toBe('2020-03-09');
    expect(previousDay('2020-11-02')).toBe('2020-11-01');
  });

  test('nextDay and previousDay round-trip', () => {
    expect(previousDay(nextDay('2020-10-29'))).toBe('2020-10-29');
  });
});
