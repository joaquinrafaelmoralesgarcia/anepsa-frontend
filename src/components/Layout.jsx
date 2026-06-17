import Navbar from './Navbar';
import NotificationToast from './NotificationToast';

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      <Navbar />
      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </main>
      <NotificationToast />
    </div>
  );
}
