/**
 * ZYPERIA BRUTAL SYSTEM — Stage 4: Plagiarism Check & Verification
 * Runs at: 04:00 UTC daily
 * Purpose: Verify uniqueness (especially for transformed content), fact-check claims
 */

import { createClient } from '@supabase/supabase-js';
import { runPlagiarismCheck } from '../lib/plagiarism-checker';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const copyscapeApiToken = process.env.COPYSCAPE_API_TOKEN || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runStage4() {
  console.log('\n=== STAGE 4: PLAGIARISM CHECK & VERIFICATION ===');
  console.log(`Started at: ${new Date().toISOString()}`);

  try {
    // Get all draft articles that haven't been plagiarism checked
    const { data: articles } = await supabase
      .from('blog_posts')
      .select('id, app_id, title, content, generation_approach, transformation_of')
      .eq('status', 'draft')
      .is('plagiarism_checked_at', null)
      .limit(20);

    if (!articles || articles.length === 0) {
      console.log('No articles to check');
      return;
    }

    for (const article of articles) {
      const startTime = Date.now();

      try {
        // Get original article content if transformed
        let originalContent: string | undefined;
        if (article.generation_approach === 'transformed' && article.transformation_of) {
          const { data: originalArticles } = await supabase
            .from('blog_posts')
            .select('content')
            .eq('transformation_of', article.transformation_of)
            .limit(1);

          originalContent = originalArticles?.[0]?.content;
        }

        // Run plagiarism check
        const plagiarismResult = await runPlagiarismCheck(
          article.title,
          article.content,
          article.transformation_of,
          originalContent,
          copyscapeApiToken
        );

        // Update article with plagiarism score and status
        const newStatus =
          plagiarismResult.status === 'rejected'
            ? 'draft' // Reject, stays as draft for rework
            : plagiarismResult.status === 'warning'
              ? 'draft' // Needs review
              : 'draft'; // Keep as draft for next stage

        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({
            plagiarism_score: plagiarismResult.plagiarismScore,
            plagiarism_checked_at: new Date().toISOString(),
          })
          .eq('id', article.id);

        const duration = Math.round((Date.now() - startTime) / 1000);

        if (updateError) {
          console.error(`✗ Error checking plagiarism for "${article.title}":`, updateError.message);
          await supabase.from('generation_logs').insert({
            app_id: article.app_id,
            article_id: article.id,
            stage: 'plagiarism',
            status: 'failed',
            duration_seconds: duration,
            error_message: updateError.message,
          });
        } else {
          console.log(
            `✓ Plagiarism check: "${article.title}" – ${plagiarismResult.uniquenessPercentage}% unique (${plagiarismResult.status}) (${duration}s)`
          );

          const plagiarismDetails = {
            plagiarism_score: plagiarismResult.plagiarismScore,
            matches_found: plagiarismResult.matchesFound.length,
            improvement_percentage: plagiarismResult.uniquenessPercentage,
          };

          await supabase.from('generation_logs').insert({
            app_id: article.app_id,
            article_id: article.id,
            stage: 'plagiarism',
            status: plagiarismResult.status === 'rejected' ? 'warning' : 'success',
            duration_seconds: duration,
            plagiarism_check_result: plagiarismDetails,
            ai_model_used: 'copyscape',
            cost_usd: 0.15, // Approximate Copyscape cost per check
          });

          // If rejected, log improvement suggestions
          if (plagiarismResult.status === 'rejected' && plagiarismResult.improvementSuggestions) {
            console.log(`   Suggestions: ${plagiarismResult.improvementSuggestions.join('; ')}`);
          }
        }
      } catch (error) {
        const duration = Math.round((Date.now() - startTime) / 1000);
        console.error(`✗ Error in plagiarism check:`, error);

        await supabase.from('generation_logs').insert({
          app_id: article.app_id,
          article_id: article.id,
          stage: 'plagiarism',
          status: 'failed',
          duration_seconds: duration,
          error_message: (error as Error).message,
          ai_model_used: 'copyscape',
        });
      }
    }

    console.log('\n=== STAGE 4 COMPLETE ===');
  } catch (error) {
    console.error('STAGE 4 FAILED:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runStage4();
}

export { runStage4 };
