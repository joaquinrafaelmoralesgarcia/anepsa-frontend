import apiClient from './apiClient';

export const getOrdenes = () => apiClient.get('/ordenes').then((r) => r.data.data);
export const getOrden = (id) => apiClient.get(`/ordenes/${id}`).then((r) => r.data.data);
export const createOrden = (data) => apiClient.post('/ordenes', data).then((r) => r.data.data);
export const updateOrden = (id, data) => apiClient.put(`/ordenes/${id}`, data).then((r) => r.data.data);
export const deleteOrden = (id) => apiClient.delete(`/ordenes/${id}`).then((r) => r.data.data);
