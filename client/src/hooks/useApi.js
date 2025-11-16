import { useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function useApi() {
  const get = useCallback(async (endpoint) => {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) {
      throw new Error('API request failed');
    }
    return response.json();
  }, []);

  const post = useCallback(async (endpoint, data) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('API request failed');
    }
    return response.json();
  }, []);

  const put = useCallback(async (endpoint, data) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('API request failed');
    }
    return response.json();
  }, []);

  const del = useCallback(async (endpoint) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('API request failed');
    }
    return response.json();
  }, []);

  return { get, post, put, del };
}

export default useApi;
