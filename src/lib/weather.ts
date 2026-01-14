import { addDays, format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import type { Location, WeatherData, WeatherCondition } from '@/lib/types';

const weatherConditions: WeatherCondition[] = ['Sunny', 'PartlyCloudy', 'Cloudy', 'Rainy', 'Snowy'];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getCityName(location: Location): string {
    if (location.city) {
        return location.city;
    }
    // In a real app, you would use a reverse geocoding service.
    if(location.latitude && location.longitude){
        if (location.latitude > 30) return '台北';
        return '高雄';
    }
    return '台北';
}

// Mock function to get weather forecast
export async function getWeeklyForecast(location: Location): Promise<{ city: string, forecast: WeatherData[] }> {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));

  const city = getCityName(location);

  const forecast: WeatherData[] = [];
  const today = new Date();
  let lastTemp = 18 + Math.random() * 10; // Start with a random temp between 18 and 28

  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    
    // Make temperature changes smoother
    const tempChange = (Math.random() - 0.5) * 4;
    const tempMax = Math.round(Math.min(35, Math.max(5, lastTemp + tempChange + Math.random() * 2)));
    const tempMin = Math.round(tempMax - (3 + Math.random() * 5));
    lastTemp = (tempMax + tempMin) / 2;
    
    let weatherCondition: WeatherCondition = getRandomElement(weatherConditions);
    // Simple logic to make weather more realistic
    if (tempMin < 5 && weatherCondition !== 'Rainy') {
        weatherCondition = 'Snowy';
    } else if (tempMin < 10 && weatherCondition === 'Snowy') {
        weatherCondition = 'Cloudy';
    } else if (tempMax > 30) {
        weatherCondition = Math.random() > 0.3 ? 'Sunny' : 'PartlyCloudy';
    }

    forecast.push({
      date,
      dayOfWeek: format(date, 'EEEE', { locale: zhTW }),
      weatherCondition,
      tempMin,
      tempMax,
    });
  }

  return { city, forecast };
}
