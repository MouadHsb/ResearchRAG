import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || '';
const API_URL = process.env.REACT_APP_API_URL || 'https://mouadhsb-researchrag.hf.space';


const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service methods
export const ragApi = {
  // Process a query through the RAG system
  // In api.js
  async processQuery(query, topK = 5, model = null, categories = null) {
    const url = `${API_URL}/rag/query`;
    console.log(`Sending request to: ${url}`);
    try {
      const response = await apiClient.post('/rag/query', {
        query,
        top_k: topK,
        model,
        categories,
      });
      return response.data;
    } catch (error) {
      console.error('Error processing query:', error);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      throw error;
    }
  },

  // Search papers without LLM response
  async searchPapers(query, topK = 10, categories = null) {
    try {
      const response = await apiClient.post('/rag/search', {
        query,
        top_k: topK,
        categories,
      });
      return response.data;
    } catch (error) {
      console.error('Error searching papers:', error);
      throw error;
    }
  },

  // Get available LLM models
  async getModels() {
    try {
      const response = await apiClient.get('/rag/models');
      return response.data;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  },

  // Get system statistics
  async getStats() {
    try {
      const response = await apiClient.get('/rag/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Clear the paper cache
  async clearCache() {
    try {
      const response = await apiClient.post('/rag/clear/cache');
      return response.data;
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  },

  // Clear the vector database
  async clearDatabase() {
    try {
      const response = await apiClient.post('/rag/clear/database');
      return response.data;
    } catch (error) {
      console.error('Error clearing database:', error);
      throw error;
    }
  },

  // Check API health
  async checkHealth() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  },
};

export default ragApi; 