import axios from 'axios';

const API_BASE = '/api/v1';

export const analyzeResume = async ({ resumeFile, jobDescription, provider = 'groq', customKey = '', token = '' }) => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  if (jobDescription) {
    formData.append('job_description', jobDescription);
  }

  const headers = {
    'Content-Type': 'multipart/form-data',
    'X-LLM-Provider': provider,
  };
  if (customKey) {
    headers['X-LLM-API-Key'] = customKey;
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.post(`${API_BASE}/analyze-resume`, formData, { headers, timeout: 180000 });
  return response.data;
};

export const fetchHistory = async (token = '') => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.get(`${API_BASE}/history`, { headers });
  return response.data;
};

export const deleteHistory = async (id, token = '') => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.delete(`${API_BASE}/history/${id}`, { headers });
  return response.data;
};

export const generatePdfReport = async (analysisData, token = '') => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.post(`${API_BASE}/generate-pdf`, analysisData, {
    headers,
    responseType: 'blob',
    timeout: 60000
  });
  return response.data;
};
