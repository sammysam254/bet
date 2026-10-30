import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock, Sparkles, Filter, ChevronRight, X, Share2, Bookmark } from 'lucide-react';
import { fetchRealSportsNews } from '../services/newsService';

const NEWS_CATEGORIES = [
  { id: 'all', label: '🔥 All News' },
  { id: 'epl', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
  { id: 'ucl', label: '⭐ Champions League' },
  { id: 'laliga', label: '🇪🇸 La Liga' },
  { id: 'nba', label: '🏀 NBA' }
];

export const RealSportsNews = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [newsArticles, setNewsArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchRealSportsNews(activeCategory, (bgData) => {
      if (isMounted && Array.isArray(bgData) && bgData.length > 0) {
        setNewsArticles(bgData);
      }
    }).then(res => {
      if (isMounted) {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setNewsArticles(res.data);
        }
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => { isMounted = false; };
  }, [activeCategory]);

  return (
    <div className="real-sports-news-container">
      {/* Header bar */}
      <div className="news-section-header">
        <div className="news-header-title">
          <Newspaper size={20} color="#3b82f6" />
          <div>
            <h3 className="news-main-heading">Live Verified Sports News Wire</h3>
            <span className="news-sub-heading">100% Real Live Breaking Headlines • Free Live ESPN Feed</span>
          </div>
        </div>
        <div className="news-live-chip">
          <span className="live-pulse-dot" />
          <span>REAL-TIME</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="news-category-pills-row">
        {NEWS_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            className={`news-pill-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* News Cards Grid */}
      {isLoading && newsArticles.length === 0 ? (
        <div className="news-loading-skeleton">
          <div className="skeleton-line" style={{ width: '60%' }} />
          <div className="skeleton-line" style={{ width: '90%' }} />
          <div className="skeleton-line" style={{ width: '75%' }} />
        </div>
      ) : (
        <div className="news-articles-grid">
          {newsArticles.slice(0, 6).map((art) => (
            <div
              key={art.id}
              className="news-article-card"
              onClick={() => setSelectedArticle(art)}
            >
              <div className="news-thumbnail-wrapper">
                <img
                  src={art.imageUrl}
                  alt={art.headline}
                  className="news-thumbnail-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <span className="news-category-badge">{art.category}</span>
              </div>

              <div className="news-content-box">
                <div className="news-meta-row">
                  <span className="news-byline-text">{art.byline}</span>
                  <span className="news-time-ago">
                    <Clock size={12} />
                    {art.timeAgo}
                  </span>
                </div>

                <h4 className="news-card-headline">{art.headline}</h4>

                <p className="news-card-description">
                  {art.description}
                </p>

                <div className="news-read-more-link">
                  <span>Read full analysis</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Detail Reading Modal */}
      {selectedArticle && (
        <div className="modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="news-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="news-modal-header">
              <span className="news-category-badge">{selectedArticle.category}</span>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedArticle(null)}
              >
                <X size={20} />
              </button>
            </div>

            <img
              src={selectedArticle.imageUrl}
              alt={selectedArticle.headline}
              className="news-modal-hero-img"
            />

            <div className="news-modal-body">
              <div className="news-meta-row" style={{ marginBottom: '10px' }}>
                <span className="news-byline-text">{selectedArticle.byline}</span>
                <span className="news-time-ago">
                  <Clock size={13} />
                  {selectedArticle.timeAgo}
                </span>
              </div>

              <h2 className="news-modal-title">{selectedArticle.headline}</h2>

              <p className="news-modal-text">
                {selectedArticle.description}
              </p>

              <div className="news-modal-actions">
                {selectedArticle.link && selectedArticle.link !== '#' && (
                  <a
                    href={selectedArticle.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-modal-external-btn"
                  >
                    <span>View on ESPN Wire</span>
                    <ExternalLink size={15} />
                  </a>
                )}
                <button
                  type="button"
                  className="news-modal-close-action"
                  onClick={() => setSelectedArticle(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
