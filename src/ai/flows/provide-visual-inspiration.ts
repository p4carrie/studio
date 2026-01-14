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

const provideVisualInspirationPrompt = ai.definePrompt({
  name: 'provideVisualInspirationPrompt',
  input: {schema: ProvideVisualInspirationInputSchema},
  output: {schema: ProvideVisualInspirationOutputSchema},
  prompt: `You are an AI assistant designed to find a single relevant style reference image URL, given keywords.

  Return just the URL. Do not return markdown or any other text.

  The keywords to use for the image search are: {{{keywords}}}`,
});

const provideVisualInspirationFlow = ai.defineFlow(
  {
    name: 'provideVisualInspirationFlow',
    inputSchema: ProvideVisualInspirationInputSchema,
    outputSchema: ProvideVisualInspirationOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      prompt: provideVisualInspirationPrompt,
      model: 'googleai/multimodal-embedding',
    });
    if (!output) {
      throw new Error('No image URL found.');
    }
    return {imageUrl: output.text};
  }
);
