import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global response interceptor for unified error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError | Error) => {
    if (axios.isAxiosError(error) && error.response) {
      // Handle 401 Unauthorized globally
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Prevent redirect loop if already on login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Reusable error parser
export const parseApiError = (error: unknown, defaultMessage = 'An unexpected error occurred.'): string => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Unable to connect to the server. Please check your connection and try again.';
    }
    
    switch (error.response.status) {
      case 400:
        return error.response.data?.message || 'Please check the information you entered.';
      case 401:
        if (error.config?.url?.includes('/login')) {
          return error.response.data?.message || 'Invalid email or password.';
        }
        return 'Your session has expired. Please sign in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 500:
        return 'Something went wrong. Please try again later.';
      default:
        return error.response.data?.message || defaultMessage;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return defaultMessage;
};

export default apiClient;
