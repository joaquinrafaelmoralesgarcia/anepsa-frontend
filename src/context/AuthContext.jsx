import { createContext, useContext, useState } from 'react';
import { setToken, clearToken } from '../services/apiClient';
import * as socketService from '../services/socketService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  function handleLogin(userData, accessToken, refreshTkn) {
    setUser(userData);
    setTokenState(accessToken);
    setRefreshToken(refreshTkn);
    setToken(accessToken);
    socketService.connect(accessToken);
  }

  function handleLogout() {
    setUser(null);
    setTokenState(null);
    setRefreshToken(null);
    clearToken();
    socketService.disconnect();
  }

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
