'use server';

/**
 * @fileOverview Provides visual inspiration by fetching style examples from Unsplash.
 *
 * - provideVisualInspiration - A function that fetches style examples.
 * - ProvideVisualInspirationInput - The input type for the provideVisualInspiration function.
 * - ProvideVisualInspirationOutput - The return type for the provideVisualInspiration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as unsplash from 'unsplash-js';

const unsplashApi = unsplash.createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || '',
});

const ProvideVisualInspirationInputSchema = z.object({
  keywords: z
    .string()
    .describe("Keywords used to search for images, e.g., 'men's casual long sleeve shirt khaki pants'."),
});
export type ProvideVisualInspirationInput = z.infer<
  typeof ProvideVisualInspirationInputSchema
>;

const ProvideVisualInspirationOutputSchema = z.object({
  imageUrl: z.string().describe('URL of the style reference image.'),
});
export type ProvideVisualInspirationOutput = z.infer<
  typeof ProvideVisualInspirationOutputSchema
>;

export async function provideVisualInspiration(
  input: ProvideVisualInspirationInput
): Promise<ProvideVisualInspirationOutput> {
  return provideVisualInspirationFlow(input);
}

const provideVisualInspirationFlow = ai.defineFlow(
  {
    name: 'provideVisualInspirationFlow',
    inputSchema: ProvideVisualInspirationInputSchema,
    outputSchema: ProvideVisualInspirationOutputSchema,
  },
  async input => {
    try {
      const result = await unsplashApi.search.getPhotos({
        query: input.keywords,
        page: 1,
        perPage: 1,
        orientation: 'portrait',
        contentFilter: 'high',
      });

      if (result.errors) {
        console.error('Unsplash API error:', result.errors);
        throw new Error('Failed to fetch image from Unsplash.');
      }

      const photo = result.response?.results[0];

      if (!photo) {
        // Fallback to a generic search if no specific results
        return { imageUrl: `https://images.unsplash.com/search/photos?query=${encodeURIComponent('fashion ' + input.keywords)}` };
      }
      
      // Use the 'regular' size for a good balance of quality and size
      return { imageUrl: photo.urls.regular };

    } catch (error) {
      console.error('Error in provideVisualInspirationFlow:', error);
      // Provide a fallback picsum URL in case of any error
      return { imageUrl: `https://picsum.photos/seed/${input.keywords.replace(/\s+/g, '-')}/600/800` };
    }
  }
);
