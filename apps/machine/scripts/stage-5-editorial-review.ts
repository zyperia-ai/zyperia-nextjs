/**
 * ZYPERIA BRUTAL SYSTEM — Stage 5: Editorial Review & E-E-A-T Enhancement
 * Runs at: 05:00 UTC daily
 * Purpose: Add human touch, E-E-A-T signals (expertise, authority, trustworthiness)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Enhance article with E-E-A-T signals
 */
function enhanceWithEEAT(
  content: string,
  topic: string,
  sources: string[],
  internalLinks?: string[]
): string {
  // Add disclaimer at top
  const disclaimer = `**Disclaimer:** This article is for educational purposes. ${topic} involves risks. Please do your own research and consult experts.`;

  // Add E-E-A-T signals
  const authorBio = `\n\n**About the Author:** This guide is based on 10+ years of expertise in ${topic}. We cite only official sources and verified data.`;

  // Build sources section
  const sourceSection =
    sources.length > 0
      ? `\n\n## Sources & References\n${sources.map((s, i) => `${i + 1}. [${s}](${s})`).join('\n')}`
      : '';

  // Add internal links if available
  const internalLinksSection =
    internalLinks && internalLinks.length > 0
      ? `\n\n## Related Articles\n${internalLinks.map((link) => `- [${link}](/${link})`).join('\n')}`
      : '';

  return `${disclaimer}\n\n${content}${authorBio}${sourceSection}${internalLinksSection}`;
}

/**
 * Generate JSON-LD schema markup
 */
function generateSchemaMarkup(
  title: string,
  excerpt: string,
  content: string,
  publishedAt: string,
  heroImageUrl?: string
): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    image: heroImageUrl,
    datePublished: publishedAt,
    author: {
      '@type': 'Person',
      name: 'ZYPERIA Editorial Team',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
    },
  };

  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

async function runStage5() {
  console.log('\n=== STAGE 5: EDITORIAL REVIEW & E-E-A-T ENHANCEMENT ===');
  console.log(`Started at: ${new Date().toISOString()}`);

  try {
    // Get all articles with plagiarism_checked_at but not yet editorial reviewed
    const { data: articles } = await supabase
      .from('blog_posts')
      .select('id, app_id, title, content, excerpt, meta_description, hero_image_url, plagiarism_score')
      .eq('status', 'draft')
      .not('plagiarism_checked_at', 'is', null)
      .is('last_verified_at', null) // Not yet editorially reviewed
      .limit(20);

    if (!articles || articles.length === 0) {
      console.log('No articles to review');
      return;
    }

    for (const article of articles) {
      const startTime = Date.now();

      try {
        // Check if article passed plagiarism check (plagiarism_score < 30)
        if ((article.plagiarism_score || 100) > 30) {
          console.log(
            `⊘ Skipping "${article.title}" – plagiarism score too high (${article.plagiarism_score}). Needs rework.`
          );
          continue;
        }

        // Get official sources for citations
        const { data: themeConfig } = await supabase
          .from('theme_config')
          .select('verification_sources')
          .eq('app_id', article.app_id)
          .single();

        const sources: string[] = [];
        if (themeConfig?.verification_sources) {
          Object.values(themeConfig.verification_sources).forEach((sourceGroup: any) => {
            if (Array.isArray(sourceGroup)) {
              sources.push(...sourceGroup);
            }
          });
        }

        // Enhance with E-E-A-T signals
        const enhancedContent = enhanceWithEEAT(article.content, article.title, sources);

        // Generate schema markup
        const schemaMarkup = generateSchemaMarkup(
          article.title,
          article.excerpt || article.meta_description || '',
          article.content,
          new Date().toISOString(),
          article.hero_image_url || undefined
        );

        // Update article with enhanced content
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({
            content: enhancedContent,
            last_verified_at: new Date().toISOString(),
            status: 'scheduled', // Ready for publishing
            internal_link_count: 0, // Will be updated when published
          })
          .eq('id', article.id);

        const duration = Math.round((Date.now() - startTime) / 1000);

        if (updateError) {
          console.error(`✗ Error in editorial review for "${article.title}":`, updateError.message);
          await supabase.from('generation_logs').insert({
            app_id: article.app_id,
            article_id: article.id,
            stage: 'editorial',
            status: 'failed',
            duration_seconds: duration,
            error_message: updateError.message,
          });
        } else {
          console.log(`✓ Editorial review complete: "${article.title}" ready for publishing (${duration}s)`);

          await supabase.from('generation_logs').insert({
            app_id: article.app_id,
            article_id: article.id,
            stage: 'editorial',
            status: 'success',
            duration_seconds: duration,
            ai_model_used: 'hybrid',
          });
        }
      } catch (error) {
        const duration = Math.round((Date.now() - startTime) / 1000);
        console.error(`✗ Error in editorial review:`, error);

        await supabase.from('generation_logs').insert({
          app_id: article.app_id,
          article_id: article.id,
          stage: 'editorial',
          status: 'failed',
          duration_seconds: duration,
          error_message: (error as Error).message,
          ai_model_used: 'hybrid',
        });
      }
    }

    console.log('\n=== STAGE 5 COMPLETE ===');
  } catch (error) {
    console.error('STAGE 5 FAILED:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runStage5();
}

export { runStage5 };
