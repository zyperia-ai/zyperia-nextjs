/**
 * Backlink Campaign Manager Script
 * Manages backlink hunting and outreach campaigns
 *
 * Usage:
 * npx ts-node scripts/backlink-campaign-manager.ts crypto find-opportunities
 * npx ts-node scripts/backlink-campaign-manager.ts crypto start-campaign
 * npx ts-node scripts/backlink-campaign-manager.ts crypto report
 */

import { createClient } from '@supabase/supabase-js';
import {
  findBacklinkOpportunities,
  generateOutreachMessage,
  sendOutreachEmail,
  getBacklinkAnalytics,
} from '../lib/backlink-hunter';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface CommandOptions {
  appId: string;
  command: string;
  limit?: number;
  batchSize?: number;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log(`
Usage: npx ts-node scripts/backlink-campaign-manager.ts <appId> <command> [options]

Commands:
  find-opportunities  - Discover backlink opportunities for top articles
  start-campaign     - Start outreach to qualified prospects
  report             - Show campaign analytics and performance
  check-acquisitions - Monitor for acquired backlinks
  cleanup-old        - Archive completed campaigns

Examples:
  npx ts-node scripts/backlink-campaign-manager.ts crypto find-opportunities --limit=50
  npx ts-node scripts/backlink-campaign-manager.ts crypto start-campaign --batch=20
  npx ts-node scripts/backlink-campaign-manager.ts crypto report
    `);
    process.exit(1);
  }

  const options: CommandOptions = {
    appId: args[0],
    command: args[1],
    limit: parseInt(args[2]?.split('=')[1] || '50'),
    batchSize: parseInt(args[3]?.split('=')[1] || '20'),
  };

  try {
    switch (options.command) {
      case 'find-opportunities':
        await findOpportunitiesCommand(options);
        break;
      case 'start-campaign':
        await startCampaignCommand(options);
        break;
      case 'report':
        await reportCommand(options);
        break;
      case 'check-acquisitions':
        await checkAcquisitionsCommand(options);
        break;
      case 'cleanup-old':
        await cleanupCommand(options);
        break;
      default:
        console.error(`Unknown command: ${options.command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

/**
 * Find and store backlink opportunities
 */
async function findOpportunitiesCommand(options: CommandOptions) {
  console.log(`\n🔍 Finding backlink opportunities for ${options.appId}...`);

  try {
    const opportunities = await findBacklinkOpportunities(options.appId, []);

    if (opportunities.length === 0) {
      console.log('❌ No top articles found to target for backlinks');
      return;
    }

    // Store opportunities in database
    const { data, error } = await supabase
      .from('backlink_opportunities')
      .insert(
        opportunities.slice(0, options.limit).map((opp: any) => ({
          app_id: options.appId,
          target_url: opp.target_url,
          target_title: opp.target_title,
          prospect_domain: opp.prospect_domain,
          prospect_url: opp.prospect_url,
          prospect_title: opp.prospect_title,
          relevance_score: opp.relevance_score,
          authority_score: opp.authority_score,
          traffic_estimate: opp.traffic_estimate,
          outreach_status: 'pending',
        }))
      )
      .select();

    if (error) {
      console.error('❌ Failed to store opportunities:', error);
      return;
    }

    console.log(`✅ Found and stored ${data?.length || 0} backlink opportunities`);
    console.log(`
Top 10 Opportunities:
${opportunities
  .slice(0, 10)
  .map(
    (opp: any, i: number) =>
      `  ${i + 1}. ${opp.prospect_domain}
     Relevance: ${opp.relevance_score}/100 | Authority: ${opp.authority_score}/100
     Target: ${opp.target_title.substring(0, 50)}...`
  )
  .join('\n')}
    `);
  } catch (error) {
    console.error('Error finding opportunities:', error);
  }
}

/**
 * Start outreach campaign to top opportunities
 */
async function startCampaignCommand(options: CommandOptions) {
  console.log(`\n📧 Starting outreach campaign for ${options.appId}...`);

  try {
    // Get pending opportunities (sorted by relevance × authority)
    const { data: opportunities, error: fetchError } = await supabase
      .from('backlink_opportunities')
      .select('*')
      .eq('app_id', options.appId)
      .eq('outreach_status', 'pending')
      .order('relevance_score', { ascending: false })
      .limit(options.batchSize);

    if (fetchError) {
      console.error('❌ Failed to fetch opportunities:', fetchError);
      return;
    }

    if (!opportunities || opportunities.length === 0) {
      console.log('ℹ️ No pending opportunities to contact');
      return;
    }

    let successCount = 0;
    let failureCount = 0;

    for (const opp of opportunities) {
      try {
        // Generate personalized message
        const message = await generateOutreachMessage(
          opp.prospect_domain.split('.')[0],
          opp.prospect_domain,
          opp.target_title,
          [opp.prospect_title]
        );

        // Send email (mock in MVP)
        const sent = await sendOutreachEmail(opp, message);

        if (sent) {
          // Update status in database
          await supabase
            .from('backlink_opportunities')
            .update({
              outreach_status: 'sent',
              outreach_sent_at: new Date().toISOString(),
              outreach_message: message,
            })
            .eq('id', opp.id);

          successCount++;
          console.log(`✅ Outreach sent to ${opp.prospect_domain}`);
        } else {
          failureCount++;
        }
      } catch (error) {
        failureCount++;
        console.error(`❌ Failed to reach out to ${opp.prospect_domain}:`, error);
      }
    }

    console.log(`
Campaign Summary:
- Successfully sent: ${successCount}
- Failed: ${failureCount}
- Response pending for: ${successCount}
    `);
  } catch (error) {
    console.error('Error starting campaign:', error);
  }
}

/**
 * Show campaign analytics and performance
 */
async function reportCommand(options: CommandOptions) {
  console.log(`\n📊 Backlink Campaign Report for ${options.appId}`);

  try {
    const analytics = await getBacklinkAnalytics(options.appId);

    if (!analytics) {
      console.log('❌ Failed to generate report');
      return;
    }

    // Get acquisition details
    const { data: acquisitions } = await supabase
      .from('backlink_acquisitions')
      .select('*')
      .eq('app_id', options.appId)
      .eq('status', 'verified')
      .order('discovered_at', { ascending: false })
      .limit(10);

    console.log(`
📈 Campaign Statistics
${JSON.stringify(analytics, null, 2)}

🔗 Recent Backlinks Acquired:
${
  acquisitions && acquisitions.length > 0
    ? acquisitions
        .map(
          (acq: any, i: number) =>
            `  ${i + 1}. ${acq.source_domain}
     URL: ${acq.backlink_url}
     Anchor: ${acq.anchor_text || '(not specified)'}
     Type: ${acq.link_type || 'unknown'}`
        )
        .join('\n')
    : '  No backlinks acquired yet'
}

🎯 Next Steps:
1. Monitor response rate (target: >10%)
2. Track ranking improvements from acquired links
3. Follow up on non-responses after 1 week
4. Adjust messaging if conversion is low
    `);
  } catch (error) {
    console.error('Error generating report:', error);
  }
}

/**
 * Check for acquired backlinks
 */
async function checkAcquisitionsCommand(options: CommandOptions) {
  console.log(`\n🔗 Checking for acquired backlinks...`);

  try {
    // In production: use Ahrefs or Moz API to detect new backlinks
    // For MVP: just show current acquisitions

    const { data: acquisitions } = await supabase
      .from('backlink_acquisitions')
      .select('*')
      .eq('app_id', options.appId)
      .eq('status', 'verified')
      .order('discovered_at', { ascending: false });

    const { data: opportunities } = await supabase
      .from('backlink_opportunities')
      .select('*')
      .eq('app_id', options.appId)
      .eq('outreach_status', 'linked');

    console.log(`
✅ Backlinks Successfully Acquired: ${acquisitions?.length || 0}
📤 Opportunities That Resulted in Links: ${opportunities?.length || 0}

Total Estimated Traffic Gain: ${(acquisitions?.reduce((sum: number, a: any) => sum + (a.estimated_traffic_gain || 0), 0) || 0)} visitors/month
    `);
  } catch (error) {
    console.error('Error checking acquisitions:', error);
  }
}

/**
 * Clean up old completed campaigns
 */
async function cleanupCommand(options: CommandOptions) {
  console.log(`\n🧹 Cleaning up old campaigns for ${options.appId}...`);

  try {
    // Archive opportunities that are older than 60 days and haven't been contacted
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const { data, error } = await supabase
      .from('backlink_opportunities')
      .update({ outreach_status: 'archived' })
      .eq('app_id', options.appId)
      .eq('outreach_status', 'pending')
      .lt('created_at', sixtyDaysAgo.toISOString());

    if (error) {
      console.error('❌ Cleanup failed:', error);
      return;
    }

    // Also remove rejected opportunities older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await supabase
      .from('backlink_opportunities')
      .delete()
      .eq('app_id', options.appId)
      .eq('outreach_status', 'rejected')
      .lt('created_at', thirtyDaysAgo.toISOString());

    console.log(`✅ Cleanup complete`);
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

main();
