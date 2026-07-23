import axios from 'axios';

// Allows environment-based API base URL (e.g. VITE_API_BASE_URL=https://resumely-backend.onrender.com)
// Defaults to '/api/v1' for Vite dev proxy when not defined.
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const API_BASE = BASE_URL ? `${BASE_URL}/api/v1` : '/api/v1';

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

export const rewriteBullet = async ({ bulletPoint, jobTitle = '', provider = 'groq', customKey = '', token = '' }) => {
  const formData = new FormData();
  formData.append('bullet_point', bulletPoint);
  if (jobTitle) formData.append('job_title', jobTitle);

  const headers = { 'X-LLM-Provider': provider };
  if (customKey) headers['X-LLM-API-Key'] = customKey;
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await axios.post(`${API_BASE}/rewrite-bullet`, formData, { headers });
  return response.data;
};

export const generateCoverLetter = async ({ jobTitle, companyName, skillsSummary = '', provider = 'groq', customKey = '', token = '' }) => {
  const formData = new FormData();
  formData.append('job_title', jobTitle);
  formData.append('company_name', companyName);
  if (skillsSummary) formData.append('skills_summary', skillsSummary);

  const headers = { 'X-LLM-Provider': provider };
  if (customKey) headers['X-LLM-API-Key'] = customKey;
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await axios.post(`${API_BASE}/generate-cover-letter`, formData, { headers });
  return response.data;
};
