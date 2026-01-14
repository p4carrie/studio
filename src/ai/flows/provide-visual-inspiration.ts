'use server';

/**
 * @fileOverview Provides visual inspiration by fetching style examples from Google Images based on outfit keywords.
 *
 * - provideVisualInspiration - A function that fetches style examples.
 * - ProvideVisualInspirationInput - The input type for the provideVisualInspiration function.
 * - ProvideVisualInspirationOutput - The return type for the provideVisualInspiration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
    // For this MVP, we are not using a sophisticated image search tool.
    // We construct a URL that searches on Unsplash, a free image provider.
    // In a real application, you might use a specific image search API for more control.
    const imageUrl = `https://images.unsplash.com/search/photos?query=${encodeURIComponent(input.keywords)}`;
    return { imageUrl };
  }
);
