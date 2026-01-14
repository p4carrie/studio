'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getWeeklyForecast } from '@/lib/weather';
import { getOutfitForContext } from '@/app/actions';
import type { DailyForecast, Location, UserPreferences, ContextPreference } from '@/lib/types';
import { Loader } from '@/components/loader';
import OutfitCard from './outfit-card';
import { MapPin, Settings, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CONTEXT_OPTIONS } from '@/lib/constants';

interface WeatherDashboardProps {
  preferences: UserPreferences;
  onResetPreferences: () => void;
}

const citySchema = z.object({
  city: z.string().min(1, { message: '請輸入城市名稱' }),
});

export default function WeatherDashboard({ preferences, onResetPreferences }: WeatherDashboardProps) {
  const [location, setLocation] = useState<Location | null>(null);
  const [forecasts, setForecasts] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState<string>('');

  const cityForm = useForm<z.infer<typeof citySchema>>({
    resolver: zodResolver(citySchema),
    defaultValues: { city: '' },
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (geoError) => {
        console.warn('Geolocation failed:', geoError.message);
        setError('無法自動獲取您的位置。請手動輸入城市。');
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!location) return;

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { city, forecast: weatherForecast } = await getWeeklyForecast(location);
        setCurrentCity(city);

        const today = new Date().getDay(); // 0 for Sunday, 1 for Monday...
        
        const outfitPromises = weatherForecast.map((weather, index) => {
          const dayOfWeek = (today + index) % 7;
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          
          let defaultContext: ContextPreference = 'daily-commute';
          const workContexts = CONTEXT_OPTIONS.filter(c => c.isWork && preferences.contexts.includes(c.id));
          const leisureContexts = CONTEXT_OPTIONS.filter(c => !c.isWork && preferences.contexts.includes(c.id));

          if (isWeekend && leisureContexts.length > 0) {
            defaultContext = leisureContexts[0].id as ContextPreference;
          } else if (!isWeekend && workContexts.length > 0) {
            defaultContext = workContexts[0].id as ContextPreference;
          } else if (preferences.contexts.length > 0) {
            defaultContext = preferences.contexts[0] as ContextPreference;
          }

          return getOutfitForContext({ weather, style: preferences.style, context: defaultContext })
            .then(outfit => ({ weather, outfit, context: defaultContext }));
        });

        const dailyForecasts = await Promise.all(outfitPromises);
        setForecasts(dailyForecasts);
      } catch (err) {
        setError('無法獲取天氣或穿搭建議，請稍後再試。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [location, preferences]);

  const handleCitySubmit = (data: z.infer<typeof citySchema>) => {
    setLocation({ city: data.city });
    cityForm.reset();
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-headline text-foreground">Stylecast</h1>
            {currentCity && <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md">
                <MapPin className="w-4 h-4" />
                <span>{currentCity}</span>
            </div>}
          </div>
          <Button variant="ghost" size="icon" onClick={onResetPreferences}>
            <Settings className="w-5 h-5" />
            <span className="sr-only">重設偏好設定</span>
          </Button>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6">
        {loading && (
          <div className="text-center py-20">
            <Loader className="w-12 h-12 mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">正在為您準備個人化的穿搭建議...</p>
          </div>
        )}
        
        {error && !loading && (
          <Card className="max-w-md mx-auto my-10">
            <CardHeader>
              <CardTitle>需要您的位置</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...cityForm}>
                <form onSubmit={cityForm.handleSubmit(handleCitySubmit)} className="flex items-center gap-2">
                  <FormField
                    control={cityForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="例如：東京" {...field} className="pl-9" />
                          </div>
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">搜尋</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
        
        {!loading && !error && forecasts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {forecasts.map((forecast, index) => (
              <OutfitCard key={index} forecast={forecast} preferences={preferences} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
