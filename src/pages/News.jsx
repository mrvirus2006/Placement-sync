import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]); // For Search
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackImage = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000&auto=format&fit=crop";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = `https://placement-sync.onrender.com/api/news`;
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch from server");
        }

        const data = await response.json();

        if (data && data.articles) {
          const validArticles = data.articles.filter(art => 
            art.title && art.title !== "[Removed]"
          );
          setArticles(validArticles);
          setFilteredArticles(validArticles); // Set initial filtered list
          
          if (validArticles.length === 0) {
            setError("No tech market updates found at the moment.");
          }
        } else {
          setError("Received unexpected data format from the server.");
        }
      } catch (err) {
        setError(err.message || "Network connection failed.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // ✅ Client-side Search Logic
  useEffect(() => {
    const results = articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.description && article.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredArticles(results);
  }, [searchTerm, articles]);

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <div className="top-header pulse-animate-up">
          <div className="header-text">
            <h1>Tech Market Pulse <i className="fa-solid fa-briefcase" style={{color: 'var(--accent)'}}></i></h1>
            <p>Staying informed on industry trends is the first step to a successful career.</p>
          </div>

          {/* ✅ New Search Bar with Unique Classes */}
          <div className="pulse-search-container">
            <div className="pulse-search-wrapper">
              <i className="fa-solid fa-magnifying-glass pulse-search-icon"></i>
              <input 
                type="text" 
                className="pulse-search-input" 
                placeholder="Search specific roles, skills, or trends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
          <div className="glass-card pulse-animate-up" style={{borderColor: '#ef4444', textAlign: 'center', margin: '20px auto'}}>
            <p>{error}</p>
          </div>
        )}

        {!loading && filteredArticles.length === 0 && searchTerm && (
          <div className="pulse-no-results">
             <p>No matches found for "{searchTerm}"</p>
          </div>
        )}

        {!loading && filteredArticles.length > 0 && (
          <div className="pulse-news-wrapper pulse-animate-up">
            <div className="pulse-news-grid">
              {filteredArticles.map((article, index) => (
                <div key={index} className="pulse-news-card">
                  <div 
                    className="pulse-news-image" 
                    style={{ 
                      backgroundImage: `url(${article.image || article.urlToImage || fallbackImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <span className="pulse-news-badge">{article.source?.name || "Tech News"}</span>
                  </div>
                  
                  <div className="pulse-news-content">
                    <div>
                      <h4 className="pulse-news-title">{article.title}</h4>
                      <p className="pulse-news-desc">
                        {article.description 
                          ? (article.description.length > 95 ? article.description.slice(0, 95) + "..." : article.description)
                          : "Explore this update for insights into the current tech market."}
                      </p>
                    </div>
                    
                    <div className="pulse-news-footer">
                      <span className="pulse-news-date">
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Recent"}
                      </span>
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="pulse-news-link"
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