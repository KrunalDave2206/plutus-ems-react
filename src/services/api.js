import axios from 'axios';

let instance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers['x-access-token'] = token;
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default instance;