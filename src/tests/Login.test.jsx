import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from '../pages/Login';
import * as authService from '../services/authService';

vi.mock('../services/authService');
vi.mock('../services/socketService', () => ({
  connect: vi.fn(),
  disconnect: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
}));

function renderLogin() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthProvider>
  );
}

describe('Login page', () => {
  test('renderiza formulario de login', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('correo@ejemplo.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test('muestra error si email está vacío al enviar', async () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    await waitFor(() => {
      expect(screen.getByText(/email es requerido/i)).toBeInTheDocument();
    });
  });

  test('muestra error si contraseña está vacía al enviar', async () => {
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('correo@ejemplo.com'), { target: { value: 'test@test.com' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    await waitFor(() => {
      expect(screen.getByText(/contraseña es requerida/i)).toBeInTheDocument();
    });
  });

  test('llama a authService.login con las credenciales correctas', async () => {
    authService.login.mockResolvedValue({
      user: { nombre: 'Admin', rol: 'admin' },
      accessToken: 'tok',
      refreshToken: 'ref',
    });

    renderLogin();
    fireEvent.change(screen.getByPlaceholderText('correo@ejemplo.com'), { target: { value: 'admin@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'Test1234!' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('admin@test.com', 'Test1234!');
    });
  });
});
