import { useState, useEffect, useCallback } from 'react';
import { MOCK_FARMS } from '../constants/mockData';

export const useFarms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFarms = useCallback(async () => {
    setLoading(true);
    setError(null);

    const apiBase = process.env.EXPO_PUBLIC_API_URL;
    if (!apiBase) {
      setFarms(MOCK_FARMS);
      setLoading(false);
      return;
    }

    const url = `${apiBase.replace(/\/$/, '')}/api/farms`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Fetch failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('API response is not an array');
      }

      setFarms(data);
    } catch (fetchError) {
      setError(fetchError);
      setFarms(MOCK_FARMS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFarms();
  }, [loadFarms]);

  return {
    farms,
    loading,
    error,
    refetch: loadFarms,
  };
};
