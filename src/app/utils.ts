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

  if (value < 1000) {
    return value.toString();
  }

  if (value < 1000_000) {
    return (value / 1000).toString().concat('K');
  }

  if (value < 1000_000_000) {
    return (value / 1000_000).toString().concat('M');
  }

  // else this must be a super billionare
  return (value / 1000_000_000).toString().concat('B');
}
