import axios from "axios";

const request = axios.create({
    baseURL: 'http://localhost:8000/'
});

request.interceptors.request.use(function (config) {
    // Do something before request is sent
    let token = localStorage.getItem("token") || localStorage.getItem("access_token");
    
    // Fix: Xử lý token đúng cách
    if (token) {
        try {
            // Nếu token là JSON string, parse nó
            if (token.startsWith('{') || token.startsWith('"')) {
                const parsed = JSON.parse(token);
                // Nếu là object với access_token, lấy access_token
                if (typeof parsed === 'object' && parsed.access_token) {
                    token = parsed.access_token;
                } else if (typeof parsed === 'string') {
                    token = parsed;
                }
            }
        } catch (e) {
            // Nếu parse lỗi, dùng token như string thường
            console.warn('Token parsing failed, using as-is:', e);
        }
        
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
request.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // console.log(response);
    
    return error.response.data
;
});

export default request