# Missing Podo - The Ankara Case

An investigation dashboard built to track down Jotform's mascot, Podo, using scattered clues from various forms. 

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory and add your Jotform API key:
   ```env
   VITE_JOTFORM_API_KEY=your_api_key_here
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

## Architecture

This application uses a centralized API service using `Promise.all` to concurrently fetch five different Jotform form types (Checkins, Messages, Sightings, Notes, Tips).

Once fetched, the unstructured submission answers are processed by a `normalizer` function. This matches numeric keys to human-readable names recursively, generating typed `{ id, type, timestamp, details }` generic structures. We can easily visualize records across our React views.

Fuzzy matching determines related records and cross-links people and events matching either similar locations or corresponding sender/receiver fields. We also employ a `react-leaflet` Maps integration utilizing geolocation data available in forms directly.
