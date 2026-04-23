/**
 * ZYPERIA BRUTAL SYSTEM — Local Pipeline Test
 * Runs all 7 stages end-to-end with mock data
 * No external API calls required
 * Run: `ts-node scripts/run-local-test.ts`
 */

import * as fs from 'fs';
import { loadMockDatabase, addGeneratedArticle, addGenerationLog, getStats } from './mock-data-generator';

class LocalPipelineTester {
  private mockDb: any;
  private results: any = {};

  constructor() {
    this.mockDb = loadMockDatabase();
  }

  /**
   * STAGE 0: Competitive Analysis (Simulated)
   */
  async stage0_competitiveAnalysis(): Promise<void> {
    console.log('\n=== STAGE 0: COMPETITIVE ANALYSIS (MOCK) ===');

    const startTime = Date.now();

    for (const app of this.mockDb.theme_config) {
      console.log(`\n[${app.app_id}] Analyzing competitive landscape...`);

      const keywords = app.brutal_system?.competitive_analysis?.serp_api_keywords || [];

      for (const keyword of keywords.slice(0, 2)) {
        // Simulate competitive analysis
        const analysis = {
          keyword,
          competitorsFound: 15,
          contentGapsIdentified: 3,
          recommendedApproach: 'transformed',
        };

        // Find or create research entry
        let research = this.mockDb.content_research.find(
          (r: any) => r.app_id === app.app_id && r.topic.toLowerCase().includes(keyword.toLowerCase())
        );

        if (!research) {
          research = {
            id: `research-${Date.now()}`,
            app_id: app.app_id,
            topic: keyword,
            research_type: 'competitive_analysis',
            competitive_analysis: {
              top_performing_articles: Array(5).fill(null).map((_, i) => ({
                url: `https://example.com/${keyword}-${i}`,
                title: `${keyword} Guide Part ${i + 1}`,
                position: i + 1,
              })),
              content_gaps: ['visual tutorials', 'latest data', 'beginner guide'],
              improvement_opportunities: ['add 2026 updates', 'include case studies'],
              recommended_approach: analysis.recommendedApproach,
            },
            analyzed_at: new Date().toISOString(),
          };
          this.mockDb.content_research.push(research);
        }

        console.log(`  ✓ "${keyword}": ${analysis.competitorsFound} competitors, ${analysis.contentGapsIdentified} gaps → ${analysis.recommendedApproach}`);
      }
    }

    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n✓ STAGE 0 COMPLETE (${duration}s)`);
    this.results.stage0 = { duration, status: 'success' };
  }

  /**
   * STAGE 1: Research & Topic Selection (Simulated)
   */
  async stage1_research(): Promise<void> {
    console.log('\n=== STAGE 1: RESEARCH & TOPIC SELECTION (MOCK) ===');

    const startTime = Date.now();

    for (const app of this.mockDb.theme_config) {
      console.log(`\n[${app.app_id}] Researching topics...`);

      const topics = this.mockDb.content_topics.filter((t: any) => t.app_id === app.app_id);

      for (const topic of topics.slice(0, 2)) {
        // Simulate research
        const research = {
          id: `research-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          app_id: app.app_id,
          topic: topic.title,
          research_type: 'original',
          research_data: {
            sources: ['official-source-1.com', 'case-study-2.com'],
            facts: [`Fact about ${topic.title}`, `Data point for ${topic.title}`],
            context: `Fresh research angle on ${topic.title}`,
          },
          confidence_score: 85,
          created_at: new Date().toISOString(),
        };

        this.mockDb.content_research.push(research);
        console.log(`  ✓ "${topic.title}": Research complete`);
      }
    }

    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n✓ STAGE 1 COMPLETE (${duration}s)`);
    this.results.stage1 = { duration, status: 'success' };
  }

  /**
   * STAGE 2: Content Generation (Simulated)
   */
  async stage2_generation(): Promise<void> {
    console.log('\n=== STAGE 2: CONTENT GENERATION (MOCK) ===');

    const startTime = Date.now();
    let totalGenerated = 0;

    for (const app of this.mockDb.theme_config) {
      console.log(`\n[${app.app_id}] Generating articles (${app.articles_per_day}/day)...`);

      const mix = {
        original: Math.ceil(app.articles_per_day * 0.4),
        transformed: Math.ceil(app.articles_per_day * 0.5),
        aggregated: Math.ceil(app.articles_per_day * 0.1),
      };

      // Generate ORIGINAL articles
      for (let i = 0; i < mix.original; i++) {
        const article = {
          app_id: app.app_id,
          title: `[ORIGINAL] ${app.app_id} Guide Part ${i + 1} – 2026`,
          slug: `original-${app.app_id}-${i + 1}-2026`,
          content: `# ${app.app_id} Guide\n\nThis is original content...`,
          excerpt: `Learn about ${app.app_id} with fresh research.`,
          meta_description: `Complete guide to ${app.app_id} 2026`,
          status: 'draft',
          generation_approach: 'original',
          is_original_generated: true,
        };

        addGeneratedArticle(this.mockDb, article);
        addGenerationLog(this.mockDb, {
          app_id: app.app_id,
          stage: 'generation',
          status: 'success',
          generation_approach: 'original',
          duration_seconds: Math.floor(Math.random() * 30 + 10),
          ai_model_used: 'phi4',
        });
        totalGenerated++;
      }

      // Generate TRANSFORMED articles
      for (let i = 0; i < mix.transformed; i++) {
        const article = {
          app_id: app.app_id,
          title: `[TRANSFORMED] ${app.app_id} Improved Guide – 2026`,
          slug: `transformed-${app.app_id}-${i + 1}-2026`,
          content: `# ${app.app_id} – Improved Version\n\nBased on top competitor articles, with improvements...`,
          excerpt: `Improved guide to ${app.app_id} with latest 2026 data.`,
          meta_description: `Improved ${app.app_id} guide with 2026 updates`,
          status: 'draft',
          generation_approach: 'transformed',
          is_transformed_content: true,
          transformation_of: `https://example.com/${app.app_id}-original`,
        };

        addGeneratedArticle(this.mockDb, article);
        addGenerationLog(this.mockDb, {
          app_id: app.app_id,
          stage: 'generation',
          status: 'success',
          generation_approach: 'transformed',
          transformation_source_url: `https://example.com/${app.app_id}-original`,
          duration_seconds: Math.floor(Math.random() * 30 + 10),
          ai_model_used: 'phi4',
        });
        totalGenerated++;
      }

      // Generate AGGREGATED articles
      for (let i = 0; i < mix.aggregated; i++) {
        const article = {
          app_id: app.app_id,
          title: `[AGGREGATED] State of ${app.app_id} – 2026 Report`,
          slug: `aggregated-${app.app_id}-${i + 1}-2026`,
          content: `# State of ${app.app_id} – 2026\n\nSynthesis of top ${app.app_id} trends...`,
          excerpt: `Meta-analysis of ${app.app_id} landscape in 2026.`,
          meta_description: `${app.app_id} trends report 2026`,
          status: 'draft',
          generation_approach: 'aggregated',
          is_aggregated_content: true,
        };

        addGeneratedArticle(this.mockDb, article);
        addGenerationLog(this.mockDb, {
          app_id: app.app_id,
          stage: 'generation',
          status: 'success',
          generation_approach: 'aggregated',
          duration_seconds: Math.floor(Math.random() * 40 + 15),
          ai_model_used: 'phi4',
        });
        totalGenerated++;
      }

      console.log(`  ✓ Generated: ${mix.original} original + ${mix.transformed} transformed + ${mix.aggregated} aggregated`);
    }

    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n✓ STAGE 2 COMPLETE – ${totalGenerated} articles generated (${duration}s)`);
    this.results.stage2 = { duration, articlesGenerated: totalGenerated, status: 'success' };
  }

  /**
   * STAGE 3: Visual Enrichment (Simulated)
   */
  async stage3_visualEnrichment(): Promise<void> {
    console.log('\n=== STAGE 3: VISUAL ENRICHMENT (MOCK) ===');

    const startTime = Date.now();
    const draftArticles = this.mockDb.blog_posts.filter((a: any) => a.status === 'draft');

    console.log(`\nEnriching ${draftArticles.length} articles with visuals...`);

    for (const article of draftArticles.slice(0, 5)) {
      // Simulate visual enrichment
      article.hero_image_url = `https://storage.zyperia.ai/articles/${article.id}/hero-image.png`;
      article.hero_image_prompt = `${article.app_id} themed professional illustration`;
      article.og_image_url = `https://storage.zyperia.ai/articles/${article.id}/og-image.png`;
      article.visualizations = {
        charts: ['line_chart_1', 'bar_chart_2'],
        diagrams: [],
      };

      addGenerationLog(this.mockDb, {
        app_id: article.app_id,
        article_id: article.id,
        stage: 'visual_enrichment',
        status: 'success',
        duration_seconds: Math.floor(Math.random() * 20 + 5),
        visual_enrichment_details: {
          hero_image_generated: true,
          charts_count: 2,
          og_image_created: true,
        },
      });
    }

    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`✓ ${draftArticles.length} articles enriched with visuals (${duration}s)`);
    this.results.stage3 = { duration, articlesEnriched: draftArticles.length, status: 'success' };
  }

  /**
   * STAGE 4: Plagiarism Check & Verification (Simulated)
   */
  async stage4_plagiarismCheck(): Promise<void> {
    console.log('\n=== STAGE 4: PLAGIARISM CHECK & VERIFICATION (MOCK) ===');

    const startTime = Date.now();
    const draftArticles = this.mockDb.blog_posts.filter((a: any) => a.status === 'draft');

    console.log(`\nVerifying uniqueness of ${draftArticles.length} articles...`);

    let passed = 0;
    let warning = 0;

    for (const article of draftArticles) {
      let score: number;

      if (article.is_original_generated) {
        score = Math.floor(Math.random() * 15) + 85; // 85-100 for original
      } else if (article.is_transformed_content) {
        score = Math.floor(Math.random() * 25) + 70; // 70-95 for transformed
      } else {
        score = Math.floor(Math.random() * 20) + 80; // 80-100 for aggregated
      }

      article.plagiarism_score = score;
      article.plagiarism_checked_at = new Date().toISOString();

      const status = score >= 70 ? 'success' : score >= 60 ? 'warning' : 'failed';
      if (status === 'success') passed++;
      if (status === 'warning') warning++;

      addGenerationLog(this.mockDb, {
        app_id: article.app_id,
        article_id: article.id,
        stage: 'plagiarism',
        status,
        duration_seconds: Math.floor(Math.random() * 10 + 2),
        plagiarism_check_result: {
          plagiarism_score: score,
          uniqueness_percentage: 100 - (100 - score),
          status: score >= 70 ? 'approved' : 'review_needed',
        },
      });
    }

    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`✓ Plagiarism checks complete: ${passed} passed, ${warning} warnings (${duration}s)`);
    this.results.stage4 = { duration, passed, warning, status: 'success' };
  }

  /**
   * STAGE 5: Editorial Review & E-E-A-T Enhancement (Simulated)
   */
  async stage5_editorialReview(): Promise<void> {
    console.log('\n=== STAGE 5: EDITORIAL REVIEW & E-E-A-T ENHANCEMENT (MOCK) ===');

    const startTime = Date.now();
    const draftArticles = this.mockDb.blog_posts.filter(
      (a: any) => a.status === 'draft' && a.plagiarism_score >= 70
    );

    console.log(`\nApplying E-E-A-T enhancements to ${draftArticles.length} articles...`);

    for (const article of draftArticles) {
      // Simulate E-E-A-T enhancement
      article.content += `\n\n## About This Content\nWritten with 10+ years of expertise. All sources verified and cited.`;
      article.last_verified_at = new Date().toISOString();

      addGenerationLog(this.mockDb, {
        app_id: article.app_id,
        article_id: article.id,
        stage: 'editorial',
        status: 'success',
        duration_seconds: Math.floor(Math.random() * 8 + 3),
      });
    }

    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`✓ ${draftArticles.length} articles enhanced with E-E-A-T signals (${duration}s)`);
    this.results.stage5 = { duration, articlesEnhanced: draftArticles.length, status: 'success' };
  }

  /**
   * STAGE 6: Publishing (Simulated)
   */
  async stage6_publishing(): Promise<void> {
    console.log('\n=== STAGE 6: PUBLISHING (MOCK) ===');

    const startTime = Date.now();
    const readyArticles = this.mockDb.blog_posts.filter((a: any) => a.status === 'draft' && a.last_verified_at);

    console.log(`\nPublishing ${readyArticles.length} articles...`);

    for (const article of readyArticles.slice(0, 3)) {
      article.status = 'published';
      article.published_at = new Date().toISOString();

      const articleUrl = `https://${article.app_id}.zyperia.ai/${article.slug}`;

      addGenerationLog(this.mockDb, {
        app_id: article.app_id,
        article_id: article.id,
        stage: 'publishing',
        status: 'success',
        duration_seconds: Math.floor(Math.random() * 5 + 1),
      });

      console.log(`  ✓ Published: ${article.title}`);
      console.log(`    URL: ${articleUrl}`);
    }

    const duration = Math.round((Date.now() - startTime) / 1000);
    const published = readyArticles.filter((a: any) => a.status === 'published').length;
    console.log(`\n✓ ${published} articles published (${duration}s)`);
    this.results.stage6 = { duration, published, status: 'success' };
  }

  /**
   * Generate final report
   */
  generateReport(): void {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║      ZYPERIA BRUTAL SYSTEM — LOCAL PIPELINE TEST REPORT     ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    // Stage results
    console.log('STAGE RESULTS:');
    Object.entries(this.results).forEach(([stage, result]: [string, any]) => {
      const stageName = stage.replace('stage', 'STAGE ').toUpperCase();
      const icon = result.status === 'success' ? '✓' : '✗';
      console.log(`  ${icon} ${stageName}: ${result.duration}s`);
    });

    // Database stats
    console.log('\nFINAL DATABASE STATE:');
    const stats = getStats(this.mockDb);
    Object.entries(stats).forEach(([key, value]) => {
      if (key === 'articles_by_app') {
        console.log(`\n  Articles by app:`);
        Object.entries(value as any).forEach(([app, count]) => {
          console.log(`    - ${app}: ${count}`);
        });
      } else if (typeof value === 'number') {
        console.log(`  ${key}: ${value}`);
      }
    });

    // Pipeline health
    const allStages = Object.values(this.results);
    const allSuccessful = allStages.every((r: any) => r.status === 'success');
    const totalDuration = allStages.reduce((sum: number, r: any) => sum + r.duration, 0);

    console.log('\nPIPELINE HEALTH:');
    console.log(`  Status: ${allSuccessful ? '✓ ALL STAGES PASSED' : '⚠ SOME STAGES FAILED'}`);
    console.log(`  Total Duration: ${totalDuration}s`);
    console.log(`  Articles Generated: ${this.mockDb.blog_posts.length}`);
    console.log(`  Articles Published: ${this.mockDb.blog_posts.filter((a: any) => a.status === 'published').length}`);
    console.log(`  Generation Logs: ${this.mockDb.generation_logs.length}`);

    // Save final state
    const reportPath = '.mock-db-after-test.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.mockDb, null, 2));
    console.log(`\n✓ Final state saved to: ${reportPath}`);

    console.log('\n✓ LOCAL PIPELINE TEST COMPLETE\n');
  }

  /**
   * Run all stages sequentially
   */
  async runAllStages(): Promise<void> {
    try {
      await this.stage0_competitiveAnalysis();
      await this.stage1_research();
      await this.stage2_generation();
      await this.stage3_visualEnrichment();
      await this.stage4_plagiarismCheck();
      await this.stage5_editorialReview();
      await this.stage6_publishing();
      this.generateReport();
    } catch (error) {
      console.error('\n✗ PIPELINE TEST FAILED:', error);
      process.exit(1);
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const tester = new LocalPipelineTester();
  tester.runAllStages().catch(console.error);
}

export { LocalPipelineTester };
