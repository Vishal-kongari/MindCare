// YouTube API service for fetching video recommendations
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  url: string;
  embedUrl: string;
}

export interface YouTubeSearchResponse {
  items: Array<{
    id: { videoId: string };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        medium: { url: string };
        high: { url: string };
      };
      channelTitle: string;
      publishedAt: string;
    };
  }>;
}

export interface YouTubeVideoDetailsResponse {
  items: Array<{
    contentDetails: {
      duration: string;
    };
    statistics: {
      viewCount: string;
    };
  }>;
}

// YouTube API configuration
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Video categories with specific search terms
export const VIDEO_CATEGORIES = {
  meditation: {
    name: 'Meditation & Mindfulness',
    icon: '🧘‍♀️',
    searchTerms: [
      'meditation for beginners',
      'mindfulness meditation',
      'guided meditation',
      'breathing exercises',
      'calm meditation',
      'stress relief meditation'
    ],
    channelIds: ['UCqFzWxSCi39LnW1JKFR3efg', 'UC5BJyOifUXTXaSwg-2uJQ3Q'] // Headspace, Calm
  },
  yoga: {
    name: 'Yoga & Wellness',
    icon: '🧘‍♂️',
    searchTerms: [
      'yoga for beginners',
      'morning yoga',
      'yoga for stress relief',
      'yoga flow',
      'yoga stretches',
      'yoga meditation'
    ],
    channelIds: ['UC5BJyOifUXTXaSwg-2uJQ3Q', 'UCqFzWxSCi39LnW1JKFR3efg'] // Yoga with Adriene, etc.
  },
  motivation: {
    name: 'Motivation & Inspiration',
    icon: '💪',
    searchTerms: [
      'motivational speech',
      'inspirational videos',
      'success mindset',
      'personal development',
      'self improvement',
      'positive thinking'
    ],
    channelIds: ['UCnFCmh7G7Vj8IeCR0w3RjUQ', 'UCqFzWxSCi39LnW1JKFR3efg'] // TED, etc.
  },
  lawOfAttraction: {
    name: 'Law of Attraction',
    icon: '✨',
    searchTerms: [
      'law of attraction',
      'manifestation',
      'positive affirmations',
      'visualization techniques',
      'abundance mindset',
      'spiritual growth'
    ],
    channelIds: ['UCqFzWxSCi39LnW1JKFR3efg']
  },
  stressRelief: {
    name: 'Stress Relief',
    icon: '😌',
    searchTerms: [
      'stress relief techniques',
      'anxiety relief',
      'relaxation music',
      'calming sounds',
      'stress management',
      'mental health tips'
    ],
    channelIds: ['UC5BJyOifUXTXaSwg-2uJQ3Q', 'UCqFzWxSCi39LnW1JKFR3efg']
  },
  spiritual: {
    name: 'Spiritual Growth',
    icon: '🌟',
    searchTerms: [
      'spiritual awakening',
      'consciousness',
      'inner peace',
      'spiritual teachings',
      'mindfulness',
      'enlightenment'
    ],
    channelIds: ['UCqFzWxSCi39LnW1JKFR3efg']
  }
};

// Convert ISO 8601 duration to readable format
function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Format view count
function formatViewCount(count: string): string {
  const num = parseInt(count);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M views`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K views`;
  }
  return `${num} views`;
}

// Search for videos by category
export async function searchVideosByCategory(
  category: keyof typeof VIDEO_CATEGORIES,
  maxResults: number = 12
): Promise<YouTubeVideo[]> {
  // Require API key; if missing, return empty
  if (!YOUTUBE_API_KEY) return [];

  const categoryConfig = VIDEO_CATEGORIES[category];
  const searchTerm = categoryConfig.searchTerms[Math.floor(Math.random() * categoryConfig.searchTerms.length)];
  
  try {
    // Search for videos
    const searchResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?part=snippet&q=${encodeURIComponent(searchTerm)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!searchResponse.ok) {
      throw new Error(`YouTube API error: ${searchResponse.status}`);
    }
    
    const searchData: YouTubeSearchResponse = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) return [];
    
    // Get video IDs for detailed information
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    
    // Get detailed video information
    const detailsResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!detailsResponse.ok) {
      throw new Error(`YouTube API error: ${detailsResponse.status}`);
    }
    
    const detailsData: YouTubeVideoDetailsResponse = await detailsResponse.json();
    
    // Combine search and details data
    const videos: YouTubeVideo[] = searchData.items.map((item, index) => {
      const details = detailsData.items[index];
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        duration: details ? formatDuration(details.contentDetails.duration) : '0:00',
        viewCount: details ? formatViewCount(details.statistics.viewCount) : '0 views',
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`
      };
    });
    
    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
}

// Search for videos by specific query
export async function searchVideosByQuery(
  query: string,
  maxResults: number = 12
): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) return [];

  try {
    const searchResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!searchResponse.ok) {
      throw new Error(`YouTube API error: ${searchResponse.status}`);
    }
    
    const searchData: YouTubeSearchResponse = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) return [];
    
    // Get video IDs for detailed information
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    
    // Get detailed video information
    const detailsResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!detailsResponse.ok) {
      throw new Error(`YouTube API error: ${detailsResponse.status}`);
    }
    
    const detailsData: YouTubeVideoDetailsResponse = await detailsResponse.json();
    
    // Combine search and details data
    const videos: YouTubeVideo[] = searchData.items.map((item, index) => {
      const details = detailsData.items[index];
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        duration: details ? formatDuration(details.contentDetails.duration) : '0:00',
        viewCount: details ? formatViewCount(details.statistics.viewCount) : '0 views',
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`
      };
    });
    
    return videos;
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    return [];
  }
}

// Get recommended videos for a specific speaker/channel
export async function getRecommendedVideos(
  speakerName?: string,
  maxResults: number = 12
): Promise<YouTubeVideo[]> {
  const searchQuery = speakerName ? `${speakerName} motivational spiritual` : 'motivational spiritual videos';
  
  try {
    return await searchVideosByQuery(searchQuery, maxResults);
  } catch (error) {
    console.error('Error getting recommended videos:', error);
    return [];
  }
}

// Get trending videos in wellness category
export async function getTrendingWellnessVideos(maxResults: number = 12): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) return [];

  try {
    const searchResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?part=snippet&q=wellness mental health meditation&type=video&order=relevance&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!searchResponse.ok) {
      throw new Error(`YouTube API error: ${searchResponse.status}`);
    }
    
    const searchData: YouTubeSearchResponse = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) return [];
    
    // Get video IDs for detailed information
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    
    // Get detailed video information
    const detailsResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!detailsResponse.ok) {
      throw new Error(`YouTube API error: ${detailsResponse.status}`);
    }
    
    const detailsData: YouTubeVideoDetailsResponse = await detailsResponse.json();
    
    // Combine search and details data
    const videos: YouTubeVideo[] = searchData.items.map((item, index) => {
      const details = detailsData.items[index];
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        duration: details ? formatDuration(details.contentDetails.duration) : '0:00',
        viewCount: details ? formatViewCount(details.statistics.viewCount) : '0 views',
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`
      };
    });
    
    return videos;
  } catch (error) {
    console.error('Error getting trending wellness videos:', error);
    return [];
  }
}
