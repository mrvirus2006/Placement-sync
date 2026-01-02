import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // GNews API uses 'apikey' as the parameter name
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY; 
  const fallbackImage = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000&auto=format&fit=crop";

  useEffect(() => {
    const fetchNews = async () => {
      if (!API_KEY) {
        setError("API Key Missing. Please check your .env file.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // GNews query optimization
        const query = encodeURIComponent(
          '(hiring OR "tech jobs" OR "career advice" OR "developer salary")'
        );

        // GNews endpoint: https://gnews.io/api/v4/search
        // Note: domains filter is not a free-tier parameter for GNews, so we use a clean query
        const url = `https://placement-sync.onrender.com/api/news`;
        
        const response = await fetch(url);
        const data = await response.json();

        // GNews returns "articles" array if successful
        if (data.articles) {
          // ✅ GNews uses 'image' and 'url' instead of 'urlToImage'
          const validArticles = data.articles.filter(art => 
            art.title && 
            art.title !== "[Removed]" && 
            art.image // Check for GNews 'image' field
          );

          setArticles(validArticles);
          
          if (validArticles.length === 0) {
            setError("No specific tech market updates found today. Please check back later.");
          }
        } else if (data.errors) {
          // GNews specific error handling
          setError(data.errors[0] || "API Error occurred.");
        }
      } catch (err) {
        setError("Network connection failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [API_KEY]);

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        {/* Header Section */}
        <div className="top-header jm-animate-up">
          <div className="header-text">
            <h1>Tech Market Pulse <i className="fa-solid fa-briefcase" style={{color: 'var(--accent)'}}></i></h1>
            <p>Staying informed on industry trends is the first step to a successful career.</p>
          </div>
        </div>

        {/* Loading Animation */}
        {loading && (
          <div className="scanner-wrapper">
             <div className="scanner-box scanning">
                <div className="scan-line"></div>
                <h3>Synchronizing Market Data...</h3>
             </div>
          </div>
        )}

        {/* Error Display */}
        {error && !articles.length && (
          <div className="glass-card jm-animate-up" style={{borderColor: '#ef4444', textAlign: 'center', margin: '20px auto'}}>
            <p>{error}</p>
          </div>
        )}

        {/* News Grid */}
        {!loading && articles.length > 0 && (
          <div className="jm-news-wrapper jm-animate-up">
            <div className="jm-news-grid">
              {articles.map((article, index) => (
                <div key={index} className="jm-news-card">
                  <div 
                    className="jm-news-image" 
                    style={{ 
                      backgroundImage: `url(${article.image || fallbackImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <span className="jm-news-badge">{article.source?.name || "Tech News"}</span>
                  </div>
                  
                  <div className="jm-news-content">
                    <div>
                      <h4 className="jm-news-title">{article.title}</h4>
                      <p className="jm-news-desc">
                        {article.description ? article.description.slice(0, 95) + "..." : "Explore this update for insights into the current tech market."}
                      </p>
                    </div>
                    
                    <div className="jm-news-footer">
                      <span className="jm-news-date">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="jm-news-link"
                      >
                        Explore <i className="fa-solid fa-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;