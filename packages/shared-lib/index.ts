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
