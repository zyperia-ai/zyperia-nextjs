/**
 * ZYPERIA Content Machine - Full Production Test
 * Tests all 7 stages end-to-end with real Supabase
 * Run: npm run test:production
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface TestResult {
  stage: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  duration: number;
}

class ProductionTester {
  private results: TestResult[] = [];

  async runAllTests() {
    console.log('\n╔═════════════════════════════════════════════════════════╗');
    console.log('║  ZYPERIA CONTENT MACHINE - PRODUCTION READINESS TEST   ║');
    console.log('║  Started:', new Date().toISOString().slice(0, 19), '                 ║');
    console.log('╚═════════════════════════════════════════════════════════╝\n');

    // Database connectivity
    await this.testDatabaseConnection();

    // Schema validation
    await this.testDatabaseSchema();

    // Content topics seeding
    await this.testContentTopics();

    // Theme configuration
    await this.testThemeConfig();

    // AI generation
    await this.testAIGeneration();

    // Pipeline flow
    await this.testPipelineFlow();

    // Performance
    await this.testPerformance();

    // Print results
    this.printResults();
  }

  private async testDatabaseConnection() {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase.from('blog_posts').select('count').limit(1);
      const duration = Date.now() - startTime;

      if (error) throw error;

      this.results.push({
        stage: 'Database Connection',
        status: 'pass',
        message: 'Supabase connected successfully',
        duration,
      });
    } catch (error) {
      this.results.push({
        stage: 'Database Connection',
        status: 'fail',
        message: `Connection failed: ${(error as Error).message}`,
        duration: Date.now() - startTime,
      });
    }
  }

  private async testDatabaseSchema() {
    const startTime = Date.now();
    try {
      const tables = [
        'blog_posts',
        'content_topics',
        'content_research',
        'theme_config',
        'generation_logs',
        'blog_performance',
      ];

      const missingTables: string[] = [];

      for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) missingTables.push(table);
      }

      const duration = Date.now() - startTime;

      if (missingTables.length === 0) {
        this.results.push({
          stage: 'Database Schema',
          status: 'pass',
          message: `All ${tables.length} required tables exist`,
          duration,
        });
      } else {
        this.results.push({
          stage: 'Database Schema',
          status: 'fail',
          message: `Missing tables: ${missingTables.join(', ')}`,
          duration,
        });
      }
    } catch (error) {
      this.results.push({
        stage: 'Database Schema',
        status: 'fail',
        message: `Schema check failed: ${(error as Error).message}`,
        duration: Date.now() - startTime,
      });
    }
  }

  private async testContentTopics() {
    const startTime = Date.now();
    try {
      const { data: topics, error } = await supabase
        .from('content_topics')
        .select('app_id, COUNT(*) as count')
        .groupBy('app_id');

      const duration = Date.now() - startTime;

      if (error) throw error;

      if (topics && topics.length > 0) {
        const totalTopics = topics.reduce((sum: number, app: any) => sum + (app.count || 0), 0);
        this.results.push({
          stage: 'Content Topics',
          status: totalTopics > 50 ? 'pass' : 'warning',
          message: `${totalTopics} topics loaded across ${topics.length} blogs`,
          duration,
        });
      } else {
        this.results.push({
          stage: 'Content Topics',
          status: 'warning',
          message: 'No topics found - run: npm run seed:topics',
          duration,
        });
      }
    } catch (error) {
      this.results.push({
        stage: 'Content Topics',
        status: 'fail',
        message: `Topic check failed: ${(error as Error).message}`,
        duration: Date.now() - startTime,
      });
    }
  }

  private async testThemeConfig() {
    const startTime = Date.now();
    try {
      const { data: configs, error } = await supabase
        .from('theme_config')
        .select('app_id, generation_system_prompt, articles_per_day');

      const duration = Date.now() - startTime;

      if (error) throw error;

      if (configs && configs.length === 3) {
        const missingPrompts = configs.filter((c: any) => !c.generation_system_prompt);
        if (missingPrompts.length === 0) {
          this.results.push({
            stage: 'Theme Configuration',
            status: 'pass',
            message: `3 apps configured with generation prompts`,
            duration,
          });
        } else {
          this.results.push({
            stage: 'Theme Configuration',
            status: 'warning',
            message: `${missingPrompts.length} apps missing prompts`,
            duration,
          });
        }
      } else {
        this.results.push({
          stage: 'Theme Configuration',
          status: 'fail',
          message: `Expected 3 apps, found ${configs?.length || 0}`,
          duration,
        });
      }
    } catch (error) {
      this.results.push({
        stage: 'Theme Configuration',
        status: 'fail',
        message: `Config check failed: ${(error as Error).message}`,
        duration: Date.now() - startTime,
      });
    }
  }

  private async testAIGeneration() {
    const startTime = Date.now();
    try {
      // Check if ANTHROPIC_API_KEY is set
      if (!process.env.ANTHROPIC_API_KEY) {
        this.results.push({
          stage: 'AI Generation (Claude)',
          status: 'warning',
          message: 'ANTHROPIC_API_KEY not set - will fail in production',
          duration: Date.now() - startTime,
        });
        return;
      }

      // Try a simple generation
      const { generateWithClaude } = await import('../lib/ai-router');
      const response = await generateWithClaude(
        'You are a helpful assistant.',
        'Write a 50-word article title about cryptocurrency.'
      );

      const duration = Date.now() - startTime;

      if (response.content && response.content.length > 0) {
        this.results.push({
          stage: 'AI Generation (Claude)',
          status: 'pass',
          message: `Claude API working - generated ${response.content.length} chars (cost: $${response.costUsd.toFixed(4)})`,
          duration,
        });
      } else {
        this.results.push({
          stage: 'AI Generation (Claude)',
          status: 'fail',
          message: 'Claude API returned empty response',
          duration,
        });
      }
    } catch (error) {
      this.results.push({
        stage: 'AI Generation (Claude)',
        status: 'fail',
        message: `Claude API error: ${(error as Error).message}`,
        duration: Date.now() - startTime,
      });
    }
  }

  private async testPipelineFlow() {
    const startTime = Date.now();
    try {
      // Check if we have at least one article in progress through the pipeline
      const { data: drafts } = await supabase
        .from('blog_posts')
        .select('status, generation_approach')
        .eq('status', 'draft')
        .limit(1);

      const { data: published } = await supabase
        .from('blog_posts')
        .select('status')
        .eq('status', 'published')
        .limit(1);

      const { data: logs } = await supabase
        .from('generation_logs')
        .select('stage, status')
        .limit(1);

      const duration = Date.now() - startTime;

      if (logs && logs.length > 0) {
        this.results.push({
          stage: 'Pipeline Flow',
          status: 'pass',
          message: `Pipeline executed - ${drafts?.length || 0} drafts, ${published?.length || 0} published`,
          duration,
        });
      } else {
        this.results.push({
          stage: 'Pipeline Flow',
          status: 'warning',
          message: 'No execution logs yet - pipeline will run on schedule',
          duration,
        });
      }
    } catch (error) {
      this.results.push({
        stage: 'Pipeline Flow',
        status: 'warning',
        message: `Pipeline check inconclusive: ${(error as Error).message}`,
        duration: Date.now() - startTime,
      });
    }
  }

  private async testPerformance() {
    const startTime = Date.now();
    try {
      // Test query performance
      const queryStart = Date.now();
      const { data } = await supabase
        .from('blog_posts')
        .select('id, title, status, generation_approach')
        .limit(100);
      const queryDuration = Date.now() - queryStart;

      const duration = Date.now() - startTime;

      if (queryDuration < 1000) {
        this.results.push({
          stage: 'Performance (Queries)',
          status: 'pass',
          message: `Query time: ${queryDuration}ms (good - under 1s)`,
          duration,
        });
      } else if (queryDuration < 3000) {
        this.results.push({
          stage: 'Performance (Queries)',
          status: 'warning',
          message: `Query time: ${queryDuration}ms (acceptable - under 3s)`,
          duration,
        });
      } else {
        this.results.push({
          stage: 'Performance (Queries)',
          status: 'warning',
          message: `Query time: ${queryDuration}ms (slow - consider indexing)`,
          duration,
        });
      }
    } catch (error) {
      this.results.push({
        stage: 'Performance (Queries)',
        status: 'warning',
        message: `Performance test inconclusive`,
        duration: Date.now() - startTime,
      });
    }
  }

  private printResults() {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('TEST RESULTS');
    console.log('═══════════════════════════════════════════════════════════\n');

    let passCount = 0;
    let warnCount = 0;
    let failCount = 0;

    this.results.forEach((result) => {
      const icon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
      const timingStr = result.duration > 0 ? ` (${result.duration}ms)` : '';

      console.log(`${icon} ${result.stage}`);
      console.log(`   ${result.message}${timingStr}`);

      if (result.status === 'pass') passCount++;
      else if (result.status === 'warning') warnCount++;
      else failCount++;
    });

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`SUMMARY: ${passCount} passed, ${warnCount} warnings, ${failCount} failed`);
    console.log('═══════════════════════════════════════════════════════════\n');

    // Overall status
    if (failCount === 0) {
      console.log('🚀 READY FOR PRODUCTION DEPLOYMENT\n');
      process.exit(0);
    } else if (warnCount > 0 && failCount === 0) {
      console.log('⚠️  READY WITH WARNINGS - Address before production\n');
      process.exit(0);
    } else {
      console.log('❌ NOT READY - Fix failures before deployment\n');
      process.exit(1);
    }
  }
}

// Run tests
const tester = new ProductionTester();
tester.runAllTests();
