import momentTimezone from 'moment-timezone';

export const HOUR_IN_PIXELS = 50;
export const MINUTE_IN_PIXELS = HOUR_IN_PIXELS / 60;

export default function positionInDay(date, timeZone) {
  if (!timeZone) {
    throw new Error('Missing timeZone');
  }

  const mom = momentTimezone.tz(date, timeZone);
  return (
    (mom.hours() * HOUR_IN_PIXELS) +
    (mom.minutes() * MINUTE_IN_PIXELS)
  );
};
