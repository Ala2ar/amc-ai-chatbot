// Get the current hostname (works for both development and production)
const hostname = window.location.hostname;

// If we are on localhost,use localhost, otherwise use the local network IP
const API_BASE_URL = hostname === 'localhost' || hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : `http://${hostname}:5000`;

export const API_ENDPOINTS = {
  ask: `${API_BASE_URL}/api/ask`,
  health: `${API_BASE_URL}/api/health`
}; 