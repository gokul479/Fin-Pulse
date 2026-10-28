/**
 * Date helper utilities for Month, Week, Day filtering and formatting
 */

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Parses YYYY-MM-DD or ISO string safely into year, month (0-indexed), date
 */
export const parseDateParts = (dateString) => {
  if (!dateString) {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
      dateObj: now,
    };
  }

  // Handle YYYY-MM-DD strings explicitly to avoid timezone shifts
  const parts = dateString.split('T')[0].split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed
    const day = parseInt(parts[2], 10);
    return {
      year,
      month,
      day,
      dateObj: new Date(year, month, day),
    };
  }

  const d = new Date(dateString);
  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    day: d.getDate(),
    dateObj: d,
  };
};

/**
 * Returns formatted date string: e.g. "20 Oct 2026"
 */
export const formatDateDisplay = (dateString) => {
  if (!dateString) return '';
  const { year, month, day } = parseDateParts(dateString);
  return `${day} ${SHORT_MONTHS[month]} ${year}`;
};

/**
 * Today's date in YYYY-MM-DD
 */
export const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Filter transactions by selected Month and Year
 */
export const isSameMonthAndYear = (dateString, targetMonth, targetYear) => {
  if (!dateString) return false;
  const { year, month } = parseDateParts(dateString);
  return year === targetYear && month === targetMonth;
};

/**
 * Filter transactions by specific calendar day (YYYY-MM-DD)
 */
export const isSameDay = (dateString, targetDateString) => {
  if (!dateString || !targetDateString) return false;
  const p1 = parseDateParts(dateString);
  const p2 = parseDateParts(targetDateString);
  return p1.year === p2.year && p1.month === p2.month && p1.day === p2.day;
};

/**
 * Filter transactions within the last 7 days ending at targetDate
 */
export const isWithinSevenDays = (dateString, referenceDate = new Date()) => {
  if (!dateString) return false;
  const { dateObj } = parseDateParts(dateString);
  const ref = new Date(referenceDate);
  ref.setHours(23, 59, 59, 999);
  
  const sevenDaysAgo = new Date(ref);
  sevenDaysAgo.setDate(ref.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  return dateObj >= sevenDaysAgo && dateObj <= ref;
};

/**
 * Filter transactions within current calendar month
 */
export const isWithinCurrentMonth = (dateString, referenceDate = new Date()) => {
  if (!dateString) return false;
  const { year, month } = parseDateParts(dateString);
  const ref = new Date(referenceDate);
  return year === ref.getFullYear() && month === ref.getMonth();
};
