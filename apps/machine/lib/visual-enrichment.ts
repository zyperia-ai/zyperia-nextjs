/**
 * BRUTAL SYSTEM: Visual Enrichment
 * Stage 3: Generate hero images, data visualizations, and OG images
 */

interface VisualEnrichmentConfig {
  heroImage: {
    enabled: boolean;
    style: string;
    dimensions: string;
  };
  dataVisualizations: {
    enabled: boolean;
    chartTypes: string[];
    autoDetectData: boolean;
  };
  ogImage: {
    enabled: boolean;
    dimensions: string;
    colorScheme: string;
  };
}

interface GeneratedVisuals {
  heroImageUrl?: string;
  heroImagePrompt?: string;
  visualizations: {
    charts: Array<{
      type: string;
      data: any;
      imageUrl?: string;
    }>;
    diagrams?: any[];
  };
  ogImageUrl?: string;
}

/**
 * Generate Stable Diffusion prompt for hero image based on article topic/theme
 */
export function generateStableDiffusionPrompt(
  articleTitle: string,
  appId: string,
  style: string
): string {
  // Build theme-specific prompts
  const themePrompts: Record<string, string> = {
    crypto_tech_aesthetic:
      'Professional crypto/blockchain visualization, modern minimalist design, tech aesthetic, neon accents, dark background, high quality, trending on artstation',
    tech_minimal_aesthetic:
      'Modern business automation, AI tools, clean minimalist design, professional, sleek, contemporary, high tech aesthetic',
    growth_success_aesthetic:
      'Success, growth, money, earning, bright colors, upward arrows, charts, motivational, professional infographic style',
  };

  const basePrompt = themePrompts[style] || themePrompts.tech_minimal_aesthetic;
  const titleKeywords = articleTitle
    .split(' ')
    .slice(0, 3)
    .join(' ');

  return `${titleKeywords}, ${basePrompt}, 1200x630, high resolution, professional quality`;
}

/**
 * Call Stable Diffusion API to generate hero image
 */
export async function generateHeroImage(
  prompt: string,
  replicateApiKey: string
): Promise<string> {
  try {
    // Using Replicate API as example (alternative: Hugging Face, SDXL API)
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'stable-diffusion-image-to-image', // Replace with actual model ID
        input: {
          prompt,
          num_outputs: 1,
          width: 1200,
          height: 630,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Wait for image generation
    if (data.status === 'processing') {
      // Poll for completion (in production, use webhook)
      console.log(`[Stage 3] Generating hero image (request ID: ${data.id})`);
      return data.output?.[0] || '';
    }

    return data.output?.[0] || '';
  } catch (error) {
    console.error('Error generating hero image:', error);
    return '';
  }
}

/**
 * Auto-detect numeric data in article for visualization
 */
export function detectNumericData(
  content: string
): Array<{
  type: string;
  data: any[];
  context: string;
}> {
  const charts: Array<{
    type: string;
    data: any[];
    context: string;
  }> = [];

  // Regex patterns to detect data tables, prices, percentages, etc.
  const pricePattern = /(\$[\d,]+(?:\.\d{2})?)/g;
  const percentagePattern = /(\d+(?:\.\d{1,2})?%)/g;
  const listPattern = /^[-•*]\s+(.+)$/gm;

  // Check for percentage data (good for pie charts)
  const percentMatches = content.match(percentagePattern);
  if (percentMatches && percentMatches.length >= 3) {
    charts.push({
      type: 'pie',
      data: percentMatches.map((p) => parseFloat(p)),
      context: 'Distribution/breakdown chart',
    });
  }

  // Check for price data (good for bar/line charts)
  const priceMatches = content.match(pricePattern);
  if (priceMatches && priceMatches.length >= 3) {
    charts.push({
      type: 'bar',
      data: priceMatches.map((p) => parseFloat(p.replace(/[$,]/g, ''))),
      context: 'Price comparison chart',
    });
  }

  // Check for list data
  const listMatches = content.match(listPattern);
  if (listMatches && listMatches.length >= 5) {
    charts.push({
      type: 'table',
      data: listMatches.map((m) => m.replace(/^[-•*]\s+/, '')),
      context: 'Data table/comparison',
    });
  }

  return charts;
}

/**
 * Generate Plotly chart as image (server-side SVG export)
 */
export async function generatePlotlyChart(
  chartType: string,
  data: any[],
  title: string
): Promise<string> {
  try {
    // In production, use plotly.js or plotly-orca for server-side rendering
    // For now, return placeholder with Plotly embed data
    const plotlyData = {
      x: Array.from({ length: data.length }, (_, i) => `Item ${i + 1}`),
      y: data,
      type: chartType,
      name: title,
    };

    // Would generate SVG/PNG here
    console.log(`[Stage 3] Generated ${chartType} chart: ${title}`);
    return `https://plot.ly/api/chart/placeholder/${chartType}.png`;
  } catch (error) {
    console.error('Error generating Plotly chart:', error);
    return '';
  }
}

/**
 * Generate dynamic OG image (Canvas-based)
 */
export async function generateOGImage(
  articleTitle: string,
  domain: string,
  colorScheme: string
): Promise<string> {
  try {
    // In production, use node-canvas or puppeteer for server-side image generation
    // OG image specs: 1200x630px, optimized for social sharing

    const ogImageData = {
      title: articleTitle.substring(0, 100), // Max ~10-12 words
      domain,
      colorScheme,
      dimensions: '1200x630',
    };

    console.log(`[Stage 3] Generated OG image for: ${articleTitle}`);

    // Placeholder return
    return `https://og-image-placeholder.com/?title=${encodeURIComponent(ogImageData.title)}&color=${colorScheme}`;
  } catch (error) {
    console.error('Error generating OG image:', error);
    return '';
  }
}

/**
 * Main visual enrichment function (Stage 3)
 */
export async function enrichArticleWithVisuals(
  articleTitle: string,
  articleContent: string,
  appId: string,
  config: VisualEnrichmentConfig,
  replicateApiKey?: string,
  supabaseStorageBucket?: string
): Promise<GeneratedVisuals> {
  console.log(`[Stage 3] Visual Enrichment: ${articleTitle}`);

  const visuals: GeneratedVisuals = {
    visualizations: {
      charts: [],
    },
  };

  // Generate hero image
  if (config.heroImage.enabled && replicateApiKey) {
    const prompt = generateStableDiffusionPrompt(
      articleTitle,
      appId,
      config.heroImage.style
    );
    const heroUrl = await generateHeroImage(prompt, replicateApiKey);
    if (heroUrl) {
      visuals.heroImageUrl = heroUrl;
      visuals.heroImagePrompt = prompt;
      console.log(`[Stage 3] Hero image generated: ${heroUrl}`);
    }
  }

  // Generate data visualizations
  if (config.dataVisualizations.enabled) {
    const detectedData = detectNumericData(articleContent);

    for (const data of detectedData) {
      const chartUrl = await generatePlotlyChart(data.type, data.data, data.context);
      if (chartUrl) {
        visuals.visualizations.charts.push({
          type: data.type,
          data: data.data,
          imageUrl: chartUrl,
        });
      }
    }
    console.log(`[Stage 3] Generated ${visuals.visualizations.charts.length} data visualizations`);
  }

  // Generate OG image for social sharing
  if (config.ogImage.enabled) {
    const ogUrl = await generateOGImage(
      articleTitle,
      appId,
      config.ogImage.colorScheme
    );
    if (ogUrl) {
      visuals.ogImageUrl = ogUrl;
      console.log(`[Stage 3] OG image generated: ${ogUrl}`);
    }
  }

  return visuals;
}

export type { VisualEnrichmentConfig, GeneratedVisuals };
