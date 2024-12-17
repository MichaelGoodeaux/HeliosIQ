import { Logger } from '../utils/loggerUtils';
import { LLMService } from './LLMIntegrationService';

const logger = new Logger('RecommendationsService');

export interface RecommendationRequest {
    userId: string;
    context: string;
    preferences?: Record<string, string | number | boolean>;
}

export interface RecommendationResponse {
    recommendations: string[];
}

export class RecommendationsService {
    private llmService: LLMService;
    private readonly basePrompt: string;

    constructor() {
        this.llmService = new LLMService();
        this.basePrompt = process.env.RECOMMENDATION_BASE_PROMPT || 'Provide a list of personalized recommendations based on the following context:';
        logger.info('RecommendationsService initialized');
    }

    /**
     * Generates recommendations based on user context and preferences.
     * @param request RecommendationRequest containing user-specific data.
     * @returns A list of recommendations.
     */
    public async generateRecommendations(
        request: RecommendationRequest
    ): Promise<RecommendationResponse> {
        logger.info(`Generating recommendations for user: ${request.userId}`);

        if (!request.context) {
            throw new Error('Context is required to generate recommendations.');
        }

        try {
            // Build a prompt dynamically using user data
            const prompt = this.buildRecommendationPrompt(request);

            // Fetch response from LLM with a timeout for robustness
            const llmResponse = await this.llmService.generateResponseWithTimeout(prompt);

            // Parse response into structured recommendations
            const recommendations = this.parseLLMResponse(llmResponse);

            // Apply further filtering based on context or preferences
            const filteredRecommendations = this.filterRecommendations(recommendations, request.preferences);

            logger.info(
                `Recommendations successfully generated for user: ${request.userId}`
            );

            return { recommendations: filteredRecommendations };
        } catch (error) {
            logger.error(
                `Failed to generate recommendations: ${error.message}`
            );
            throw new Error('Unable to generate recommendations at this time.');
        }
    }

    /**
     * Builds a structured LLM prompt based on the request.
     * @param request RecommendationRequest containing context and preferences.
     * @returns A string prompt to send to the LLM.
     */
    private buildRecommendationPrompt(request: RecommendationRequest): string {
        const basePrompt = `${this.basePrompt} "${request.context}".`;

        if (request.preferences) {
            const preferencesText = Object.entries(request.preferences)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
            return `${basePrompt} User preferences: ${preferencesText}`;
        }

        return basePrompt;
    }

    /**
     * Parses the raw response from the LLM into a structured list of recommendations.
     * @param llmResponse Raw LLM response as a string.
     * @returns A list of recommendations.
     */
    private parseLLMResponse(llmResponse: string): string[] {
        // Validate the response format (e.g., not empty)
        if (!llmResponse || typeof llmResponse !== 'string') {
            throw new Error('Invalid LLM response format.');
        }

        // Split the response by new lines or bullets, assuming a structured output
        return llmResponse
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line !== '');
    }

    /**
     * Filters the recommendations based on user preferences and context.
     * @param recommendations List of raw recommendations from the LLM.
     * @param preferences User preferences for filtering.
     * @returns A filtered list of recommendations.
     */
    private filterRecommendations(recommendations: string[], preferences?: Record<string, string | number | boolean>): string[] {
        if (!preferences) {
            return recommendations;
        }

        // Example: Filter recommendations based on preferences (e.g., exclude certain categories)
        return recommendations.filter((recommendation) => {
            // Check if excludedCategories exists and is an array
            if (Array.isArray(preferences.excludedCategories)) {
                // Example filter logic (adjust as needed)
                return !preferences.excludedCategories.includes(recommendation);
            }

            // If excludedCategories is not an array, just return true (no exclusion)
            return true;
        });
    }
}