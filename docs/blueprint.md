# **App Name**: Stylecast

## Core Features:

- User Onboarding: Collect user preferences for style and context during the first visit, storing them in localStorage.
- Geolocation & Weather: Acquire the user's location via browser Geolocation API and fetch weather data for the next seven days from a weather API. If permission is denied, allow manual city input.
- Daily Outfit Recommendation: Generate outfit suggestions for the next seven days using a rules-based engine based on weather conditions and user preferences.
- Visual Inspiration Tool: Fetch style examples from Google Images based on the generated outfit keywords to provide visual inspiration. The tool should filter for reasonable images to return to the user.
- Weekly Forecast Display: Display a list of 'Daily Weather Outfit Cards,' each presenting the date, weather icon, temperature range, text-based outfit advice, and a Google Images-sourced style reference image.
- Context Switcher: Offer a dropdown or tabbed interface on each card that allows the user to switch between pre-selected contexts (daily commute, weekend outing, etc.) to view alternative outfit recommendations.

## Style Guidelines:

- Primary color: A soft sky blue (#87CEEB) to evoke a sense of calm and clarity, referencing the app's weather-related functionality. The intention is to avoid clichés of weather apps.
- Background color: Very light, desaturated blue (#F0F8FF). It remains in the same hue family as the primary color but with minimal saturation.
- Accent color: Pale purple (#D8BFD8) chosen for its slight contrast in brightness and saturation with the primary and background colors, providing a gentle and non-intrusive highlighting effect.
- Font pairing: 'Playfair' (serif) for headlines to convey elegance, paired with 'PT Sans' (sans-serif) for body text to ensure readability. Note: currently only Google Fonts are supported.
- Use clean and simple weather icons that are easily recognizable.
- Employ a card-based layout to present daily weather and outfit information in a structured manner.
- Subtle transitions when switching between contexts or loading new images.