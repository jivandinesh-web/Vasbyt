/**
 * Weather API utility using Open-Meteo public forecast endpoint:
 * https://api.open-meteo.com/v1/forecast?
 * Designed for South African endurance athletes (runners & cyclists).
 */

export interface DailyForecast {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Today", "Wed 16", "Thu 17"
  weatherCode: number;
  weatherDescription: string;
  weatherIconName: 'sun' | 'cloud-sun' | 'cloud' | 'cloud-rain' | 'cloud-drizzle' | 'cloud-lightning' | 'cloud-fog';
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  precipitationSumMm: number;
  precipitationProbMax: number;
  windSpeedMaxKmh: number;
  windDirectionDeg: number;
  uvIndexMax: number;
  // Athletic assessment
  runningScore: 'Ideal' | 'Good' | 'Warm' | 'Tough' | 'Extreme Heat';
  runningScoreColor: string;
  gearRecommendation: string;
  hourlySlots?: HourlySlot[];
}

export interface HourlySlot {
  time: string; // e.g. "06:00", "09:00", "12:00", "15:00", "18:00"
  temp: number;
  apparentTemp: number;
  humidity: number;
  precipProb: number;
  windSpeed: number;
  weatherCode: number;
}

export interface RaceForecastResult {
  latitude: number;
  longitude: number;
  city: string;
  timezone: string;
  elevationMeters?: number;
  daily: DailyForecast[];
  current?: {
    temp: number;
    apparentTemp: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    weatherDesc: string;
  };
  fetchedAt: number;
  isFallback?: boolean;
}

// In-memory cache to prevent spamming API across component re-renders
const forecastCache = new Map<string, { data: RaceForecastResult; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function getWeatherConditionInfo(code: number): {
  description: string;
  iconName: DailyForecast['weatherIconName'];
} {
  switch (code) {
    case 0:
      return { description: 'Clear Skies', iconName: 'sun' };
    case 1:
      return { description: 'Mainly Clear', iconName: 'sun' };
    case 2:
      return { description: 'Partly Cloudy', iconName: 'cloud-sun' };
    case 3:
      return { description: 'Overcast', iconName: 'cloud' };
    case 45:
    case 48:
      return { description: 'Fog / Mist', iconName: 'cloud-fog' };
    case 51:
    case 53:
    case 55:
      return { description: 'Light Drizzle', iconName: 'cloud-drizzle' };
    case 56:
    case 57:
      return { description: 'Freezing Drizzle', iconName: 'cloud-drizzle' };
    case 61:
    case 63:
      return { description: 'Moderate Rain', iconName: 'cloud-rain' };
    case 65:
      return { description: 'Heavy Downpour', iconName: 'cloud-rain' };
    case 80:
    case 81:
    case 82:
      return { description: 'Passing Showers', iconName: 'cloud-rain' };
    case 95:
      return { description: 'Thunderstorm', iconName: 'cloud-lightning' };
    case 96:
    case 99:
      return { description: 'Severe Thunderstorm & Hail', iconName: 'cloud-lightning' };
    default:
      return { description: 'Mild Conditions', iconName: 'cloud-sun' };
  }
}

function evaluateAthleticConditions(
  maxTemp: number,
  minTemp: number,
  windMax: number,
  precipMm: number,
  uvMax: number
): { score: DailyForecast['runningScore']; color: string; gear: string } {
  if (maxTemp >= 32) {
    return {
      score: 'Extreme Heat',
      color: '#b5502f',
      gear: 'High electrolyte load, ice bandana, early 05:30 start recommended.',
    };
  }
  if (maxTemp >= 26) {
    return {
      score: 'Warm',
      color: '#e28b37',
      gear: 'Hydration vest required, cap, high SPF sunscreen, salt tabs.',
    };
  }
  if (precipMm >= 8 || windMax >= 35) {
    return {
      score: 'Tough',
      color: '#d8b34a',
      gear: 'Lightweight technical windbreaker, trail grip shoes, anti-chafe balm.',
    };
  }
  if (minTemp >= 10 && maxTemp <= 21 && windMax <= 20) {
    return {
      score: 'Ideal',
      color: '#7c8f5c',
      gear: 'Prime PB conditions! Singlet / light tee, standard hydration pacing.',
    };
  }
  return {
    score: 'Good',
    color: '#d8b34a',
    gear: 'Comfortable race kit; slight breeze or crisp morning chill.',
  };
}

function formatDayLabel(dateStr: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  try {
    const parts = dateStr.split('-');
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return d.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
}

/**
 * Fetch 5-day forecast from Open-Meteo API
 */
export async function fetchRaceWeatherForecast(
  lat: number,
  lng: number,
  city = 'South Africa'
): Promise<RaceForecastResult> {
  const roundedLat = parseFloat(lat.toFixed(3));
  const roundedLng = parseFloat(lng.toFixed(3));
  const cacheKey = `${roundedLat},${roundedLng}`;

  // Check cache
  const cached = forecastCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${roundedLat}&longitude=${roundedLng}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant,uv_index_max&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m&timezone=auto&forecast_days=5`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP error: ${res.status}`);
    }
    const data = await res.json();

    const dailyTimes: string[] = data.daily?.time || [];
    const dailyCodes: number[] = data.daily?.weather_code || [];
    const maxTemps: number[] = data.daily?.temperature_2m_max || [];
    const minTemps: number[] = data.daily?.temperature_2m_min || [];
    const appMaxTemps: number[] = data.daily?.apparent_temperature_max || [];
    const appMinTemps: number[] = data.daily?.apparent_temperature_min || [];
    const precipSums: number[] = data.daily?.precipitation_sum || [];
    const precipProbs: number[] = data.daily?.precipitation_probability_max || [];
    const winds: number[] = data.daily?.wind_speed_10m_max || [];
    const windDirs: number[] = data.daily?.wind_direction_10m_dominant || [];
    const uvs: number[] = data.daily?.uv_index_max || [];

    // Parse hourly slots if available
    const hourlyTimes: string[] = data.hourly?.time || [];
    const hourlyTemps: number[] = data.hourly?.temperature_2m || [];
    const hourlyAppTemps: number[] = data.hourly?.apparent_temperature || [];
    const hourlyHumids: number[] = data.hourly?.relative_humidity_2m || [];
    const hourlyPrecipProbs: number[] = data.hourly?.precipitation_probability || [];
    const hourlyWinds: number[] = data.hourly?.wind_speed_10m || [];
    const hourlyCodes: number[] = data.hourly?.weather_code || [];

    const dailyList: DailyForecast[] = dailyTimes.slice(0, 5).map((dateStr, idx) => {
      const code = dailyCodes[idx] ?? 0;
      const condition = getWeatherConditionInfo(code);
      const maxT = Math.round(maxTemps[idx] ?? 22);
      const minT = Math.round(minTemps[idx] ?? 12);
      const wind = Math.round(winds[idx] ?? 14);
      const precip = Math.round((precipSums[idx] ?? 0) * 10) / 10;
      const uv = Math.round((uvs[idx] ?? 5) * 10) / 10;

      const athletic = evaluateAthleticConditions(maxT, minT, wind, precip, uv);

      // Extract key race hours (06:00, 09:00, 12:00, 15:00, 18:00) for this day
      const keyHours = ['06:00', '09:00', '12:00', '15:00', '18:00'];
      const slots: HourlySlot[] = [];

      keyHours.forEach((hourStr) => {
        const fullTimeStr = `${dateStr}T${hourStr}`;
        const hIdx = hourlyTimes.indexOf(fullTimeStr);
        if (hIdx !== -1) {
          slots.push({
            time: hourStr,
            temp: Math.round(hourlyTemps[hIdx] ?? maxT),
            apparentTemp: Math.round(hourlyAppTemps[hIdx] ?? maxT),
            humidity: Math.round(hourlyHumids[hIdx] ?? 55),
            precipProb: Math.round(hourlyPrecipProbs[hIdx] ?? 0),
            windSpeed: Math.round(hourlyWinds[hIdx] ?? wind),
            weatherCode: hourlyCodes[hIdx] ?? code,
          });
        }
      });

      return {
        date: dateStr,
        dayLabel: formatDayLabel(dateStr, idx),
        weatherCode: code,
        weatherDescription: condition.description,
        weatherIconName: condition.iconName,
        tempMax: maxT,
        tempMin: minT,
        apparentTempMax: Math.round(appMaxTemps[idx] ?? maxT),
        apparentTempMin: Math.round(appMinTemps[idx] ?? minT),
        precipitationSumMm: precip,
        precipitationProbMax: Math.round(precipProbs[idx] ?? 0),
        windSpeedMaxKmh: wind,
        windDirectionDeg: Math.round(windDirs[idx] ?? 0),
        uvIndexMax: uv,
        runningScore: athletic.score,
        runningScoreColor: athletic.color,
        gearRecommendation: athletic.gear,
        hourlySlots: slots,
      };
    });

    // Current condition estimate from day 0 morning or current hour
    const currentSlot = dailyList[0]?.hourlySlots?.[1] || dailyList[0]?.hourlySlots?.[0];
    const current = currentSlot
      ? {
          temp: currentSlot.temp,
          apparentTemp: currentSlot.apparentTemp,
          humidity: currentSlot.humidity,
          windSpeed: currentSlot.windSpeed,
          weatherCode: currentSlot.weatherCode,
          weatherDesc: getWeatherConditionInfo(currentSlot.weatherCode).description,
        }
      : undefined;

    const result: RaceForecastResult = {
      latitude: data.latitude,
      longitude: data.longitude,
      city,
      timezone: data.timezone || 'Africa/Johannesburg',
      elevationMeters: data.elevation,
      daily: dailyList,
      current,
      fetchedAt: Date.now(),
    };

    forecastCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (err) {
    console.warn(`[Open-Meteo] Fallback for ${city} (${roundedLat}, ${roundedLng}):`, err);
    return getOfflineFallbackForecast(roundedLat, roundedLng, city);
  }
}

/**
 * High-fidelity fallback based on South African meteorological patterns if offline
 */
function getOfflineFallbackForecast(lat: number, lng: number, city: string): RaceForecastResult {
  const isHighveld = lat < -25.0 && lat > -27.0 && lng > 27.0 && lng < 29.0;
  const isCape = lat < -33.0 && lng < 20.0;
  const isKZN = lat < -28.0 && lat > -31.0 && lng > 30.0;

  const baseMax = isCape ? 21 : isKZN ? 25 : isHighveld ? 24 : 22;
  const baseMin = isCape ? 13 : isKZN ? 16 : isHighveld ? 11 : 12;

  const today = new Date();
  const daily: DailyForecast[] = [];

  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const maxT = baseMax + ((i % 3) - 1);
    const minT = baseMin + ((i % 2) - 0.5);
    const code = i === 2 && isCape ? 61 : i === 3 && isHighveld ? 95 : 2;
    const condition = getWeatherConditionInfo(code);

    const athletic = evaluateAthleticConditions(
      maxT,
      minT,
      14,
      code === 61 ? 4.5 : 0,
      6.0
    );

    daily.push({
      date: dateStr,
      dayLabel: formatDayLabel(dateStr, i),
      weatherCode: code,
      weatherDescription: condition.description,
      weatherIconName: condition.iconName,
      tempMax: Math.round(maxT),
      tempMin: Math.round(minT),
      apparentTempMax: Math.round(maxT),
      apparentTempMin: Math.round(minT),
      precipitationSumMm: code === 61 ? 4.2 : 0,
      precipitationProbMax: code === 61 ? 75 : 15,
      windSpeedMaxKmh: isCape ? 22 : 14,
      windDirectionDeg: 180,
      uvIndexMax: 6.0,
      runningScore: athletic.score,
      runningScoreColor: athletic.color,
      gearRecommendation: athletic.gear,
      hourlySlots: [
        { time: '06:00', temp: Math.round(minT + 1), apparentTemp: Math.round(minT), humidity: 75, precipProb: 10, windSpeed: 10, weatherCode: code },
        { time: '09:00', temp: Math.round(minT + 4), apparentTemp: Math.round(minT + 3), humidity: 62, precipProb: 15, windSpeed: 12, weatherCode: code },
        { time: '12:00', temp: Math.round(maxT), apparentTemp: Math.round(maxT), humidity: 45, precipProb: 15, windSpeed: 15, weatherCode: code },
        { time: '15:00', temp: Math.round(maxT - 1), apparentTemp: Math.round(maxT - 1), humidity: 48, precipProb: 20, windSpeed: 14, weatherCode: code },
        { time: '18:00', temp: Math.round(maxT - 4), apparentTemp: Math.round(maxT - 4), humidity: 60, precipProb: 10, windSpeed: 10, weatherCode: code },
      ],
    });
  }

  return {
    latitude: lat,
    longitude: lng,
    city,
    timezone: 'Africa/Johannesburg',
    daily,
    fetchedAt: Date.now(),
    isFallback: true,
  };
}
