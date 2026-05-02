export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <head>
        <style>{`
          a.nav-link {
            color: #ccc;
            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
            display: flex;
            align-items: center;
            padding: 0 14px;
            border-bottom: 2px solid transparent;
            white-space: nowrap;
            transition: color 0.15s, border-color 0.15s;
          }
          a.nav-link:hover {
            color: #fff;
            border-bottom-color: #555;
          }
        `}</style>
      </head>
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
          padding: '0 24px',
          display: 'flex',
          alignItems: 'stretch',
          gap: '4px',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: '52px',
        }}>
          <a href="/admin/dashboard" style={{
            fontWeight: 700,
            color: '#fff',
            fontSize: '17px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px 0 0',
            marginRight: '8px',
            borderRight: '1px solid #222',
          }}>
            ZYPERIA
          </a>
          {[
            { href: '/admin/dashboard', label: 'Dashboard' },
            { href: '/admin/pending-review', label: 'Por Rever' },
            { href: '/admin/queue', label: 'Fila' },
            { href: '/admin/breaking', label: 'Breaking' },
            { href: '/admin/glossary', label: 'Glossário' },
            { href: '/admin/articles', label: 'Artigos' },
            { href: '/admin/submit', label: 'Submeter' },
          ].map(item => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link"
            >
              {item.label}
            </a>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <a href="/admin/submit" style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#ccc',
              padding: '8px 16px',
              fontSize: '14px',
              textDecoration: 'none',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}>
              + Submeter
            </a>
          </div>
        </nav>
        <main style={{ padding: '24px', marginTop: '52px' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
