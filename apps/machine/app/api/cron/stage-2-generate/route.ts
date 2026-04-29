export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

/**
 * Vercel Cron Job - Stage 2: Content Generation
 * Runs daily at 02:00 UTC
 *
 * Trigger: https://your-domain.vercel.app/api/cron/stage-2-generate
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/stage-2-generate",
 *     "schedule": "0 2 * * *"
 *   }]
 * }
 */

import { createClient } from '@supabase/supabase-js';
import { generateWithClaude } from '@/lib/ai-router';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

async function getNexusArticleLength(): Promise<{ min: number; max: number }> {
  const { data } = await getSupabase()
    .from('nexus_config')
    .select('config_value')
    .eq('config_key', 'article_length')
    .single()

  return (data?.config_value as { min: number; max: number }) ?? { min: 800, max: 3000 }
}

async function generateArticleContent(
  topic: string,
  approach: string,
  systemPrompt: string,
  researchData: any,
  competitorUrl?: string,
  articleLength: { min: number; max: number } = { min: 800, max: 3000 }
) {
  try {
    let userPrompt = '';

    if (approach === 'original') {
      const factsSection = researchData?.keyFacts?.length > 0
        ? `FACTOS VERIFICADOS PARA USAR NO ARTIGO:
${researchData.keyFacts.map((f: string, i: number) => `${i + 1}. ${f}`).join('\n')}

CONTEXTO LUSÓFONO IDENTIFICADO:
${researchData.lusophoneContext || 'Adapta o conteúdo para Portugal, Brasil, Angola, Cabo Verde e Moçambique.'}`
        : `Adapta o conteúdo para o mercado lusófono (Portugal, Brasil, Angola, Cabo Verde, Moçambique).`

      userPrompt = `Escreve um artigo completo sobre: "${topic}"

${factsSection}

REGRAS FUNDAMENTAIS:
- Idioma: português acessível ao mercado lusófono global
- USA APENAS os factos verificados fornecidos acima — nunca inventes dados
- Se não tens facto verificado sobre algo, usa linguagem qualitativa: tipicamente, geralmente, na maioria dos casos
- Cada termo técnico DEVE ser explicado na primeira vez que aparece
- NUNCA deixes uma secção incompleta

ESTRUTURA OBRIGATÓRIA (5 partes, todas completas):
1. Título H1 em português — claro, específico, sem sufixos em inglês
2. Introdução — o problema real e o que o leitor vai aprender
3. Desenvolvimento — 3 secções H2 com factos verificados, exemplos concretos, jargão explicado
4. Conclusão completa — síntese + uma acção concreta que o leitor pode fazer hoje
5. Meta description (máx 155 caracteres) + 5 keywords separadas por vírgula

ANTES DE TERMINAR: confirma que cada uma das 5 partes está completa e que usaste apenas factos verificados.
Formata em markdown válido.`;
    } else if (approach === 'transformed') {
      userPrompt = `Transform and improve an article about: "${topic}"

Competitor source: ${competitorUrl || 'N/A'}

Requirements:
- Rewrite with at least 30% new content
- Add updated data, statistics, or examples from 2024-2026
- Include new insights or perspectives
- Keep the core structure but improve clarity
- Add sections the original may have missed
- Cite the original source in a transparent way
- Make it 15-20% longer with more depth

Format as markdown with H1 title.`;
    } else {
      userPrompt = `Create a synthesized meta-analysis about: "${topic}"

Compile insights from multiple sources:
${researchData?.sources?.slice(0, 5).join(', ') || 'N/A'}

Requirements:
- Create a "State of ${topic}" or "Comprehensive Overview" style article
- Identify common themes and disagreements
- Present multiple perspectives
- Cite each source clearly
- Add your own synthesis and analysis
- Include practical takeaways
- Compare different approaches or tools

Format as markdown with H1 title.`;
    }

    const response = await generateWithClaude(systemPrompt, userPrompt);

    const lines = response.content.split('\n');
    let titleLine = '';
    let contentStartIdx = 0;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# ')) {
        titleLine = lines[i].replace('# ', '').trim();
        contentStartIdx = i + 1;
        break;
      }
    }

    const title = titleLine || `${topic} â€“ Complete Guide 2026`;
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const content = lines.slice(contentStartIdx).join('\n').trim();

    const firstParagraphMatch = content.match(/^[^\n]+/);
    const excerpt = firstParagraphMatch
      ? firstParagraphMatch[0].substring(0, 160).trim()
      : `Learn about ${topic} in this comprehensive guide.`;

    const metaDescription = `${title} - Updated guide for 2024-2026 with latest data and expert insights.`.substring(0, 160);

    const keywords = topic
      .split(' ')
      .filter((w) => w.length > 3)
      .concat([topic, `${topic} guide`, `how to ${topic}`])
      .slice(0, 10);

    return { title, slug, content, excerpt, metaDescription, keywords };
  } catch (error) {
    console.error('Error generating article:', error);
    const title = `${topic} â€“ Complete Guide 2026`;
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      title,
      slug,
      content: `# ${title}\n\n[Content generation failed, please retry]`,
      excerpt: `Guide to ${topic}`,
      metaDescription: `Guide to ${topic}`,
      keywords: topic.split(' '),
    };
  }
}

async function runStage2(appFilter: string | null = null) {
  console.log('\n=== STAGE 2: CONTENT GENERATION (CRON JOB) ===');
  console.log(`Started at: ${new Date().toISOString()}`);
  if (appFilter) console.log(`Filtering by app: ${appFilter}`);

  try {
    const { data: apps } = await getSupabase().from('theme_config').select('*');

    const filteredApps = appFilter
      ? (apps || []).filter(a => a.app_id === appFilter)
      : (apps || []);

    for (const app of filteredApps) {
      console.log(`\nGenerating articles for: ${app.app_id}`);

      const articleLength = await getNexusArticleLength()
      const mix = app.articles_per_day === 1
        ? { original: 1, transformed: 0, aggregated: 0 }
        : {
            original: Math.ceil(app.articles_per_day * 0.4),
            transformed: Math.ceil(app.articles_per_day * 0.5),
            aggregated: Math.ceil(app.articles_per_day * 0.1),
          }

      console.log(`[NEXUS] article_length: ${articleLength.min}-${articleLength.max} palavras`)
      console.log(`Content mix: ${mix.original} original, ${mix.transformed} transformed, ${mix.aggregated} aggregated`);

      const { data: researchItems, error: researchError } = await getSupabase()
        .from('content_research')
        .select('id, topic, research_data, content_gaps, competitive_analysis')
        .eq('app_id', app.app_id)
        .eq('research_type', 'original')
        .order('created_at', { ascending: false })
        .limit(mix.original + mix.transformed + mix.aggregated);

      console.log(`content_research query — app: ${app.app_id}, count: ${researchItems?.length}, error: ${researchError?.message}`);

      if (researchError) {
        console.error(`Query error for ${app.app_id}:`, researchError.message);
        continue;
      }

      if (!researchItems || researchItems.length === 0) {
        console.log(`âš  No research data available for ${app.app_id}`);
        continue;
      }

      let generatedCount = { original: 0, transformed: 0, aggregated: 0 };
      let currentIdx = 0;

      // Generate ORIGINAL articles (40%)
      for (let i = 0; i < mix.original && currentIdx < researchItems.length; i++) {
        const research = researchItems[currentIdx++];
        const startTime = Date.now();

        try {
          const articleData = await generateArticleContent(
            research.topic,
            'original',
            app.generation_system_prompt,
            research.research_data,
            undefined,
            articleLength
          );

          await getSupabase().from('blog_posts').insert({
            app_id: app.app_id,
            title: articleData.title,
            slug: articleData.slug,
            content: articleData.content,
            excerpt: articleData.excerpt,
            meta_description: articleData.metaDescription,
            keywords: articleData.keywords,
            status: 'draft',
            generation_approach: 'original',
            is_original_generated: true,
            is_transformed_content: false,
            is_aggregated_content: false,
            language: 'en',
          });

          const duration = Math.round((Date.now() - startTime) / 1000);
          console.log(`âœ“ Generated original article: "${articleData.title}" (${duration}s)`);
          generatedCount.original++;

          await getSupabase().from('generation_logs').insert({
            app_id: app.app_id,
            stage: 'generation',
            status: 'success',
            generation_approach: 'original',
            duration_seconds: duration,
            ai_model_used: 'claude-sonnet-4-5',
            cost_usd: 0.01,
          });
        } catch (error) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          console.error(`âœ— Error generating original article:`, error);

          await getSupabase().from('generation_logs').insert({
            app_id: app.app_id,
            stage: 'generation',
            status: 'failed',
            generation_approach: 'original',
            duration_seconds: duration,
            error_message: (error as Error).message,
            ai_model_used: 'claude-sonnet-4-5',
          });
        }
      }

      // Generate TRANSFORMED articles (50%)
      for (let i = 0; i < mix.transformed && currentIdx < researchItems.length; i++) {
        const research = researchItems[currentIdx++];
        const competitorUrl = research.competitive_analysis?.top_performing_articles?.[0]?.url;
        const startTime = Date.now();

        try {
          const articleData = await generateArticleContent(
            research.topic,
            'transformed',
            app.transformation_system_prompt,
            research.research_data,
            competitorUrl,
            articleLength
          );

          await getSupabase().from('blog_posts').insert({
            app_id: app.app_id,
            title: articleData.title,
            slug: articleData.slug,
            content: articleData.content,
            excerpt: articleData.excerpt,
            meta_description: articleData.metaDescription,
            keywords: articleData.keywords,
            status: 'draft',
            generation_approach: 'transformed',
            is_original_generated: false,
            is_transformed_content: true,
            is_aggregated_content: false,
            transformation_of: competitorUrl,
            language: 'en',
          });

          const duration = Math.round((Date.now() - startTime) / 1000);
          console.log(`âœ“ Generated transformed article: "${articleData.title}" (${duration}s)`);
          generatedCount.transformed++;

          await getSupabase().from('generation_logs').insert({
            app_id: app.app_id,
            stage: 'generation',
            status: 'success',
            generation_approach: 'transformed',
            duration_seconds: duration,
            transformation_source_url: competitorUrl,
            ai_model_used: 'claude-sonnet-4-5',
            cost_usd: 0.01,
          });
        } catch (error) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          console.error(`âœ— Error generating transformed article:`, error);

          await getSupabase().from('generation_logs').insert({
            app_id: app.app_id,
            stage: 'generation',
            status: 'failed',
            generation_approach: 'transformed',
            duration_seconds: duration,
            error_message: (error as Error).message,
            ai_model_used: 'claude-sonnet-4-5',
          });
        }
      }

      // Generate AGGREGATED articles (10%)
      for (let i = 0; i < mix.aggregated && currentIdx < researchItems.length; i++) {
        const research = researchItems[currentIdx++];
        const startTime = Date.now();

        try {
          const articleData = await generateArticleContent(
            research.topic,
            'aggregated',
            app.aggregation_system_prompt,
            research.research_data,
            undefined,
            articleLength
          );

          await getSupabase().from('blog_posts').insert({
            app_id: app.app_id,
            title: articleData.title,
            slug: articleData.slug,
            content: articleData.content,
            excerpt: articleData.excerpt,
            meta_description: articleData.metaDescription,
            keywords: articleData.keywords,
            status: 'draft',
            generation_approach: 'aggregated',
            is_original_generated: false,
            is_transformed_content: false,
            is_aggregated_content: true,
            language: 'en',
          });

          const duration = Math.round((Date.now() - startTime) / 1000);
          console.log(`âœ“ Generated aggregated article: "${articleData.title}" (${duration}s)`);
          generatedCount.aggregated++;

          await getSupabase().from('generation_logs').insert({
            app_id: app.app_id,
            stage: 'generation',
            status: 'success',
            generation_approach: 'aggregated',
            duration_seconds: duration,
            ai_model_used: 'claude-sonnet-4-5',
            cost_usd: 0.01,
          });
        } catch (error) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          console.error(`âœ— Error generating aggregated article:`, error);

          await getSupabase().from('generation_logs').insert({
            app_id: app.app_id,
            stage: 'generation',
            status: 'failed',
            generation_approach: 'aggregated',
            duration_seconds: duration,
            error_message: (error as Error).message,
            ai_model_used: 'claude-sonnet-4-5',
          });
        }
      }

      console.log(`Generated: ${generatedCount.original} original, ${generatedCount.transformed} transformed, ${generatedCount.aggregated} aggregated`);
    }

    console.log('\n=== STAGE 2 COMPLETE ===');
    return { statusCode: 200, body: 'Stage 2 complete' };
  } catch (error) {
    console.error('STAGE 2 FAILED:', error);
    return { statusCode: 500, body: (error as Error).message };
  }
}

/**
 * Vercel Cron Handler
 */
export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const url = new URL(request.url);
  const appFilter = url.searchParams.get('app') || null;
  const result = await runStage2(appFilter);
  return new Response(JSON.stringify(result), {
    status: result.statusCode,
    headers: { 'Content-Type': 'application/json' },
  });
}

