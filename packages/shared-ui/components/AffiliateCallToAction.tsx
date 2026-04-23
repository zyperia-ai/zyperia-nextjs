'use client';

import Link from 'next/link';

interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  affiliateUrl: string;
  price?: string;
  rating?: number;
  badge?: string;
}

interface AffiliateCallToActionProps {
  product: AffiliateProduct;
  theme: 'crypto' | 'intelligence' | 'onlinebiz';
  isDark?: boolean;
  variant?: 'card' | 'inline' | 'banner';
}

const themeColors = {
  crypto: 'from-amber-400 to-orange-500',
  intelligence: 'from-blue-400 to-cyan-500',
  onlinebiz: 'from-emerald-400 to-teal-500',
};

export default function AffiliateCallToAction({
  product,
  theme,
  isDark = true,
  variant = 'card',
}: AffiliateCallToActionProps) {
  const gradientColor = themeColors[theme];

  const trackClick = async (productId: string) => {
    try {
      await fetch('/api/affiliate/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
    } catch (error) {
      console.error('Failed to track affiliate click');
    }
  };

  if (variant === 'inline') {
    return (
      <Link
        href={product.affiliateUrl}
        onClick={() => trackClick(product.id)}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          inline-flex items-center gap-3 px-4 py-2 rounded-lg font-medium
          text-white bg-gradient-to-r ${gradientColor} transition-all duration-200
          hover:shadow-lg hover:shadow-current/30 hover:scale-105
        `}
      >
        <span>{product.name}</span>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 3a1 1 0 100 2h3.586L9.293 9.293a1 1 0 001.414 1.414L16 6.414V10a1 1 0 102 0V4a1 1 0 00-1-1h-6z" />
          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
        </svg>
      </Link>
    );
  }

  if (variant === 'banner') {
    return (
      <div
        className={`
          rounded-xl overflow-hidden border backdrop-blur-sm
          ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-gray-100/50 border-gray-200'}
        `}
      >
        <div className="flex flex-col md:flex-row items-center gap-6 p-6">
          {/* Image */}
          {product.imageUrl && (
            <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {product.name}
              </h3>
              {product.badge && (
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-gradient-to-r rounded-full text-white">
                  {product.badge}
                </span>
              )}
            </div>
            <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              {product.rating && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.round(product.rating || 0) ? '⭐' : '☆'} />
                  ))}
                </div>
              )}
              <Link
                href={product.affiliateUrl}
                onClick={() => trackClick(product.id)}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  px-6 py-2 font-medium text-white rounded-lg
                  bg-gradient-to-r ${gradientColor} transition-all duration-200
                  hover:shadow-lg hover:shadow-current/30
                `}
              >
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: Card variant
  return (
    <div
      className={`
        rounded-xl overflow-hidden border transition-all duration-300
        hover:shadow-xl
        ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
      `}
    >
      {/* Image */}
      {product.imageUrl && (
        <div className="relative w-full h-40 overflow-hidden bg-gray-700">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
          {product.badge && (
            <div className="absolute top-3 right-3 px-3 py-1 text-xs font-bold bg-gradient-to-r rounded-full text-white">
              {product.badge}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className={`font-bold text-lg mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {product.name}
        </h3>

        <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {product.description}
        </p>

        {/* Rating & Price */}
        <div className="flex items-center justify-between mb-4">
          {product.rating && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-sm">{i < Math.round(product.rating || 0) ? '⭐' : '☆'}</span>
              ))}
            </div>
          )}
          {product.price && (
            <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {product.price}
            </span>
          )}
        </div>

        {/* CTA Button */}
        <Link
          href={product.affiliateUrl}
          onClick={() => trackClick(product.id)}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            w-full block text-center py-2 px-4 font-medium rounded-lg
            text-white bg-gradient-to-r ${gradientColor}
            transition-all duration-200 hover:shadow-lg hover:shadow-current/30
          `}
        >
          View Deal →
        </Link>
      </div>
    </div>
  );
}
