export default function StatusBadge({ estatus, pagoAnticipo, anticipoUrl }) {
  const statusColors = {
    pendiente: '#f59e0b',
    'en proceso': '#3b82f6',
    completada: '#10b981',
    cancelada: '#ef4444',
  };

  const color = statusColors[estatus] || '#6b7280';

  return (
    <span style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <span
        style={{
          background: color,
          color: '#fff',
          padding: '2px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 600,
        }}
      >
        {estatus}
      </span>

      {pagoAnticipo ? (
        <span
          style={{
            background: '#10b981',
            color: '#fff',
            padding: '2px 10px',
            borderRadius: '12px',
            fontSize: '12px',
          }}
        >
          Anticipo: Pagado
        </span>
      ) : (
        <>
          <span
            style={{
              background: '#f59e0b',
              color: '#fff',
              padding: '2px 10px',
              borderRadius: '12px',
              fontSize: '12px',
            }}
          >
            Anticipo: Pendiente
          </span>
          {anticipoUrl && (
            <a
              href={anticipoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#6366f1',
                color: '#fff',
                padding: '2px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                textDecoration: 'none',
              }}
            >
              Pagar anticipo
            </a>
          )}
        </>
      )}
    </span>
  );
}
