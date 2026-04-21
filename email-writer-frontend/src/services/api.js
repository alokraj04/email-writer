import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateEmail = async (emailContent, tone) => {
  try {
    const response = await apiClient.post('/email/generate', {
      emailContent,
      tone,
    });
    // Assuming backend returns plain text as specified
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Failed to generate email');
    }
    throw new Error('Network error or server is down');
  }
};
