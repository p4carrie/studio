import type { CONTEXT_OPTIONS, STYLE_OPTIONS } from './constants';

export type StylePreference = (typeof STYLE_OPTIONS)[number]['id'];
export type ContextPreference = (typeof CONTEXT_OPTIONS)[number]['id'];

export type UserPreferences = {
  style: StylePreference;
  contexts: ContextPreference[];
};

export type Location = {
  latitude: number;
  longitude: number;
  city?: string;
} | {
  latitude?: undefined;
  longitude?: undefined;
  city: string;
};

export type WeatherCondition = 'Sunny' | 'PartlyCloudy' | 'Cloudy' | 'Rainy' | 'Snowy';

export type WeatherData = {
  date: Date;
  dayOfWeek: string;
  weatherCondition: WeatherCondition;
  tempMin: number;
  tempMax: number;
};

export type OutfitData = {
  outfitSuggestion: string;
  imageUrl: string;
};

export type DailyForecast = {
  weather: WeatherData;
  outfit: OutfitData;
  context: string;
};
