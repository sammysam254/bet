// Vertex Betting - Real Live Sports News Service
// Fetches 100% REAL sports breaking news from free public ESPN sports feeds
// Cached in Upstash Redis & LocalStorage for instant 0ms loads

import { getCachedDataSync, setCachedData, fetchWithInstantRedisCache } from './redisCache';

const NEWS_SOURCES = [
  { id: 'epl', name: 'Premier League', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news' },
  { id: 'ucl', name: 'Champions League', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/news' },
  { id: 'laliga', name: 'La Liga', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/news' },
  { id: 'nba', name: 'NBA Basketball', url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news' }
];

// Helper to format ISO timestamp into readable "Xm ago" or "Xh ago"
export const formatTimeAgo = (isoDate) => {
  if (!isoDate) return 'Just now';
  try {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch (e) {
    return 'Recently';
  }
};

/**
 * Fetch real news articles from free ESPN public feeds with Redis caching
 */
export const fetchRealSportsNews = async (category = 'all', onBackgroundUpdate = null) => {
  const cacheKey = `vertex_sports_news_${category}`;

  // 1. Instant return from local / memory cache
  const cached = getCachedDataSync(cacheKey);

  // 2. Fetch fresh articles upstream
  const fetcher = async () => {
    const sourcesToFetch = category === 'all' 
      ? NEWS_SOURCES 
      : NEWS_SOURCES.filter(s => s.id === category);

    const allArticles = [];

    await Promise.allSettled(
      sourcesToFetch.map(async (src) => {
        try {
          const res = await fetch(src.url);
          if (!res.ok) return;
          const json = await res.json();
          if (Array.isArray(json.articles)) {
            json.articles.forEach((art, idx) => {
              if (!art.headline) return;
              allArticles.push({
                id: `${src.id}-${idx}-${Date.now()}`,
                category: src.name,
                categoryId: src.id,
                headline: art.headline,
                description: art.description || '',
                published: art.published || new Date().toISOString(),
                timeAgo: formatTimeAgo(art.published),
                imageUrl: art.images?.[0]?.url || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
                byline: art.byline || 'ESPN Sports Desk',
                link: art.links?.web?.href || '#'
              });
            });
          }
        } catch (err) {
          console.warn(`Could not fetch news for ${src.name}:`, err.message);
        }
      })
    );

    // Sort by latest published date
    allArticles.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());

    return allArticles.slice(0, 20);
  };

  return fetchWithInstantRedisCache(cacheKey, fetcher, onBackgroundUpdate);
};
