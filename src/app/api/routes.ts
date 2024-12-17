import { Router } from 'express';
import { RecommendationsService } from '../services/recommendationsService'; // Assuming you have this service imported

const router = Router();
const recommendationsService = new RecommendationsService();

// Route for generating recommendations
router.post('/recommendations', async (req, res) => {
    try {
        const { userId, context, preferences } = req.body;
        if (!userId || !context) {
            return res.status(400).json({ error: 'User ID and context are required.' });
        }

        const recommendationRequest = { userId, context, preferences };
        const recommendationResponse = await recommendationsService.generateRecommendations(recommendationRequest);

        return res.status(200).json(recommendationResponse);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to generate recommendations', message: error.message });
    }
});

export default router;