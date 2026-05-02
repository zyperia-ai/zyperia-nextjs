'use client'

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
          padding: '0 24px',
          display: 'flex',
          alignItems: 'stretch',
          gap: '4px',
        }}>
          <a href="/admin/dashboard" style={{
            fontWeight: 700,
            color: '#fff',
            fontSize: '16px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px 0 0',
            marginRight: '8px',
            borderRight: '1px solid #222',
          }}>
            ZYPERIA
          </a>
          {[
            { href: '/admin/dashboard', label: 'Dashboard' },
            { href: '/admin/pending-review', label: 'Pending Review' },
            { href: '/admin/queue', label: 'Fila' },
            { href: '/admin/breaking', label: 'Breaking' },
            { href: '/admin/glossary', label: 'Glossário' },
            { href: '/admin/submit', label: 'Submit' },
          ].map(item => (
            <a
              key={item.href}
              href={item.href}
              style={{
                color: '#aaa',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                padding: '16px 14px',
                borderBottom: '2px solid transparent',
                transition: 'color 0.15s, border-color 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#fff'
                ;(e.currentTarget as HTMLAnchorElement).style.borderBottomColor = '#555'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#aaa'
                ;(e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'transparent'
              }}
            >
              {item.label}
            </a>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <a href="/admin/submit" style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#aaa',
              padding: '8px 16px',
              fontSize: '13px',
              textDecoration: 'none',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}>
              + Submit
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
