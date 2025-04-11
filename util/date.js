export function getFormattedDate(date) {
  date = new Date(date);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function getDateMinusDays(date, days) {
  date = new Date(date);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}