import express from 'express';
import sentimentService from '../services/sentimentService.js';

const router = express.Router();

// GET /api/sentiment/:symbol
router.get('/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { type = 'buy', quantity = 1, price = 0 } = req.query;
        const userId = req.user?.id; // Assuming you have authentication middleware

        const analysis = await sentimentService.analyzeTrade(
            symbol, 
            type, 
            parseInt(quantity), 
            parseFloat(price),
            userId
        );

        res.json(analysis);

    } catch (error) {
        console.error('Sentiment route error:', error);
        res.status(500).json({ 
            error: 'Failed to analyze stock sentiment',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// POST /api/sentiment/analyze
router.post('/analyze', async (req, res) => {
    try {
        const { symbol, tradeType, quantity, currentPrice } = req.body;
        const userId = req.user?.id;

        const analysis = await sentimentService.analyzeTrade(
            symbol, 
            tradeType, 
            quantity, 
            currentPrice,
            userId
        );

        res.json(analysis);

    } catch (error) {
        console.error('Sentiment analysis error:', error);
        res.status(500).json({ 
            error: 'Failed to analyze trade',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Health check for AI service
router.get('/health/ai', async (req, res) => {
    try {
        const axios = (await import('axios')).default;
        const response = await axios.get(`${process.env.AI_SERVICE_URL}/api/health`);
        res.json({ 
            status: 'connected', 
            aiService: response.data,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.json({ 
            status: 'disconnected', 
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

export default router;