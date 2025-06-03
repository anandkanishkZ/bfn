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
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default instance;
