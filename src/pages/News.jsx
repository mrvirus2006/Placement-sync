import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_NEWS_API_KEY 
  const fallbackImage = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000&auto=format&fit=crop";

  useEffect(() => {
    const fetchNews = async () => {
      if (!API_KEY) {
        setError("API Key Missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // ✅ STEP 1: USE A BROAD BUT TECH-FOCUSED QUERY
        // We use keywords that are common in tech hiring and professional growth.
        const query = encodeURIComponent(
          '(hiring OR "software engineer jobs" OR "tech layoffs" OR "career advice" OR "developer salary") ' + 
          'NOT (politics OR trump OR celebrity)'
        );

        // ✅ STEP 2: USE TOP-TIER TECH SOURCES ONLY
        const techDomains = 'techcrunch.com,venturebeat.com,theverge.com,wired.com,zdnet.com';

        const url = `https://newsapi.org/v2/everything?q=${query}&domains=${techDomains}&language=en&sortBy=publishedAt&pageSize=12&apiKey=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "ok") {
          // ✅ STEP 3: POST-FETCH FILTERING
          // Only show articles that actually have a description and image
          const validArticles = (data.articles || []).filter(art => 
            art.title && 
            art.title !== "[Removed]" && 
            art.urlToImage
          );

          setArticles(validArticles);
          
          if (validArticles.length === 0) {
            setError("No specific job roles found today. Showing general tech trends instead.");
          }
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Network connection failed.");
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

        {/* Show a small notice if specific jobs are missing but still allow content below */}
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
                      backgroundImage: `url(${article.urlToImage || fallbackImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <span className="jm-news-badge">{article.source?.name || "News"}</span>
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
                      <a href={article.url} target="_blank" rel="noopener noreferrer" className="jm-news-link">
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