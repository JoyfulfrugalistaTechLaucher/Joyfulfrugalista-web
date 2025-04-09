// Helpers
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
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
