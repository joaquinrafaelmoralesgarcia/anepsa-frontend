import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import DashboardAdmin from '../pages/DashboardAdmin';
import * as ordenesService from '../services/ordenesService';

vi.mock('../services/ordenesService');
vi.mock('../services/socketService', () => ({
  connect: vi.fn(),
  disconnect: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
}));
vi.mock('../services/authService', () => ({
  logout: vi.fn(),
}));

const mockOrdenes = [
  { _id: '1', inmueble: { direccion: 'Av. Reforma 100' }, valuadorAsignado: { nombre: 'Juan' }, monto: 50000, estatus: 'pendiente', pagoAnticipo: false, fecha: '2026-06-01' },
  { _id: '2', inmueble: { direccion: 'Calle Madero 50' }, valuadorAsignado: null, monto: 80000, estatus: 'completada', pagoAnticipo: true, fecha: '2026-05-15' },
];

describe('DashboardAdmin', () => {
  test('renderiza lista de órdenes mockeada', async () => {
    ordenesService.getOrdenes.mockResolvedValue(mockOrdenes);

    render(
      <AuthProvider>
        <MemoryRouter>
          <DashboardAdmin />
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Av. Reforma 100')).toBeInTheDocument();
      expect(screen.getByText('Calle Madero 50')).toBeInTheDocument();
    });
  });

  test('muestra contadores de resumen', async () => {
    ordenesService.getOrdenes.mockResolvedValue(mockOrdenes);

    render(
      <AuthProvider>
        <MemoryRouter>
          <DashboardAdmin />
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Total órdenes')).toBeInTheDocument();
      expect(screen.getByText('Anticipos pagados')).toBeInTheDocument();
    });
  });
});
