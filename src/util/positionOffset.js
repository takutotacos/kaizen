import momentTimezone from 'moment-timezone';
import {HOUR_IN_PIXELS, MINUTE_IN_PIXELS} from "./positionInDay";

export default function positionOffset(date, timeZone) {
  if (!timeZone) {
    throw new Error('Missing timeZone');
  }

  const mom = momentTimezone.tz(date, timeZone);
  return (
    (mom.hours() * HOUR_IN_PIXELS) +
    (mom.minutes() * MINUTE_IN_PIXELS)
  );
}
