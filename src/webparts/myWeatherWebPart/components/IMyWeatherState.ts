export interface IMyWeatherState {
  loading: boolean;
  error?: string;
  temp?: number;
  feels_like?: number;
  humidity?: number;
  description?: string;
  icon?: string;
  locationName?: string;
}