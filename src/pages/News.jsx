import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackImage = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000&auto=format&fit=crop";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Calls your Render Backend Proxy
        const url = `https://placement-sync.onrender.com/api/news`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch from server");
        }

        const data = await response.json();

        // data.articles comes from your updated server.js mapping
        if (data && data.articles) {
          const validArticles = data.articles.filter(art => 
            art.title && 
            art.title !== "[Removed]"
          );

          setArticles(validArticles);
          
          if (validArticles.length === 0) {
            setError("No tech market updates found at the moment.");
          }
        } else {
          setError("Received unexpected data format from the server.");
        }
      } catch (err) {
        console.error("News Fetch Error:", err);
        setError(err.message || "Network connection failed. Make sure your Render backend is live.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []); // Empty array prevents the infinite refresh loop

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <div className="top-header jm-animate-up">
          <div className="header-text">
            <h1>Tech Market Pulse <i className="fa-solid fa-briefcase" style={{color: 'var(--accent)'}}></i></h1>
            <p>Staying informed on industry trends is the first step to a successful career.</p>
          </div>
        </div>

        {loading && (
          <div className="scanner-wrapper">
             <div className="scanner-box scanning">
                <div className="scan-line"></div>
                <h3>Synchronizing Market Data...</h3>
             </div>
          </div>
        )}

        {error && !articles.length && (
          <div className="glass-card jm-animate-up" style={{borderColor: '#ef4444', textAlign: 'center', margin: '20px auto'}}>
            <p>{error}</p>
          </div>
        )}

        {!loading && articles.length > 0 && (
          <div className="jm-news-wrapper jm-animate-up">
            <div className="jm-news-grid">
              {articles.map((article, index) => (
                <div key={index} className="jm-news-card">
                  <div 
                    className="jm-news-image" 
                    style={{ 
                      backgroundImage: `url(${article.image || article.urlToImage || fallbackImage})`,
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
                        {article.description 
                          ? (article.description.length > 95 ? article.description.slice(0, 95) + "..." : article.description)
                          : "Explore this update for insights into the current tech market."}
                      </p>
                    </div>
                    
                    <div className="jm-news-footer">
                      <span className="jm-news-date">
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Recent"}
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