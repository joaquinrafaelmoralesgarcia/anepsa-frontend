import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

vi.mock('../services/socketService', () => ({
  connect: vi.fn(),
  disconnect: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
}));

describe('ProtectedRoute', () => {
  test('redirige a /login si no hay usuario autenticado', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <Routes>
            <Route path="/login" element={<p>Página de login</p>} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <p>Contenido protegido</p>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText('Página de login')).toBeInTheDocument();
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });
});
