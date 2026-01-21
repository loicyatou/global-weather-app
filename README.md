# 🌦️ bright.weather

A clean, modern weather application built with React and TypeScript, focused on clarity, reliability, and strong architectural boundaries.

This project was built as a technical exercise with an emphasis on:
- Sensible separation of concerns
- Predictable state flow
- Readable, maintainable UI
- Minimal but meaningful testing


# ✨ Features

- Search weather by city name
- Automatic geolocation on first load (with graceful fallback)
- Dynamic full-screen background based on weather conditions
- Recent locations (last 4 searches, de-duplicated)
- Clear separation between UI, services, and API clients
- Lightweight test coverage for core logic


# 🧱 Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Vitest (unit testing)


# 🧭 Architecture Overview

The app is structured to keep responsibilities clear and isolated.

UI Components  
Focused purely on rendering and user interaction.

Service Layer  
Handles business logic such as fetching and interpreting weather data.

API Client  
A thin wrapper around Axios that:
- Applies base URLs
- Injects default query parameters (e.g. API keys)
- Normalises error handling

Mappers / Guards  
Convert external API responses into stable, app-level domain models.

This approach keeps the UI decoupled from external APIs and makes the core logic easy to test.


# 🌍 Weather Data Source

Weather data is provided by OpenWeather:
- Geocoding API (city → coordinates)
- Current Weather API

Background images are mapped locally based on high-level weather conditions (e.g. clear, rain, snow) for reliability and performance.


# ⚙️ Environment Variables

This project requires environment variables to run.

Create a .env file in the project root (same level as package.json) with the following:

VITE_OPEN_WEATHER_API_KEY=your_openweather_api_key_here  
VITE_OPEN_WEATHER_BASE_URL=https://api.openweathermap.org/data/2.5  
VITE_OPEN_GEOCODE_BASE_URL=https://api.openweathermap.org/geo/1.0  
VITE_OPEN_WEATHER_ICON_URL=https://openweathermap.org/img/wn/{iconKey}@2x.png  

Important notes:
- All variables must start with VITE_ (Vite requirement)
- Do not wrap values in quotes
- Restart the dev server after adding or changing environment variables


# ▶️ Running the App

Install dependencies:
npm install

Start the development server:
npm run dev

The app will be available at the local Vite URL (usually http://localhost:5173).


# 🧪 Running Tests

This project includes a small but focused test suite covering:
- The OpenWeather API client
- Weather service logic
- Key mapping utilities

Run tests in watch mode:
npm run test

Run tests once:
npm run test:run

Run tests with coverage:
npm run test:coverage


# 🧠 Design Decisions

Local background images instead of remote image APIs  
Ensures fast, predictable rendering with no additional failure modes.

Service + client separation  
Keeps HTTP concerns out of the UI and makes testing straightforward.

Minimal UI testing  
Focuses on business logic rather than snapshot or UI tests for this exercise.

No over-engineering  
The implementation is intentionally simple and readable within the scope of a timed task.


# 📌 Notes

- Recent locations are stored in memory (last 4 searches)
- This can easily be extended to localStorage if persistence is required
- Error handling is intentionally user-friendly rather than verbose


# ✅ Summary

The goal of this project was not just to “make it work”, but to demonstrate:
- Clean structure
- Sensible defaults
- An approach that would scale naturally in a real-world codebase

Thanks for taking the time to review it. Below is the react + typescript default template just in case there are issues with above instructions



# React + TypeScript + Vite Information

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
