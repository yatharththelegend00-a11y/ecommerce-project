export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://your-backend-url'
    : window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : `http://${window.location.hostname}:5000`;