import { useState, useEffect } from 'react';
import Api from '../services/Api';

const useAnalysis = (dreamId) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dreamId) return;

    const fetchAnalysis = async () => {
      try {
        const response = await Api.get(`/analysis/${dreamId}`);
        setAnalysis(response.data);
      } catch (error) {
        console.error('Error fetching analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [dreamId]);

  return { analysis, loading };
};

export default useAnalysis;
