import axios from 'axios';

const client = axios.create({
    baseURL: "https://e-book-server-399n.onrender.com",
    // baseURL: "http://localhost:8000"
});

client.interceptors.request.use(
    function(config){
       config.withCredentials = true;
       return config;
    }
)

export default client;