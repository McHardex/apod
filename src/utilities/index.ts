export const formatDate = (date: Date) => {
  const getFullYear = new Date(date).getFullYear();
  const getMonth = new Date(date).getMonth();
  const getDate = new Date(date).getDate();

  return `${getFullYear}-${getMonth + 1}-${getDate}`;
};

export const nextDay = (date: string) => {
  const nextDay = new Date(date);
  const getFullYear = new Date(date).getFullYear();
  const getMonth = new Date(date).getMonth();
  const getDate = new Date(nextDay.setDate(nextDay.getDate() + 1)).getDate();

  return `${getFullYear}-${getMonth + 1}-${getDate}`;
};

export const previousDay = (date: string) => {
  const nextDay = new Date(date);
  const getFullYear = new Date(date).getFullYear();
  const getMonth = new Date(date).getMonth();
  const getDate = new Date(nextDay.setDate(nextDay.getDate() - 1)).getDate();

  return `${getFullYear}-${getMonth + 1}-${getDate}`;
};
