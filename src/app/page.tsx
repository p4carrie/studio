'use client';

import { useState, useEffect } from 'react';
import Onboarding from '@/components/onboarding';
import WeatherDashboard from '@/components/weather-dashboard';
import type { UserPreferences } from '@/lib/types';
import { Loader } from '@/components/loader';

export default function Home() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem('stylecast-preferences');
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    } catch (error) {
      console.error("Could not parse user preferences, clearing storage.", error);
      localStorage.removeItem('stylecast-preferences');
    }
    setIsLoading(false);
  }, []);

  const handlePreferencesSave = (newPrefs: UserPreferences) => {
    try {
      localStorage.setItem('stylecast-preferences', JSON.stringify(newPrefs));
      setPreferences(newPrefs);
    } catch (error) {
      console.error("Failed to save preferences", error);
    }
  };
  
  const handleResetPreferences = () => {
    localStorage.removeItem('stylecast-preferences');
    setPreferences(null);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <Loader className="w-12 h-12 text-primary" />
        <h1 className="mt-4 text-2xl font-headline text-foreground">Stylecast</h1>
        <p className="text-muted-foreground">Loading your style...</p>
      </div>
    );
  }
  
  if (!preferences) {
    return <Onboarding onSave={handlePreferencesSave} />;
  }

  return <WeatherDashboard preferences={preferences} onResetPreferences={handleResetPreferences} />;
}
