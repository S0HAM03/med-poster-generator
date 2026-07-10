import { useState } from 'react';

export function useVisionApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const analyzeImage = async (base64Image) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze prescription');
      }

      // Add unique IDs to the result medications for React keys
      if (result.medications && Array.isArray(result.medications)) {
        result.medications = result.medications.map(med => ({
          ...med,
          id: crypto.randomUUID()
        }));
      }
      
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to analyze prescription. Make sure your GEMINI_API_KEY is configured.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { analyzeImage, isLoading, error, data, setData };
}
