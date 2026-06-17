import apiClient, { setToken, clearToken } from './apiClient';

export async function login(email, password) {
  const { data } = await apiClient.post('/auth/login', { email, password });
  setToken(data.data.accessToken);
  return data.data;
}

export async function logout(refreshToken) {
  try {
    await apiClient.post('/auth/logout', { refreshToken });
  } finally {
    clearToken();
  }
}

export async function refreshAccessToken(refreshToken) {
  const { data } = await apiClient.post('/auth/refresh', { refreshToken });
  setToken(data.data.accessToken);
  return data.data.accessToken;
}
