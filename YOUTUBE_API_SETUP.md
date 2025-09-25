# YouTube API Setup Instructions

## Getting Your YouTube API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.developers.google.com/
   - Sign in with your Google account

2. **Create a New Project (or select existing)**
   - Click "Select a project" → "New Project"
   - Give it a name like "Mental Health App"
   - Click "Create"

3. **Enable YouTube Data API v3**
   - In the project dashboard, go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click on it and press "Enable"

4. **Create API Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated API key

5. **Secure Your API Key (Recommended)**
   - Click on your API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `localhost:5173/*`, `yourdomain.com/*`)
   - Under "API restrictions", select "Restrict key" and choose "YouTube Data API v3"

## Environment Configuration

1. **Create a `.env` file in your project root:**
```bash
VITE_YOUTUBE_API_KEY=AIzaSyDpbxbh116pZYx-ydrD_WAF9PaTBEmITC0
```

2. **Replace `your_actual_api_key_here` with your actual API key**

3. **Restart your development server:**
```bash
npm run dev
```

## Features Included

The Browse Resources feature includes:

- **Recommended Videos**: Curated content including spiritual speakers like Garikapati Narasimha Rao
- **Category-based Search**: 
  - 🧘‍♀️ Meditation & Mindfulness
  - 🧘‍♂️ Yoga & Wellness
  - 💪 Motivation & Inspiration
  - ✨ Law of Attraction
  - 😌 Stress Relief
  - 🌟 Spiritual Growth
- **Search Functionality**: Search for any video content
- **Trending Videos**: Popular wellness and mental health content
- **Favorites System**: Save videos you love
- **Responsive Design**: Works on all devices

## Usage

1. Navigate to your student dashboard
2. Click "Browse Resources" button
3. Explore different categories or search for specific content
4. Click on videos to watch them on YouTube
5. Add videos to favorites for easy access

## Troubleshooting

- **API Key Issues**: Make sure your API key is correctly set in the `.env` file
- **Rate Limits**: YouTube API has daily quotas. If you hit limits, wait 24 hours or request quota increase
- **CORS Issues**: The API calls are made from the browser, so ensure your domain is whitelisted in API restrictions

## API Quotas

- **Free Tier**: 10,000 units per day
- **Each search request**: ~100 units
- **Each video details request**: ~1 unit
- **Estimated usage**: ~200-500 units per user session

For production use, consider implementing caching or requesting quota increases.
