import { render, screen } from '@testing-library/react';
import StatusBadge from '../components/StatusBadge';

describe('StatusBadge', () => {
  test('muestra "Anticipo: Pagado" cuando pagoAnticipo es true', () => {
    render(<StatusBadge estatus="completada" pagoAnticipo={true} />);
    expect(screen.getByText('Anticipo: Pagado')).toBeInTheDocument();
  });

  test('muestra "Anticipo: Pendiente" cuando pagoAnticipo es false', () => {
    render(<StatusBadge estatus="pendiente" pagoAnticipo={false} />);
    expect(screen.getByText('Anticipo: Pendiente')).toBeInTheDocument();
  });

  test('muestra botón "Pagar anticipo" cuando hay anticipoUrl y no está pagado', () => {
    render(<StatusBadge estatus="pendiente" pagoAnticipo={false} anticipoUrl="https://stripe.com/pay/test" />);
    const link = screen.getByRole('link', { name: /pagar anticipo/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://stripe.com/pay/test');
  });

  test('no muestra botón de pago si ya está pagado', () => {
    render(<StatusBadge estatus="completada" pagoAnticipo={true} anticipoUrl="https://stripe.com/pay/test" />);
    expect(screen.queryByRole('link', { name: /pagar anticipo/i })).not.toBeInTheDocument();
  });

  test('muestra el estatus de la orden correctamente', () => {
    render(<StatusBadge estatus="en proceso" pagoAnticipo={false} />);
    expect(screen.getByText('en proceso')).toBeInTheDocument();
  });
});
