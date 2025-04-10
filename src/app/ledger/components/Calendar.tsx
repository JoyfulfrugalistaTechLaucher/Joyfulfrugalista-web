'use client';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

function LedgerCalendarMobile(
  {date, handler}: {date: Date, handler: (date: Date) => void}
) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
    >
      <DatePicker
        value={dayjs(date)}
        onChange={(value, context) => {
          if (value) {
            handler(value.toDate());
          }
        }}
        views={['year', 'month', 'day']}
        sx={{
          width: '100%',
          '& .MuiInputBase-root': { width: '100%' }
        }}
        slotProps={{
          textField: {
            fullWidth: true
          }
        }}
      />
    </LocalizationProvider>
  );
}

function LedgerCalendarDesktop(
  {date, handler}: {date: Date, handler: (date: Date) => void}
) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
    >
      <DateCalendar
        value={dayjs(date)}
        onChange={(value) => {
          if (value) {
            handler(value.toDate());
          }
        }} />
    </LocalizationProvider>
  );
}

export { LedgerCalendarMobile, LedgerCalendarDesktop };
