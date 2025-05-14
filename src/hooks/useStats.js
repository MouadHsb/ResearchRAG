import { useState } from 'react';
import ragApi from '../services/api';

/**
 * Custom hook for retrieving and managing system statistics
 */
function useStats() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  /**
   * Fetch system statistics from the API
   */
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ragApi.getStats();
      setStats(response);
      return response;
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error fetching stats');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear the paper cache
   */
  const clearCache = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await ragApi.clearCache();
      // Refresh stats after clearing cache
      return await fetchStats();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error clearing cache');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear the vector database
   */
  const clearDatabase = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await ragApi.clearDatabase();
      // Refresh stats after clearing database
      return await fetchStats();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error clearing database');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    stats,
    fetchStats,
    clearCache,
    clearDatabase
  };
}

export default useStats; 