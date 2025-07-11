import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json; charset=UTF-8;',
        accept: 'application/json'
    }
})