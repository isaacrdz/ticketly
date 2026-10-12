const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// purchase_date is a calendar date (YYYY-MM-DD), so parse it by hand to avoid timezone shifts.
function parseDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return { year, month, day, weekday };
}

/** "SAT, OCT 10" */
export function formatDayHeader(date: string): string {
  const { month, day, weekday } = parseDate(date);
  return `${WEEKDAYS[weekday]}, ${MONTHS[month - 1].slice(0, 3).toUpperCase()} ${day}`;
}

/** "October 10" */
export function formatMonthDay(date: string): string {
  const { month, day } = parseDate(date);
  return `${MONTHS[month - 1]} ${day}`;
}

/** "October 2026" */
export function formatMonthYear(date: string): string {
  const { year, month } = parseDate(date);
  return `${MONTHS[month - 1]} ${year}`;
}

/** "2026-10" */
export function getMonthKey(date: string): string {
  return date.slice(0, 7);
}
