'use client'

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { WeatherIcon } from '@/components/weather-icon';
import { getOutfitForContext } from '@/app/actions';
import { CONTEXT_OPTIONS } from '@/lib/constants';
import type { DailyForecast, UserPreferences, ContextPreference } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

interface OutfitCardProps {
  forecast: DailyForecast;
  preferences: UserPreferences;
}

export default function OutfitCard({ forecast, preferences }: OutfitCardProps) {
  const [isPending, startTransition] = useTransition();
  const [currentOutfit, setCurrentOutfit] = useState(forecast.outfit);
  const [activeContext, setActiveContext] = useState(forecast.context);

  const userContexts = CONTEXT_OPTIONS.filter(option => preferences.contexts.includes(option.id));

  const handleContextChange = (newContext: string) => {
    if (newContext === activeContext) return;

    setActiveContext(newContext);
    startTransition(async () => {
      const result = await getOutfitForContext({
        weather: forecast.weather,
        style: preferences.style,
        context: newContext as ContextPreference,
      });

      if (result.outfitSuggestion.includes('抱歉')) {
        toast({
          variant: "destructive",
          title: "AI 建議生成失敗",
          description: "請稍後再試或選擇其他情境。",
        });
      }
      setCurrentOutfit(result);
    });
  };

  return (
    <Card className="w-full overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-2xl tracking-wide">{format(forecast.weather.date, 'MM/dd')}</CardTitle>
            <p className="text-muted-foreground">{forecast.weather.dayOfWeek}</p>
          </div>
          <div className="flex items-center gap-2 text-right">
             <div className="font-semibold text-lg">
                <span className="text-red-500">{forecast.weather.tempMax}°</span>
                <span className="text-blue-500"> / {forecast.weather.tempMin}°C</span>
             </div>
             <WeatherIcon condition={forecast.weather.weatherCondition} className="w-8 h-8 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={forecast.context} onValueChange={handleContextChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            {userContexts.map((context) => (
              <TabsTrigger key={context.id} value={context.id} disabled={isPending}>
                {context.label}
              </TabsTrigger>
            ))}
          </TabsList>
            <div className="mt-4 rounded-lg border bg-card text-card-foreground p-4 min-h-[480px]">
              {isPending ? (
                <div className="space-y-4">
                  <Skeleton className="h-[300px] w-full rounded-md" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              ) : (
                <div className="animate-in fade-in duration-500">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md mb-4">
                     <Image
                      src={currentOutfit.imageUrl}
                      alt={`Style reference for ${currentOutfit.outfitSuggestion}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint="fashion style"
                    />
                  </div>
                  <p className="text-lg font-medium leading-relaxed">{currentOutfit.outfitSuggestion}</p>
                </div>
              )}
            </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
