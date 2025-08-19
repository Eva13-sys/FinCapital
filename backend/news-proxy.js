const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/api/news', async (req, res) => {
  try {
    const apiKey = process.env.FINANCIAL_NEWS_API_KEY;
    if (!apiKey) {
      console.error('API key is missing!');
      return res.status(500).json({ error: 'API key is missing on the server.' });
    }
    // const url = `https://financialnewsapi.com/api/v1/news?apiKey=${apiKey}`;
    const url=`https://financialmodelingprep.com/stable/fmp-articles?page=0&limit=20&apikey=${apiKey}`
    console.log('Fetching news from:', url);
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      console.error('News API error:', response.status, text);
      return res.status(response.status).json({ error: 'Failed to fetch news', details: text });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
