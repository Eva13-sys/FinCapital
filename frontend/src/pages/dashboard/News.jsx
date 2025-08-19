import React, { useState, useEffect } from 'react'

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiKey = process.env.REACT_APP_FINANCIAL_NEWS_API_KEY;
    // const apiKey = import.meta.env.VITE_FINANCIAL_NEWS_API_KEY;

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/news');
                if (!response.ok) throw new Error(`HTTP error!, status: ${response.status}`)
                const data = await response.json();
                setNews(data.data || data || []);
            } catch (error) {
                console.error("Error fetching news:", error);
                setNews([
                    { title: "Markets Rally as Tech Stocks Surge", url: "#" },
                    { title: "Oil Prices Drop Amid Global Slowdown", url: "#" },
                    { title: "Green Energy Investments Hit Record High", url: "#" }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
        const interval = setInterval(fetchNews, 60000);
        return () => clearInterval(interval);
    }, [apiKey]);
    if (loading) return <p>Loading news...</p>

    return (
        <div className='bg-white p-4 shadow-md rounded-md overflow-hidden'>
            <h2 className='text-xl font-semibold mb-6'>Latest News</h2>
            {/* <div className='overflow-x-auto whitespace-nowrap'>
                {news.map((item,index) => (
                    <a
                        key={index}
                        href={item.url}
                        target='_blank'
                        rel="noopener noreferrer"
                        className='inline-block mr-6'
                    >
                        {item.title}
                    </a>
                ))}
            </div> */}
            <div className="news-ticker-container">
                <div className="news-ticker-strip">
                    {news.map((item, index) => (
                        <span key={index} className="inline-block mr-6">
                            {index !== 0 && <span className="mx-2 text-lg align-middle">&bull;</span>}
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline"
                            >
                                {item.title}
                            </a>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default News;
