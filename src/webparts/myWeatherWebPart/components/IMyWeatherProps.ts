export interface IMyWeatherProps {
  apiKey: string;
  units: 'metric' | 'imperial' | 'standard';
  title?: string;
}