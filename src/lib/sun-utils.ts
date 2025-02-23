import { getTimes } from 'suncalc';

const HOUR_IN_MS = 60 * 60 * 1000;

export function isNearSunriseOrSunset(
  launchTime: string,
  latitude: number,
  longitude: number
): { isNear: boolean; type: 'sunrise' | 'sunset' | null } {
  const launchDate = new Date(launchTime);
  const { sunrise, sunset } = getTimes(launchDate, latitude, longitude);

  const launchMs = launchDate.getTime();
  const sunriseMs = sunrise.getTime();
  const sunsetMs = sunset.getTime();

  // Check if launch is within ±1 hour of sunrise or sunset
  const isNearSunrise = Math.abs(launchMs - sunriseMs) <= HOUR_IN_MS;
  const isNearSunset = Math.abs(launchMs - sunsetMs) <= HOUR_IN_MS;

  if (isNearSunrise) {
    return { isNear: true, type: 'sunrise' };
  } else if (isNearSunset) {
    return { isNear: true, type: 'sunset' };
  }

  return { isNear: false, type: null };
}