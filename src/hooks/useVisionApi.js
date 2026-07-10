import { useState } from 'react';

export function useVisionApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const analyzeImage = async (base64Image) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call for the frontend functionality
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = {
        patientName: "John Doe",
        medications: [
          {
            id: crypto.randomUUID(),
            medicineName: "Metformin",
            dosage: "500 mg",
            schedule: { morning: true, afternoon: false, night: true },
            mealInstruction: "After Food",
            specialNotes: null
          },
          {
            id: crypto.randomUUID(),
            medicineName: "Aspirin",
            dosage: "75 mg",
            schedule: { morning: true, afternoon: false, night: false },
            mealInstruction: "Independent",
            specialNotes: "Take with water"
          }
        ]
      };
      
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to analyze prescription');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { analyzeImage, isLoading, error, data, setData };
}
