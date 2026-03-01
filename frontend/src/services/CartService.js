import axios from 'axios';

const API_URL = "http://localhost:8080/cart";

export const getCartItems = (userId) => {
    return axios.get(`${API_URL}/${userId}`);
};

export const addToCart = (cartItem) => {
    return axios.post(API_URL, cartItem);
};

export const updateCartItem = (id, cartItem) => {
    return axios.put(`${API_URL}/${id}`, cartItem);
};

export const deleteCartItem = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

export const clearCart = (userId) => {
    return axios.delete(`${API_URL}/clear/${userId}`);
};