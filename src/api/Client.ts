import axios from 'axios';

const client = axios.create({
    baseURL: "https://e-book-server-399n.onrender.com"
});

client.interceptors.request.use(
    function(config){
       config.withCredentials = true;
       return config;
    }
)

export default client;