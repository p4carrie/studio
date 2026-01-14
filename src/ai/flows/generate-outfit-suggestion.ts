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
  outfitSuggestion: z.string().describe('A single, concise sentence for an outfit. For example: "A light blue linen shirt, beige chino shorts, and white sneakers."'),
});
export type GenerateOutfitSuggestionOutput = z.infer<typeof GenerateOutfitSuggestionOutputSchema>;

export async function generateOutfitSuggestion(input: GenerateOutfitSuggestionInput): Promise<GenerateOutfitSuggestionOutput> {
  return generateOutfitSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOutfitSuggestionPrompt',
  input: {schema: GenerateOutfitSuggestionInputSchema},
  output: {schema: GenerateOutfitSuggestionOutputSchema},
  prompt: `You are a personal stylist. Given the weather, temperature, style, and context, suggest an outfit.

Weather: {{{weatherCondition}}}
Temperature: {{{temperature}}}°C
Style: {{{stylePreference}}}
Context: {{{contextPreference}}}

Provide a single, concise sentence describing a complete outfit.
Example: "A light blue linen shirt, beige chino shorts, and white sneakers."
Example: "A black wool coat, a grey turtleneck sweater, dark wash jeans, and leather boots."
`,
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
