'use server';

import { generateOutfitSuggestion } from '@/ai/flows/generate-outfit-suggestion';
import { provideVisualInspiration } from '@/ai/flows/provide-visual-inspiration';
import type { WeatherData, StylePreference, ContextPreference, OutfitData } from '@/lib/types';

interface GetOutfitForContextParams {
  weather: WeatherData;
  style: StylePreference;
  context: ContextPreference;
}

export async function getOutfitForContext(params: GetOutfitForContextParams): Promise<OutfitData> {
  try {
    const suggestionResult = await generateOutfitSuggestion({
      temperature: (params.weather.tempMin + params.weather.tempMax) / 2,
      weatherCondition: params.weather.weatherCondition,
      stylePreference: params.style,
      contextPreference: [params.context],
    });

    if (!suggestionResult?.outfitSuggestion || !suggestionResult?.imageKeywords) {
      // This will be caught by the catch block below
      throw new Error("AI did not return a valid suggestion or keywords.");
    }
    
    const visualResult = await provideVisualInspiration({
      keywords: `${params.style} style ${suggestionResult.imageKeywords}`,
    });

    return {
      outfitSuggestion: suggestionResult.outfitSuggestion,
      imageUrl: visualResult.imageUrl,
    };

  } catch (error) {
    console.error("Error getting outfit suggestion:", error);
    // Return a default/error state
    return {
      outfitSuggestion: "抱歉，無法生成建議。請稍後再試。",
      imageUrl: `https://picsum.photos/seed/error/600/800`,
    };
  }
}
