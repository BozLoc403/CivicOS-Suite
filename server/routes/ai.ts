import { Router } from 'express';
import { freeAiService } from '../freeAiService';
import { storage } from '../storage';

const router = Router();

/**
 * Get AI service status
 */
router.get('/status', async (req, res) => {
  try {
    const services = await freeAiService.getAvailableServices();
    res.json(services);
  } catch (error) {
    console.error('AI status error:', error);
    res.status(500).json({ message: 'Failed to get AI status' });
  }
});

/**
 * Chat with AI
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get civic context
    const [politicians, bills, news] = await Promise.all([
      storage.getPoliticians({ limit: 10 }),
      storage.getBills({ limit: 10 }),
      storage.getNewsArticles({ limit: 5 })
    ]);

    const civicContext = {
      politicians,
      bills,
      recentNews: news
    };

    const response = await freeAiService.chat(message, conversationHistory, civicContext);
    
    res.json(response);
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ 
      message: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
      confidence: 0.1,
      source: 'fallback'
    });
  }
});

export default router;