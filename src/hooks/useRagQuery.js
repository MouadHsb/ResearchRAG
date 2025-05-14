import { useState } from 'react';
import ragApi from '../services/api';

/**
 * Custom hook for making RAG queries
 */
function useRagQuery() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  /**
   * Execute a query through the RAG system
   */
  const executeQuery = async (query, topK = 5, model = null, categories = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ragApi.processQuery(query, topK, model, categories);
      setResult(response);
      return response;
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search papers without LLM processing
   */
  const searchPapers = async (query, topK = 10, categories = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ragApi.searchPapers(query, topK, categories);
      return response;
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset the query state
   */
  const reset = () => {
    setResult(null);
    setError(null);
  };

  return {
    loading,
    error,
    result,
    executeQuery,
    searchPapers,
    reset
  };
}

export default useRagQuery; 