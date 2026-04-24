'use client';

import { useState } from 'react';

interface Comment {
  id: string;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  avatar?: string;
  replies?: Comment[];
}

interface CommentsSectionProps {
  articleId: string;
  isDark?: boolean;
}

/**
 * Comments section for articles
 * TODO: Connect to Supabase comments table on May 1st
 */
export default function CommentsSection({ articleId, isDark = false }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Alice Bitcoin',
      email: 'alice@example.com',
      content: 'Great guide! This really helped me understand the basics. Can you write more about wallets?',
      createdAt: '2024-04-22',
      avatar: '👩',
    },
    {
      id: '2',
      author: 'Bob Ethereum',
      email: 'bob@example.com',
      content: 'Thanks for the clear explanation. I appreciated the comparison between different wallet types.',
      createdAt: '2024-04-21',
      avatar: '👨',
    },
  ]);

  const [formData, setFormData] = useState({
    author: '',
    email: '',
    content: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.author || !formData.email || !formData.content) {
      alert('Please fill in all fields');
      return;
    }

    // TODO: On May 1st, POST to /api/comments endpoint
    const newComment: Comment = {
      id: Date.now().toString(),
      author: formData.author,
      email: formData.email,
      content: formData.content,
      createdAt: new Date().toISOString().split('T')[0],
      avatar: '🧑',
    };

    setComments([newComment, ...comments]);
    setFormData({ author: '', email: '', content: '' });
    setSubmitted(true);

    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section
      className={`mt-12 pt-12 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
    >
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        💬 Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Share Your Thoughts
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className={`px-4 py-2 rounded-lg border ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none`}
            />
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`px-4 py-2 rounded-lg border ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none`}
            />
          </div>

          <textarea
            placeholder="Your comment..."
            rows={4}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none resize-none`}
          />

          <div className="mt-4 flex items-center justify-between">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              💡 Be respectful and constructive
            </p>
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg font-medium transition ${
                isDark
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Post Comment
            </button>
          </div>

          {submitted && (
            <p className="mt-2 text-green-500 text-sm">✓ Comment posted! Thank you.</p>
          )}
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}
            >
              <div className="flex gap-3">
                <div className="text-3xl flex-shrink-0">{comment.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {comment.author}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {comment.createdAt}
                    </span>
                  </div>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    {comment.content}
                  </p>
                  <button
                    className={`text-xs mt-2 ${
                      isDark
                        ? 'text-purple-400 hover:text-purple-300'
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
