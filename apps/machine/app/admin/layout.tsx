export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body style={{
        margin: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#0a0a0a',
        color: '#e5e5e5',
        minHeight: '100vh',
      }}>
        <nav style={{
          background: '#111',
          borderBottom: '1px solid #1a1a1a',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}>
          <a href="/admin/dashboard" style={{ fontWeight: 700, color: '#fff', fontSize: '15px', textDecoration: 'none' }}>
            ZYPERIA Admin
          </a>
          <a href="/admin/dashboard" style={{ color: '#666', textDecoration: 'none', fontSize: '13px' }}>Dashboard</a>
          <a href="/admin/pending-review" style={{ color: '#666', textDecoration: 'none', fontSize: '13px' }}>Pending Review</a>
          <a href="/admin/queue" style={{ color: '#666', textDecoration: 'none', fontSize: '13px' }}>Fila</a>
          <a href="/admin/breaking" style={{ color: '#666', textDecoration: 'none', fontSize: '13px' }}>Breaking</a>
          <a href="/admin/glossary" style={{ color: '#666', textDecoration: 'none', fontSize: '13px' }}>Glossário</a>
          <a href="/admin/submit" style={{ color: '#666', textDecoration: 'none', fontSize: '13px' }}>Submit</a>
          <div style={{ marginLeft: 'auto' }}>
            <a href="/admin/submit" style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#aaa',
              padding: '6px 14px',
              fontSize: '12px',
              textDecoration: 'none',
            }}>
              + Submit Manual
            </a>
          </div>
        </nav>
        <main style={{ padding: '24px' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
