// src/app/config/llmConfig.ts

export interface LLMConfig {
    modelName: string;
    apiEndpoint: string;
    apiKey: string;
    maxTokens: number;
    temperature: number;
  }
  
  // Using environment variables for sensitive data
  const llmConfig: LLMConfig = {
    modelName: 'llama-7b', // Example model
    apiEndpoint: process.env.LLM_API_ENDPOINT || '',  // Endpoint stored as GitHub Secret
    apiKey: process.env.LLM_API_KEY || '',           // API Key stored as GitHub Secret
    maxTokens: 150,
    temperature: 0.7,
  };
  
  export default llmConfig;  