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

    if (!suggestionResult?.outfitSuggestion || suggestionResult.outfitSuggestion.trim() === '') {
      throw new Error("AI did not return a valid suggestion.");
    }
    
    // Use the outfit suggestion itself to find a visual
    const visualResult = await provideVisualInspiration({
      keywords: `${params.style} style ${suggestionResult.outfitSuggestion}`,
    });

    return {
      outfitSuggestion: suggestionResult.outfitSuggestion,
      imageUrl: visualResult.imageUrl,
    };

  } catch (error) {
    console.error("Error getting outfit suggestion, providing fallback:", error);
    // Return a default/error state
    const fallbackSuggestion = "一件舒適的T恤、牛仔褲和您最喜歡的運動鞋，打造經典造型。";
    const fallbackImageUrl = `https://images.unsplash.com/search/photos?query=${encodeURIComponent('t-shirt jeans sneakers')}`;

    return {
      outfitSuggestion: fallbackSuggestion,
      imageUrl: fallbackImageUrl,
    };
  }
}
