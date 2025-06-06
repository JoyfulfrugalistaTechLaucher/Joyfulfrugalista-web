// Helpers
type DateFormatOptions = {
  day?: 'numeric',
  month?: 'long' | 'numeric',
  year?: 'numeric',
}

export function formatDate(date: Date, format?: DateFormatOptions): string {
  const defaultFormat: DateFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  // Use the provided format or the default if format is undefined/null
  const options = format ?? defaultFormat;

  return new Intl.DateTimeFormat(
    'en-US', {...options, timeZone: 'Australia/Sydney'}
  ).format(date);
}

// Format a date object into the form of `mm/dd/yyyy`
export function formatNumericDate(date: Date): string {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function getWeekBounds(date: Date): { start: Date, end: Date } {
  const start = new Date(date);
  const day = date.getDay(); // 0 is Sunday, 6 is Saturday

  // Set to Sunday (start of week)
  start.setDate(date.getDate() - day);

  // Set to Saturday (end of week)
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  // Reset time parts to start/end of day if needed
  // start.setHours(0, 0, 0, 0);
  // end.setHours(23, 59, 59, 999);
  return { start, end };
}

// Format a given number to the contarcted form. For example, input 123,400
// output 123.4 k.  Supports numbers no larger than one billion
export function formatNumber(value: number | undefined): string {
  if (value === undefined) return '';

  if (value < 10_000) {
    return value.toFixed(2).toString();
  }

  if (value < 1000_000) {
    return (value / 1000).toFixed(2).toString().concat('K');
  }

  if (value < 1000_000_000) {
    return (value / 1000_000).toFixed(2).toString().concat('M');
  }

  // else this must be a super billionare
  return (value / 1000_000_000).toFixed(2).toString().concat('B');
}

// Format currency values
export function formatCurrency(value: number): string {
  // Ensure value is a valid number
  const numericValue = Number(value) || 0;

  if (numericValue >= 1000000) {
    return `$${(numericValue / 1000000).toFixed(1)}M`;
  } else if (numericValue >= 1000) {
    return `$${(numericValue / 1000).toFixed(1)}K`;
  } else {
    return `$${numericValue.toFixed(2)}`;
  }
}
