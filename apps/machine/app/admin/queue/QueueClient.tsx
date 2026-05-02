'use client'

import React, { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Article = {
  id: string
  title: string
  app_id: string
  generation_approach: string
  created_at: string
  scheduled_for: string | null
  reading_time_minutes: number | null
  slug: string
}

const APP_COLORS: Record<string, string> = {
  'blog-crypto': '#FFB800',
  'blog-intelligence': '#00B4FF',
  'blog-onlinebiz': '#AEEA00',
  'crypto': '#FFB800',
  'intelligence': '#00B4FF',
  'onlinebiz': '#AEEA00',
}

const TIPO_LABELS: Record<string, string> = {
  'breaking_news': 'TIPO 1',
  'youtube_newsletter': 'TIPO 2',
  'evergreen': 'TIPO 3',
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
}

function countPerDayBlog(articles: Article[], date: string | null, app_id: string, excludeId: string) {
  if (!date) return 0
  const day = new Date(date).toDateString()
  return articles.filter(a =>
    a.id !== excludeId &&
    a.app_id === app_id &&
    a.scheduled_for &&
    new Date(a.scheduled_for).toDateString() === day
  ).length
}

type SortableItemProps = {
  article: Article
  articles: Article[]
  idx: number
  saving: string | null
  onSchedule: (id: string, action: string, customDate?: string) => void
}

function SortableItem({ article, articles, idx, saving, onSchedule }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: article.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const color = APP_COLORS[article.app_id] ?? '#888'
  const tipo = TIPO_LABELS[article.generation_approach] ?? '—'
  const isSaving = saving === article.id
  const dayCount = countPerDayBlog(articles, article.scheduled_for, article.app_id, article.id)
  const overLimit = dayCount >= 3

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: '#111',
        border: `1px solid ${overLimit ? '#7f1d1d' : '#222'}`,
        borderLeft: `4px solid ${color}`,
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        opacity: isSaving ? 0.6 : (isDragging ? 0.5 : 1),
        cursor: isDragging ? 'grabbing' : 'default',
        userSelect: 'none',
      }}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: 'grab',
          color: '#444',
          fontSize: '18px',
          padding: '4px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          flexShrink: 0,
        }}
        title="Arrastar para reordenar"
      >
        <div style={{ width: '16px', height: '2px', background: '#444', borderRadius: '1px' }}></div>
        <div style={{ width: '16px', height: '2px', background: '#444', borderRadius: '1px' }}></div>
        <div style={{ width: '16px', height: '2px', background: '#444', borderRadius: '1px' }}></div>
      </div>

      {/* Posição */}
      <div style={{ color: '#333', fontSize: '13px', minWidth: '20px', textAlign: 'center' }}>
        {idx + 1}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px' }}>
          {article.title}
        </div>
        <div style={{ fontSize: '12px', color: '#666', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ color }}>{article.app_id.replace('blog-', '')}</span>
          <span>{tipo}</span>
          {article.reading_time_minutes && <span>{article.reading_time_minutes} min</span>}
          {overLimit && <span style={{ color: '#f87171' }}>⚠️ +3/dia/blog</span>}
        </div>
      </div>

      {/* Scheduled date */}
      <div style={{ fontSize: '12px', color: '#888', minWidth: '120px', textAlign: 'right' }}>
        {formatDate(article.scheduled_for)}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => onSchedule(article.id, 'now')}
          disabled={isSaving}
          style={{ background: '#16a34a', border: 'none', borderRadius: '4px', color: '#fff', padding: '4px 10px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
        >
          Agora
        </button>
        <button
          onClick={() => onSchedule(article.id, 'delay_day')}
          disabled={isSaving}
          style={{ background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#aaa', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}
        >
          +1d
        </button>
        <button
          onClick={() => onSchedule(article.id, 'delay_week')}
          disabled={isSaving}
          style={{ background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#aaa', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}
        >
          +1sem
        </button>
        <input
          type="datetime-local"
          onChange={e => { if (e.target.value) onSchedule(article.id, 'custom', e.target.value) }}
          style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '4px', color: '#aaa', padding: '4px 6px', fontSize: '11px', cursor: 'pointer' }}
        />
      </div>
    </div>
  )
}

export default function QueueClient({ articles: initial }: { articles: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initial)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  async function scheduleAction(id: string, action: string, customDate?: string) {
    setSaving(id)
    setMessage('')

    let scheduled_for: string | null = null
    if (action === 'now') {
      scheduled_for = new Date().toISOString()
    } else if (action === 'delay_day') {
      const article = articles.find(a => a.id === id)
      const base = article?.scheduled_for ? new Date(article.scheduled_for) : new Date()
      base.setDate(base.getDate() + 1)
      scheduled_for = base.toISOString()
    } else if (action === 'delay_week') {
      const article = articles.find(a => a.id === id)
      const base = article?.scheduled_for ? new Date(article.scheduled_for) : new Date()
      base.setDate(base.getDate() + 7)
      scheduled_for = base.toISOString()
    } else if (action === 'custom' && customDate) {
      scheduled_for = new Date(customDate).toISOString()
    }

    try {
      const res = await fetch('/api/admin/queue-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, scheduled_for }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido')

      setArticles(prev => prev.map(a =>
        a.id === id ? { ...a, scheduled_for } : a
      ))
      setMessage('✅ Actualizado')
      setTimeout(() => setMessage(''), 2000)
    } catch (e: any) {
      setMessage(`Erro: ${e.message}`)
    } finally {
      setSaving(null)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = articles.findIndex(a => a.id === active.id)
    const newIndex = articles.findIndex(a => a.id === over.id)

    const newArticles = arrayMove(articles, oldIndex, newIndex)
    setArticles(newArticles)

    // Se ambos têm datas, faz swap das datas via API
    const activeArticle = articles[oldIndex]
    const overArticle = articles[newIndex]

    if (activeArticle.scheduled_for && overArticle.scheduled_for) {
      await scheduleAction(activeArticle.id, 'custom', overArticle.scheduled_for)
      await scheduleAction(overArticle.id, 'custom', activeArticle.scheduled_for)
    }
    // Se não têm datas, a reordenação é apenas visual (local state)
  }

  if (articles.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', color: '#666' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
        <div style={{ fontSize: '18px' }}>Fila vazia — nenhum artigo aprovado</div>
        <div style={{ fontSize: '14px', color: '#444', marginTop: '8px' }}>
          Aprova artigos em Pending Review para os ver aqui
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>
          Fila de Aprovados ({articles.length})
        </h1>
        {message && (
          <span style={{ fontSize: '14px', color: message.startsWith('✅') ? '#4ade80' : '#f87171' }}>
            {message}
          </span>
        )}
      </div>

      {/* @ts-expect-error - dnd-kit type compatibility with React 18 */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={articles.map(a => a.id)} strategy={verticalListSortingStrategy}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {articles.map((article, idx) => (
              <SortableItem
                key={article.id}
                article={article}
                articles={articles}
                idx={idx}
                saving={saving}
                onSchedule={scheduleAction}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
