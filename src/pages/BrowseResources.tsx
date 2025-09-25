import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Search, 
  Play, 
  Clock, 
  Eye, 
  Calendar, 
  ArrowLeft, 
  Loader2, 
  Filter,
  Heart,
  BookOpen,
  Sparkles,
  Zap,
  Moon,
  Sun,
  Star
} from 'lucide-react';
import { 
  searchVideosByCategory, 
  searchVideosByQuery, 
  getRecommendedVideos,
  getTrendingWellnessVideos,
  VIDEO_CATEGORIES,
  type YouTubeVideo 
} from '@/services/youtube';

// Check if YouTube API key is configured
const isApiKeyConfigured = () => {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  return Boolean(apiKey);
};

const BrowseResources = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof VIDEO_CATEGORIES>('meditation');
  const [categoryVideos, setCategoryVideos] = useState<Record<string, YouTubeVideo[]>>({});
  const [isLoadingCategory, setIsLoadingCategory] = useState<Record<string, boolean>>({});
  const [recommendedVideos, setRecommendedVideos] = useState<YouTubeVideo[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<YouTubeVideo[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    // Load recommended videos (including speakers like Garikapati Narasimha Rao)
    const recommended = await getRecommendedVideos('Garikapati Narasimha Rao', 8);
    setRecommendedVideos(recommended);

    // Load trending wellness videos
    const trending = await getTrendingWellnessVideos(8);
    setTrendingVideos(trending);

    // Load meditation category by default
    await loadCategoryVideos('meditation');
  };

  const loadCategoryVideos = async (category: keyof typeof VIDEO_CATEGORIES) => {
    setIsLoadingCategory(prev => ({ ...prev, [category]: true }));
    try {
      const videos = await searchVideosByCategory(category, 12);
      setCategoryVideos(prev => ({ ...prev, [category]: videos }));
    } catch (error) {
      console.error(`Error loading ${category} videos:`, error);
    } finally {
      setIsLoadingCategory(prev => ({ ...prev, [category]: false }));
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchVideosByQuery(searchQuery, 20);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategoryChange = (category: keyof typeof VIDEO_CATEGORIES) => {
    setSelectedCategory(category);
    if (!categoryVideos[category]) {
      loadCategoryVideos(category);
    }
  };

  const toggleFavorite = (videoId: string) => {
    setFavorites(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const VideoCard = ({ video, showChannel = true }: { video: YouTubeVideo; showChannel?: boolean }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
      <div className="relative">
        <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => window.open(video.url, '_blank')}
            >
              <Play className="w-4 h-4 mr-2" />
              Watch
            </Button>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
          onClick={() => toggleFavorite(video.id)}
        >
          <Heart className={`w-4 h-4 ${favorites.includes(video.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {video.title}
        </h3>
        {showChannel && (
          <p className="text-xs text-gray-600 mb-2">{video.channelTitle}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Eye className="w-3 h-3" />
            {video.viewCount}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(video.publishedAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-purple-200/50 shadow-lg sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Browse Resources
                </h1>
                <p className="text-sm text-gray-600">Discover videos for meditation, yoga, motivation, and spiritual growth</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">

        {/* Search Section */}
        <Card className="mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-purple-600" />
              Search Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Search for meditation, yoga, motivation, spiritual videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !searchQuery.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card className="mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                Search Results ({searchResults.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="recommended" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/90 backdrop-blur-sm">
            <TabsTrigger value="recommended" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Recommended
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Favorites ({favorites.length})
            </TabsTrigger>
          </TabsList>

          {/* Recommended Videos */}
          <TabsContent value="recommended">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Recommended for You
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Curated videos including spiritual speakers like Garikapati Narasimha Rao and other motivational content
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recommendedVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories */}
          <TabsContent value="categories">
            <div className="space-y-6">
              {/* Category Selection */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-purple-600" />
                    Choose Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {Object.entries(VIDEO_CATEGORIES).map(([key, category]) => (
                      <Button
                        key={key}
                        variant={selectedCategory === key ? "default" : "outline"}
                        className={`h-16 flex flex-col items-center gap-2 ${
                          selectedCategory === key 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                            : 'hover:bg-purple-50'
                        }`}
                        onClick={() => handleCategoryChange(key as keyof typeof VIDEO_CATEGORIES)}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-xs text-center">{category.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category Videos */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">{VIDEO_CATEGORIES[selectedCategory].icon}</span>
                    {VIDEO_CATEGORIES[selectedCategory].name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingCategory[selectedCategory] ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                      <span className="ml-2">Loading videos...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categoryVideos[selectedCategory]?.map((video) => (
                        <VideoCard key={video.id} video={video} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trending Videos */}
          <TabsContent value="trending">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Trending Wellness Videos
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Popular videos in mental health, wellness, and spiritual growth
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {trendingVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites */}
          <TabsContent value="favorites">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Your Favorites ({favorites.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No favorites yet. Start adding videos you love!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...recommendedVideos, ...trendingVideos, ...Object.values(categoryVideos).flat()]
                      .filter(video => favorites.includes(video.id))
                      .map((video) => (
                        <VideoCard key={video.id} video={video} />
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default BrowseResources;
