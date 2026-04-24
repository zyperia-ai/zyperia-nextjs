'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--surface-0)] border-b border-white/10 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="h-display text-lg font-bold text-white">
          ZYPERIA OnlineBiz
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/articles" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
            Casos de Estudo
          </Link>
          <Link href="/archive" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
            Arquivo
          </Link>
          <Link href="/about" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
            Sobre
          </Link>
          <Link href="/contact" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
            Contacto
          </Link>
          <a href="#newsletter" className="btn-primary text-sm py-2 px-4">
            Subscrever
          </a>
        </div>

        {/* Mobile nav button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[var(--text-secondary)] hover:text-white"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[var(--surface-1)] border-t border-white/10 py-4 px-4 space-y-2">
          <Link href="/articles" className="block text-sm text-[var(--text-secondary)] hover:text-white py-2">
            Casos de Estudo
          </Link>
          <Link href="/archive" className="block text-sm text-[var(--text-secondary)] hover:text-white py-2">
            Arquivo
          </Link>
          <Link href="/about" className="block text-sm text-[var(--text-secondary)] hover:text-white py-2">
            Sobre
          </Link>
          <Link href="/contact" className="block text-sm text-[var(--text-secondary)] hover:text-white py-2">
            Contacto
          </Link>
          <a href="#newsletter" className="block btn-primary text-sm py-2 text-center">
            Subscrever
          </a>
        </div>
      )}
    </nav>
  )
}
