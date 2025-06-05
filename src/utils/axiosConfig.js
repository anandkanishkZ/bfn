import axios from 'axios';

// Set the base URL for Axios requests
const instance = axios.create({
    baseURL: 'http://localhost:5000', // Backend server URL - corrected port
    timeout: 5000, // 5 second timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor for logging
instance.interceptors.request.use(
    config => {
        console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor for logging
instance.interceptors.response.use(
    response => {
        console.log(`Response from ${response.config.url}:`, response.status);
        return response;
    },
    error => {
        if (error.response) {
            console.error(`Error response from ${error.config.url}:`, {
                status: error.response.status,
                data: error.response.data
            });
        }
        return Promise.reject(error);
    }
);

// Add Authorization header interceptor
instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log('Adding auth token to request:', config.url);
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.warn('No auth token available for request:', config.url);
        }
        return config;
    },
    error => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for auth errors
instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error('Authentication error:', error.response.data);
            // Clear auth data on authentication error
            if (window.location.pathname !== '/login') {
                console.log('Auth error detected, redirecting to login...');
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('user');
                // Use window location directly to force a full page reload
                window.location.href = '/login';
            }
        } else if (error.response) {
            // Log full error details for debugging
            console.error('API error:', {
                url: error.config && error.config.url,
                status: error.response.status,
                data: error.response.data
            });
        } else {
            // Network or CORS error
            console.error('Network or CORS error:', error.message);
        }
        // Let components handle their own error display
        return Promise.reject(error);
    }
);

export default instance;
