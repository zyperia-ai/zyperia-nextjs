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
          borderBottom: '1px solid #222',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}>
          <span style={{ fontWeight: 700, color: '#fff', fontSize: '16px' }}>
            ZYPERIA Admin
          </span>
          <a href="/admin/pending-review" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>
            Pending Review
          </a>
          <a href="/admin/queue" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>
            Fila
          </a>
          <a href="/admin/submit" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>
            Submit
          </a>
        </nav>
        <main style={{ padding: '24px' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
