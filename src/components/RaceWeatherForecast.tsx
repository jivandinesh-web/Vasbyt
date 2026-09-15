import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchRaceWeatherForecast,
  RaceForecastResult,
  DailyForecast,
} from '../utils/weatherApi';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Clock,
  Sparkles,
  Info,
  Flame,
  ChevronRight,
} from 'lucide-react';

interface RaceWeatherForecastProps {
  raceName: string;
  city: string;
  province?: string;
  latitude?: number;
  longitude?: number;
  raceDate?: string; // YYYY-MM-DD or formatted date string
  discipline?: string;
  idPrefix?: string;
  className?: string;
}

export const RaceWeatherForecast: React.FC<RaceWeatherForecastProps> = ({
  raceName,
  city,
  province = '',
  latitude,
  longitude,
  raceDate = '',
  discipline = 'road',
  idPrefix = 'race-weather',
  className = '',
}) => {
  // Coordinates fallback if not provided: default to Cape Town / JHB based on province
  const defaultLat = province?.toLowerCase() === 'wc' ? -33.9249 : -26.2041;
  const defaultLng = province?.toLowerCase() === 'wc' ? 18.4241 : 28.0473;
  const effectiveLat = latitude ?? defaultLat;
  const effectiveLng = longitude ?? defaultLng;

  const [forecast, setForecast] = useState<RaceForecastResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadForecast = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) setIsRefreshing(true);
        else setLoading(true);
        setError(null);

        const data = await fetchRaceWeatherForecast(effectiveLat, effectiveLng, city || raceName);
        setForecast(data);
      } catch (err: any) {
        console.error('Failed to load Open-Meteo forecast:', err);
        setError('Weather data temporarily unavailable.');
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [effectiveLat, effectiveLng, city, raceName]
  );

  useEffect(() => {
    loadForecast();
  }, [loadForecast]);

  const renderWeatherIcon = (
    iconName: DailyForecast['weatherIconName'],
    sizeClass = 'w-6 h-6'
  ) => {
    switch (iconName) {
      case 'sun':
        return <Sun className={`${sizeClass} text-[#e28b37] animate-pulse`} />;
      case 'cloud-sun':
        return <CloudSun className={`${sizeClass} text-[#d8b34a]`} />;
      case 'cloud':
        return <Cloud className={`${sizeClass} text-[#9aa1ac]`} />;
      case 'cloud-rain':
        return <CloudRain className={`${sizeClass} text-[#58a6ff]`} />;
      case 'cloud-drizzle':
        return <CloudDrizzle className={`${sizeClass} text-[#79c0ff]`} />;
      case 'cloud-lightning':
        return <CloudLightning className={`${sizeClass} text-[#d29922]`} />;
      case 'cloud-fog':
        return <CloudFog className={`${sizeClass} text-[#8b949e]`} />;
      default:
        return <Sun className={`${sizeClass} text-[#e28b37]`} />;
    }
  };

  // Helper to check if a forecast date aligns with race date
  const isTargetRaceDate = (dateStr: string) => {
    if (!raceDate) return false;
    // check match with YYYY-MM-DD or date substring
    return raceDate.includes(dateStr) || dateStr.includes(raceDate);
  };

  const selectedDay = forecast?.daily[selectedDayIndex] || forecast?.daily[0];

  return (
    <div
      id={`${idPrefix}-root`}
      className={`neu-card rounded-xs p-4 sm:p-5 text-[#f5efe3] select-none ${className}`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 mb-3 border-b border-[#2c333f]/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xs neu-inset flex items-center justify-center text-[#e28b37]">
            <CloudSun className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#d8b34a]">
                5-Day Race Weather Forecast
              </h4>
              <span className="text-[10px] text-[#7c8f5c] font-mono font-bold bg-[#7c8f5c]/15 px-1.5 py-0.5 rounded-xs border border-[#7c8f5c]/30">
                Open-Meteo
              </span>
            </div>
            <p className="text-[11px] text-[#9aa1ac]">
              {city || 'Course Location'}
              {province ? `, ${province.toUpperCase()}` : ''} · {effectiveLat.toFixed(2)}°S,{' '}
              {effectiveLng.toFixed(2)}°E
            </p>
          </div>
        </div>

        {/* Live Status & Refresh Button */}
        <div className="flex items-center gap-2">
          {forecast?.current && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xs neu-inset-sm text-xs font-mono">
              <Thermometer className="w-3.5 h-3.5 text-[#e28b37]" />
              <span className="font-bold text-[#f5efe3]">{forecast.current.temp}°C</span>
              <span className="text-[10.5px] text-[#9aa1ac]">
                Feels {forecast.current.apparentTemp}°C
              </span>
            </div>
          )}

          <button
            type="button"
            id={`${idPrefix}-refresh-btn`}
            onClick={() => loadForecast(true)}
            disabled={isRefreshing}
            title="Refresh latest Open-Meteo satellite & model forecast"
            className="neu-btn px-2.5 py-1.5 rounded-xs text-xs font-semibold flex items-center gap-1 text-[#9aa1ac] hover:text-[#f5efe3] cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#e28b37]' : ''}`} />
            <span className="hidden md:inline">Sync</span>
          </button>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="neu-inset rounded-xs p-6 flex flex-col items-center justify-center gap-2 text-center my-2">
          <RefreshCw className="w-6 h-6 text-[#e28b37] animate-spin" />
          <p className="text-xs text-[#9aa1ac]">Connecting to Open-Meteo atmospheric radar...</p>
        </div>
      )}

      {error && !loading && (
        <div className="neu-inset rounded-xs p-4 flex items-center gap-3 text-xs text-[#b5502f] border border-[#b5502f]/40 my-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => loadForecast(true)}
            className="ml-auto underline text-[#f5efe3] cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Forecast Content */}
      {forecast && !loading && (
        <div className="space-y-4">
          {/* 5-Day Interactive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {forecast.daily.map((day, idx) => {
              const isSelected = idx === selectedDayIndex;
              const isRace = isTargetRaceDate(day.date);

              return (
                <button
                  key={day.date}
                  type="button"
                  id={`${idPrefix}-day-${idx}`}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`text-left p-3 rounded-xs transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'neu-inset border border-[#e28b37]/60 ring-1 ring-[#e28b37]/30 bg-[#161c26]'
                      : 'neu-card-sm hover:border-[#6d7580] hover:bg-[#1a212d]'
                  }`}
                >
                  {/* Race Day Badge Indicator */}
                  {isRace && (
                    <div className="absolute top-0 right-0 bg-[#e28b37] text-[#1a0f02] text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-bl-xs shadow-xs flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Race</span>
                    </div>
                  )}

                  {/* Day Title & Date */}
                  <div>
                    <span
                      className={`text-[11px] font-bold block truncate uppercase tracking-wider ${
                        isSelected ? 'text-[#e28b37]' : 'text-[#f5efe3]'
                      }`}
                    >
                      {day.dayLabel}
                    </span>
                    <span className="text-[9.5px] text-[#6d7580] block font-mono">
                      {day.date.slice(5)}
                    </span>
                  </div>

                  {/* Weather Icon & Brief Condition */}
                  <div className="my-2 flex items-center gap-2">
                    {renderWeatherIcon(day.weatherIconName, 'w-6 h-6 shrink-0')}
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-[#f5efe3] block">
                        {day.tempMax}°<span className="text-[#6d7580] text-[10px]"> / {day.tempMin}°</span>
                      </span>
                      <span className="text-[10px] text-[#9aa1ac] block truncate">
                        {day.weatherDescription}
                      </span>
                    </div>
                  </div>

                  {/* Rain Probability & Wind preview */}
                  <div className="flex items-center justify-between text-[10px] text-[#6d7580] pt-1.5 border-t border-[#2c333f]/40 font-mono">
                    <span className="flex items-center gap-0.5">
                      <Droplets className="w-3 h-3 text-[#58a6ff]" />
                      {day.precipitationProbMax}%
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Wind className="w-3 h-3 text-[#7c8f5c]" />
                      {day.windSpeedMaxKmh}k/h
                    </span>
                  </div>

                  {/* Athletic Condition Pill */}
                  <div className="mt-2">
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-xs block text-center truncate"
                      style={{
                        backgroundColor: `${day.runningScoreColor}20`,
                        color: day.runningScoreColor,
                        border: `1px solid ${day.runningScoreColor}40`,
                      }}
                    >
                      {day.runningScore}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Day Detailed Inset Panel */}
          {selectedDay && (
            <div
              id={`${idPrefix}-selected-detail`}
              className="neu-inset rounded-xs p-4 border border-[#2c333f] space-y-3.5 animate-in fade-in duration-200"
            >
              {/* Selected Day Header */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#2c333f]/60">
                <div className="flex items-center gap-2.5">
                  {renderWeatherIcon(selectedDay.weatherIconName, 'w-7 h-7')}
                  <div>
                    <h5 className="text-sm font-bold text-[#f5efe3] flex items-center gap-2">
                      <span>
                        {selectedDay.dayLabel} ({selectedDay.date})
                      </span>
                      <span className="text-xs text-[#d8b34a] font-normal">
                        · {selectedDay.weatherDescription}
                      </span>
                    </h5>
                    <p className="text-[11px] text-[#9aa1ac]">
                      Expected High: <b className="text-[#e28b37]">{selectedDay.tempMax}°C</b> (Feels{' '}
                      {selectedDay.apparentTempMax}°C) · Overnight Low:{' '}
                      <b className="text-[#58a6ff]">{selectedDay.tempMin}°C</b>
                    </p>
                  </div>
                </div>

                {/* Readiness Score */}
                <div
                  className="px-3 py-1 rounded-xs font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
                  style={{
                    backgroundColor: `${selectedDay.runningScoreColor}22`,
                    color: selectedDay.runningScoreColor,
                    border: `1px solid ${selectedDay.runningScoreColor}50`,
                  }}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Race Condition: {selectedDay.runningScore}</span>
                </div>
              </div>

              {/* Key Environmental Metrics Grid (Tactile Neumorphic Buttons/Boxes) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Wind */}
                <div className="neu-card-sm p-2.5 rounded-xs">
                  <span className="text-[10px] uppercase font-bold text-[#6d7580] flex items-center gap-1 mb-1">
                    <Wind className="w-3.5 h-3.5 text-[#7c8f5c]" />
                    Peak Wind
                  </span>
                  <div className="text-sm font-bold text-[#f5efe3]">
                    {selectedDay.windSpeedMaxKmh}{' '}
                    <span className="text-[10px] text-[#9aa1ac] font-normal">km/h</span>
                  </div>
                  <span className="text-[10px] text-[#9aa1ac] block truncate">
                    {selectedDay.windSpeedMaxKmh > 25
                      ? 'Challenging crosswinds'
                      : selectedDay.windSpeedMaxKmh > 15
                      ? 'Gentle breeze'
                      : 'Calm air'}
                  </span>
                </div>

                {/* Precipitation */}
                <div className="neu-card-sm p-2.5 rounded-xs">
                  <span className="text-[10px] uppercase font-bold text-[#6d7580] flex items-center gap-1 mb-1">
                    <Droplets className="w-3.5 h-3.5 text-[#58a6ff]" />
                    Precipitation
                  </span>
                  <div className="text-sm font-bold text-[#f5efe3]">
                    {selectedDay.precipitationSumMm}{' '}
                    <span className="text-[10px] text-[#9aa1ac] font-normal">mm</span>
                  </div>
                  <span className="text-[10px] text-[#9aa1ac] block truncate">
                    {selectedDay.precipitationProbMax}% probability
                  </span>
                </div>

                {/* UV Index */}
                <div className="neu-card-sm p-2.5 rounded-xs">
                  <span className="text-[10px] uppercase font-bold text-[#6d7580] flex items-center gap-1 mb-1">
                    <Sun className="w-3.5 h-3.5 text-[#e28b37]" />
                    UV Radiation
                  </span>
                  <div className="text-sm font-bold text-[#f5efe3]">
                    UV {selectedDay.uvIndexMax}
                  </div>
                  <span className="text-[10px] text-[#9aa1ac] block truncate">
                    {selectedDay.uvIndexMax >= 8
                      ? 'Very High (SPF 50+)'
                      : selectedDay.uvIndexMax >= 6
                      ? 'High Sun (Cap required)'
                      : 'Moderate radiation'}
                  </span>
                </div>

                {/* Athlete Thermal Rating */}
                <div className="neu-card-sm p-2.5 rounded-xs">
                  <span className="text-[10px] uppercase font-bold text-[#6d7580] flex items-center gap-1 mb-1">
                    <Flame className="w-3.5 h-3.5 text-[#b5502f]" />
                    Pacing Impact
                  </span>
                  <div className="text-sm font-bold text-[#f5efe3]">
                    {selectedDay.tempMax > 24
                      ? '+5 to 15s / km'
                      : selectedDay.tempMax < 14
                      ? 'PB Potential'
                      : 'Standard Pace'}
                  </div>
                  <span className="text-[10px] text-[#9aa1ac] block truncate">
                    {discipline === 'cycling' ? 'Tire pressure check' : 'Electrolyte pacing'}
                  </span>
                </div>
              </div>

              {/* Race Gear & Nutrition Recommendation */}
              <div className="bg-[#12161f] border border-[#2c333f]/70 p-3 rounded-xs flex items-start gap-2.5 text-xs">
                <Info className="w-4 h-4 text-[#e28b37] shrink-0 mt-0.5" />
                <div>
                  <b className="text-[#f5efe3] block">
                    {discipline === 'cycling' ? 'Peloton & Equipment Tip' : 'Runner Advice'}:
                  </b>
                  <span className="text-[#9aa1ac] leading-relaxed">
                    {selectedDay.gearRecommendation}
                  </span>
                </div>
              </div>

              {/* Hourly Timeline for Race Day Simulation */}
              {selectedDay.hourlySlots && selectedDay.hourlySlots.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[10.5px] font-bold text-[#6d7580] uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#e28b37]" />
                      Race Progression By Time of Day
                    </span>
                    <span>Start line (06:00) to Cut-off (Midday)</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {selectedDay.hourlySlots.map((slot, sIdx) => {
                      const isMorningStart = slot.time === '06:00';
                      return (
                        <div
                          key={sIdx}
                          className={`p-2 rounded-xs text-center border ${
                            isMorningStart
                              ? 'neu-inset border-[#e28b37]/50 bg-[#1f1a14]'
                              : 'neu-card-sm border-[#2c333f]'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-[10px] font-bold text-[#d8b34a]">
                              {slot.time}
                            </span>
                            {isMorningStart && (
                              <span className="text-[8.5px] bg-[#e28b37] text-[#1a0f02] font-black px-1 rounded-xs">
                                GUN
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-bold text-[#f5efe3] my-1">
                            {slot.temp}°C
                          </div>
                          <div className="text-[9.5px] text-[#9aa1ac] flex items-center justify-center gap-1 font-mono">
                            <Wind className="w-2.5 h-2.5 text-[#7c8f5c]" />
                            {slot.windSpeed}k/h
                          </div>
                          <div className="text-[9px] text-[#6d7580] flex items-center justify-center gap-0.5 mt-0.5">
                            <Droplets className="w-2.5 h-2.5 text-[#58a6ff]" />
                            {slot.precipProb}% rain
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
