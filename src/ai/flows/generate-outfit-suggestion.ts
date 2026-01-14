'use server';

/**
 * @fileOverview Outfit suggestion AI agent.
 *
 * - generateOutfitSuggestion - A function that handles the outfit suggestion process.
 * - GenerateOutfitSuggestionInput - The input type for the generateOutfitSuggestion function.
 * - GenerateOutfitSuggestionOutput - The return type for the generateOutfitSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOutfitSuggestionInputSchema = z.object({
  temperature: z.number().describe('The temperature in Celsius.'),
  weatherCondition: z.string().describe('The current weather condition (e.g., sunny, cloudy, rainy).'),
  stylePreference: z.string().describe('The user\'s preferred style (e.g., male, female).'),
  contextPreference: z.array(z.string()).describe('The user\'s preferred contexts (e.g., daily commute, weekend outing).'),
});
export type GenerateOutfitSuggestionInput = z.infer<typeof GenerateOutfitSuggestionInputSchema>;

const GenerateOutfitSuggestionOutputSchema = z.object({
  outfitSuggestion: z.string().describe('The outfit suggestion based on the input parameters.'),
  imageKeywords: z.string().describe('Keywords to use for searching for a reference image.'),
});
export type GenerateOutfitSuggestionOutput = z.infer<typeof GenerateOutfitSuggestionOutputSchema>;

export async function generateOutfitSuggestion(input: GenerateOutfitSuggestionInput): Promise<GenerateOutfitSuggestionOutput> {
  return generateOutfitSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOutfitSuggestionPrompt',
  input: {schema: GenerateOutfitSuggestionInputSchema},
  output: {schema: GenerateOutfitSuggestionOutputSchema},
  prompt: `You are a personal stylist. Given the weather conditions, temperature, user style preferences, and context, suggest an appropriate outfit.

Weather Condition: {{{weatherCondition}}}
Temperature: {{{temperature}}}°C
Style Preference: {{{stylePreference}}}
Context Preference: {{{contextPreference}}}

Provide a concise outfit suggestion and keywords for a reference image search.

Outfit Suggestion: 
Image Keywords: `,
});

const generateOutfitSuggestionFlow = ai.defineFlow(
  {
    name: 'generateOutfitSuggestionFlow',
    inputSchema: GenerateOutfitSuggestionInputSchema,
    outputSchema: GenerateOutfitSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
