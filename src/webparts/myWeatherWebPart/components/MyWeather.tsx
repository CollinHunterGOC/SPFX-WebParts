import * as React from 'react';
import { IMyWeatherProps } from './IMyWeatherProps';
import { IMyWeatherState } from './IMyWeatherState';
import styles from './MyWeather.module.scss';

export default class MyWeather extends React.Component<IMyWeatherProps, IMyWeatherState> {
  constructor(props: IMyWeatherProps) {
    super(props);
    this.state = { loading: true };
  }

  public componentDidMount(): void {
    this.loadWeather();
  }

  private async loadWeather(): Promise<void> {
    const { apiKey, units } = this.props;

    if (!apiKey || apiKey.trim().length === 0) {
      this.setState({ loading: false, error: 'OpenWeatherMap API key not provided. Set it in the web part properties.' });
      return;
    }

    try {
      const coords = await this.getCoordinates();
      if (!coords) {
        this.setState({ loading: false, error: 'Unable to determine location.' });
        return;
      }

      const weather = await this.fetchWeather(coords.latitude, coords.longitude, apiKey, units);
      if (!weather) {
        this.setState({ loading: false, error: 'Unable to retrieve weather data.' });
        return;
      }

      this.setState({
        loading: false,
        temp: weather.main?.temp,
        feels_like: weather.main?.feels_like,
        humidity: weather.main?.humidity,
        description: weather.weather?.[0]?.description,
        icon: weather.weather?.[0]?.icon,
        locationName: weather.name
      });
    } catch (err: any) {
      this.setState({ loading: false, error: err?.message || String(err) });
    }
  }

  private getCoordinates(): Promise<{ latitude: number; longitude: number } | null> {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        const geoSuccess = (position: GeolocationPosition) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        };
        const geoError = async () => {
          const ipCoords = await this.getCoordsFromIp();
          resolve(ipCoords);
        };
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError, { timeout: 10000 });
      } else {
        this.getCoordsFromIp().then(resolve).catch(() => resolve(null));
      }
    });
  }

  private async getCoordsFromIp(): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const resp = await fetch('https://ipapi.co/json/');
      if (!resp.ok) {
        return null;
      }
      const json = await resp.json();
      if (json && (json.latitude || json.lat) && (json.longitude || json.lon)) {
        return {
          latitude: Number(json.latitude || json.lat),
          longitude: Number(json.longitude || json.lon)
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  private async fetchWeather(lat: number, lon: number, apiKey: string, units: string = 'metric'): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=${encodeURIComponent(units)}&appid=${encodeURIComponent(apiKey)}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Weather API error: ${resp.status} ${resp.statusText} - ${text}`);
    }
    return resp.json();
  }

  public render(): React.ReactElement<IMyWeatherProps> {
    const { title } = this.props;
    const { loading, error, temp, description, icon, locationName, feels_like, humidity } = this.state;

    return (
      <div className={styles.weatherContainer}>
        <div className={styles.title}>{title || 'Current Weather'}</div>

        {loading && <div>Loading weather…</div>}

        {!loading && error && <div style={{ color: 'red' }}>{error}</div>}

        {!loading && !error && (
          <div>
            <div className={styles.row}>
              {icon && <img className={styles.icon} src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={description} />}
              <div>
                <div className={styles.temp}>{typeof temp === 'number' ? `${Math.round(temp)}°` : '--'}</div>
                <div className={styles.small}>{locationName || 'Your location'}</div>
                {description && <div className={styles.small}>{description}</div>}
              </div>
            </div>

            <div style={{ marginTop: 8 }} className={styles.small}>
              {typeof feels_like === 'number' && <div>Feels like: {Math.round(feels_like)}°</div>}
              {typeof humidity === 'number' && <div>Humidity: {humidity}%</div>}
            </div>
          </div>
        )}
      </div>
    );
  }
}