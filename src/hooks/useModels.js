import { useState, useEffect } from 'react';
import ragApi from '../services/api';

/**
 * Custom hook for retrieving and managing LLM models
 */
function useModels() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);

  // Fetch models on initial load
  useEffect(() => {
    fetchModels();
  }, []);

  /**
   * Fetch available models from the API
   */
  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ragApi.getModels();
      setModels(response);
      
      // Set selected model to first one if none is selected
      if (!selectedModel && response.length > 0) {
        setSelectedModel(response[0]);
      }
      
      return response;
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error fetching models');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Select a model by name
   */
  const selectModel = (modelName) => {
    if (models.includes(modelName)) {
      setSelectedModel(modelName);
      return true;
    }
    return false;
  };

  return {
    loading,
    error,
    models,
    selectedModel,
    fetchModels,
    selectModel
  };
}

export default useModels; 