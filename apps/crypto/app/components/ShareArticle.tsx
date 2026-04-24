'use client'

import { Send, MessageCircle, Briefcase, Home, Copy, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

interface ShareArticleProps {
  title: string
  slug: string
  excerpt?: string
  variant?: 'compact' | 'full'
}

export default function ShareArticle({
  title,
  slug,
  excerpt,
  variant = 'compact',
}: ShareArticleProps) {
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const url = `https://crypto.zyperia.ai/articles/${slug}`
  const tweetText = `${title} ${url}`
  const linkedinText = `Check out: ${title}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  }

  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <Send className="h-4 w-4" />
          <span className="text-sm font-medium">Share</span>
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <a
              href={shareUrls.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
            >
              <MessageCircle className="h-4 w-4 text-blue-400" />
              <span className="text-sm">Twitter/X</span>
            </a>
            <a
              href={shareUrls.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
            >
              <Briefcase className="h-4 w-4 text-blue-700" />
              <span className="text-sm">LinkedIn</span>
            </a>
            <a
              href={shareUrls.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
            >
              <Home className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Facebook</span>
            </a>
            <button
              onClick={handleCopyLink}
              className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">Copy link</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Share this article</h3>
      <div className="grid grid-cols-2 gap-3">
        <a
          href={shareUrls.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <MessageCircle className="h-5 w-5 text-blue-400" />
          <span className="text-sm font-medium">Twitter</span>
        </a>
        <a
          href={shareUrls.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Briefcase className="h-5 w-5 text-blue-700" />
          <span className="text-sm font-medium">LinkedIn</span>
        </a>
        <a
          href={shareUrls.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Home className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium">Facebook</span>
        </a>
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium">Copy link</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
