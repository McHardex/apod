const padTwoDigits = (value: number) => (value < 10 ? `0${value}` : `${value}`);

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = padTwoDigits(date.getMonth() + 1);
  const day = padTwoDigits(date.getDate());

  return `${year}-${month}-${day}`;
};

// `new Date('YYYY-MM-DD')` parses as UTC midnight, which is the previous calendar
// day in timezones behind UTC, so the parts are read as a local date instead.
const parseDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const shiftDate = (date: string, days: number) => {
  const shifted = parseDate(date);
  shifted.setDate(shifted.getDate() + days);
  return formatDate(shifted);
};

export const nextDay = (date: string) => shiftDate(date, 1);

export const previousDay = (date: string) => shiftDate(date, -1);
