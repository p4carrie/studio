import type { LucideProps } from 'lucide-react';
import { Sun, Cloud, CloudRain, CloudSun, Snowflake, CloudFog } from 'lucide-react';
import type { WeatherCondition } from '@/lib/types';

interface WeatherIconProps extends LucideProps {
    condition: WeatherCondition;
}

export function WeatherIcon({ condition, ...props }: WeatherIconProps) {
  switch (condition) {
    case 'Sunny':
      return <Sun {...props} />;
    case 'Cloudy':
      return <Cloud {...props} />;
    case 'Rainy':
      return <CloudRain {...props} />;
    case 'PartlyCloudy':
      return <CloudSun {...props} />;
    case 'Snowy':
      return <Snowflake {...props} />;
    default:
      return <CloudFog {...props} />;
  }
}
