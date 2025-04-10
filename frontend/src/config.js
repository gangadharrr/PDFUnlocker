// If REACT_APP_API_URL is empty or not set, use empty string for relative URLs
const apiUrl = process.env.REACT_APP_API_URL === '' ? '' :
              (process.env.REACT_APP_API_URL || 'http://localhost:8000');

export const config = {
  apiUrl
};