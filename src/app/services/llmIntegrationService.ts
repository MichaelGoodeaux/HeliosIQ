import axios, { AxiosError } from 'axios';
import { Logger } from '../utils/loggerUtils';

const logger = new Logger('LLMService');

export class LLMService {
    private llmApiUrl: string;

    constructor() {
        this.llmApiUrl = process.env.LLM_API_ENDPOINT || 'https://example.com/api/llm';
        logger.info('LLMService initialized');
    }

    /**
     * Generates a response from the LLM.
     * @param prompt The prompt to send to the LLM.
     * @returns The LLM's response as a string.
     */
    public async generateResponse(prompt: string): Promise<string> {
        try {
            const response = await axios.post(this.llmApiUrl, { prompt });
            return response.data;
        } catch (error) {
            logger.error(`Error in LLM response generation: ${error.message}`);
            throw new Error('Error generating response from LLM');
        }
    }

    /**
     * Generates a response from the LLM with a timeout.
     * @param prompt The prompt to send to the LLM.
     * @param timeout The timeout duration in milliseconds.
     * @returns The LLM's response as a string.
     */
    public async generateResponseWithTimeout(
        prompt: string,
        timeout: number = 5000
    ): Promise<string> {
        try {
            const response = await axios.post(this.llmApiUrl, { prompt }, { timeout });
            return response.data;
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                logger.error(`LLM response timeout after ${timeout} ms`);
                throw new Error(`LLM request timed out after ${timeout} ms`);
            }
            if (error.isAxiosError) {
                logger.error(`Axios error: ${error.response?.data || error.message}`);
                throw new Error('Error generating response from LLM');
            }
            throw error;
        }
    }
}