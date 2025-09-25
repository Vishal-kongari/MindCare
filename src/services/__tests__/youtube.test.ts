// Simple test file to verify YouTube service functionality
import { 
  searchVideosByCategory, 
  searchVideosByQuery, 
  getRecommendedVideos,
  getTrendingWellnessVideos,
  VIDEO_CATEGORIES 
} from '../youtube';

// Mock test function
export const testYouTubeService = async () => {
  console.log('🧪 Testing YouTube Service...');
  
  try {
    // Test category search
    console.log('📱 Testing category search...');
    const meditationVideos = await searchVideosByCategory('meditation', 3);
    console.log(`✅ Found ${meditationVideos.length} meditation videos`);
    
    // Test query search
    console.log('🔍 Testing query search...');
    const searchVideos = await searchVideosByQuery('motivation', 3);
    console.log(`✅ Found ${searchVideos.length} motivation videos`);
    
    // Test recommended videos
    console.log('⭐ Testing recommended videos...');
    const recommendedVideos = await getRecommendedVideos('Garikapati Narasimha Rao', 3);
    console.log(`✅ Found ${recommendedVideos.length} recommended videos`);
    
    // Test trending videos
    console.log('🔥 Testing trending videos...');
    const trendingVideos = await getTrendingWellnessVideos(3);
    console.log(`✅ Found ${trendingVideos.length} trending videos`);
    
    console.log('🎉 All tests completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
};

// Test categories
export const testCategories = () => {
  console.log('📂 Available video categories:');
  Object.entries(VIDEO_CATEGORIES).forEach(([key, category]) => {
    console.log(`  ${category.icon} ${category.name} (${key})`);
  });
};
