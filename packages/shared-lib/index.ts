// Shared library exports

// Newsletter service
export {
  sendConfirmationEmail,
  sendReminderEmail,
  sendNewsletter,
  getNewsletterStats,
  getSubscriberCount,
  type NewsletterSubscriber,
  type SendGridEmail,
} from './newsletter-service';

// Affiliate management
export {
  encodeAffiliateLink,
  decodeAffiliateLink,
  generateTrackingCode,
  createAffiliateLink,
  getProgramsByCategory,
  getProgramById,
  AFFILIATE_PROGRAMS,
  type AffiliateProgram,
  type AffiliateLink,
  type AffiliateClick,
} from './affiliate/affiliate-manager';
