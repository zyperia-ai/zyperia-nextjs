'use client'

import { useState } from 'react'

type Rule = {
  id: string
  term_original: string
  term_correct: string
  match_type: string
  case_sensitive: boolean
  excludes_context: string[] | null
  times_applied: number
  created_at: string
}

type PreserveTerm = {
  id: string
  term: string
  created_at: string
}

export default function GlossaryClient({ rules: initial, preserve: initialPreserve }: { rules: Rule[], preserve: PreserveTerm[] }) {
  const [rules, setRules] = useState<Rule[]>(initial)
  const [preserve, setPreserve] = useState<PreserveTerm[]>(initialPreserve)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // New rule form
  const [newOriginal, setNewOriginal] = useState('')
  const [newCorrect, setNewCorrect] = useState('')
  const [newMatchType, setNewMatchType] = useState('exact')
  const [newCaseSensitive, setNewCaseSensitive] = useState(false)

  // New preserve term
  const [newPreserve, setNewPreserve] = useState('')

  async function addRule() {
    if (!newOriginal.trim() || !newCorrect.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/glossary-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_rule',
          term_original: newOriginal.trim(),
          term_correct: newCorrect.trim(),
          match_type: newMatchType,
          case_sensitive: newCaseSensitive,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRules(prev => [data.rule, ...prev])
      setNewOriginal('')
      setNewCorrect('')
      setMessage('✅ Regra adicionada')
      setTimeout(() => setMessage(''), 2000)
    } catch (e: any) {
      setMessage(`Erro: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function deleteRule(id: string) {
    if (!confirm('Apagar esta regra?')) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/glossary-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_rule', id }),
      })
      if (!res.ok) throw new Error('Erro ao apagar')
      setRules(prev => prev.filter(r => r.id !== id))
      setMessage('✅ Regra apagada')
      setTimeout(() => setMessage(''), 2000)
    } catch (e: any) {
      setMessage(`Erro: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function addPreserveTerm() {
    if (!newPreserve.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/glossary-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_preserve', term: newPreserve.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPreserve(prev => [...prev, data.term])
      setNewPreserve('')
      setMessage('✅ Termo adicionado')
      setTimeout(() => setMessage(''), 2000)
    } catch (e: any) {
      setMessage(`Erro: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function deletePreserveTerm(id: string) {
    if (!confirm('Apagar este termo?')) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/glossary-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_preserve', id }),
      })
      if (!res.ok) throw new Error('Erro ao apagar')
      setPreserve(prev => prev.filter(t => t.id !== id))
      setMessage('✅ Termo apagado')
      setTimeout(() => setMessage(''), 2000)
    } catch (e: any) {
      setMessage(`Erro: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    background: '#111',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#e5e5e5',
    padding: '8px 12px',
    fontSize: '13px',
    boxSizing: 'border-box' as const,
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>Glossário Editorial</h1>
        {message && <span style={{ fontSize: '13px', color: message.startsWith('✅') ? '#4ade80' : '#f87171' }}>{message}</span>}
      </div>

      {/* Regras de substituição */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
          Regras de substituição ({rules.length})
          <span style={{ fontSize: '12px', fontWeight: 400, color: '#555', marginLeft: '8px' }}>
            find/replace aplicado pós-geração em todos os artigos
          </span>
        </div>

        {/* Add rule form */}
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto auto', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              value={newOriginal}
              onChange={e => setNewOriginal(e.target.value)}
              placeholder="Termo original"
              style={{ ...inputStyle, width: '100%' }}
            />
            <input
              type="text"
              value={newCorrect}
              onChange={e => setNewCorrect(e.target.value)}
              placeholder="Substituir por"
              style={{ ...inputStyle, width: '100%' }}
            />
            <select
              value={newMatchType}
              onChange={e => setNewMatchType(e.target.value)}
              style={{ ...inputStyle }}
            >
              <option value="exact">exact</option>
              <option value="contains">contains</option>
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#666', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <input type="checkbox" checked={newCaseSensitive} onChange={e => setNewCaseSensitive(e.target.checked)} />
              Case
            </label>
            <button
              onClick={addRule}
              disabled={saving || !newOriginal.trim() || !newCorrect.trim()}
              style={{ background: '#16a34a', border: 'none', borderRadius: '6px', color: '#fff', padding: '8px 14px', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}
            >
              + Adicionar
            </button>
          </div>
        </div>

        {/* Rules list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {rules.map(rule => (
            <div key={rule.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: '6px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <span style={{ fontSize: '13px', color: '#f87171', fontFamily: 'monospace' }}>{rule.term_original}</span>
                <span style={{ fontSize: '12px', color: '#444' }}>→</span>
                <span style={{ fontSize: '13px', color: '#4ade80', fontFamily: 'monospace' }}>{rule.term_correct}</span>
                <span style={{ fontSize: '11px', color: '#444', background: '#1a1a1a', padding: '2px 6px', borderRadius: '4px' }}>{rule.match_type}</span>
                {rule.case_sensitive && <span style={{ fontSize: '11px', color: '#444', background: '#1a1a1a', padding: '2px 6px', borderRadius: '4px' }}>case</span>}
              </div>
              <span style={{ fontSize: '11px', color: '#444', minWidth: '60px', textAlign: 'right' }}>
                {rule.times_applied}× aplicado
              </span>
              <button
                onClick={() => deleteRule(rule.id)}
                disabled={saving}
                style={{ background: 'none', border: '1px solid #333', borderRadius: '4px', color: '#666', padding: '4px 8px', cursor: 'pointer', fontSize: '11px' }}
              >
                Apagar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Termos a preservar */}
      <div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
          Termos a preservar ({preserve.length})
          <span style={{ fontSize: '12px', fontWeight: 400, color: '#555', marginLeft: '8px' }}>
            nunca alterar (DeFi, staking, etc.)
          </span>
        </div>

        {/* Add preserve form */}
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newPreserve}
              onChange={e => setNewPreserve(e.target.value)}
              placeholder="Termo a preservar (ex: DeFi)"
              style={{ ...inputStyle, flex: 1 }}
              onKeyDown={e => e.key === 'Enter' && addPreserveTerm()}
            />
            <button
              onClick={addPreserveTerm}
              disabled={saving || !newPreserve.trim()}
              style={{ background: '#16a34a', border: 'none', borderRadius: '6px', color: '#fff', padding: '8px 14px', cursor: 'pointer', fontSize: '13px' }}
            >
              + Adicionar
            </button>
          </div>
        </div>

        {/* Preserve list */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {preserve.map(term => (
            <div key={term.id} style={{ background: '#111', border: '1px solid #222', borderRadius: '6px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#e5e5e5', fontFamily: 'monospace' }}>{term.term}</span>
              <button
                onClick={() => deletePreserveTerm(term.id)}
                disabled={saving}
                style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '14px', padding: '0', lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
