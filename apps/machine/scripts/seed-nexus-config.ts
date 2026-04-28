import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: path.join(__dirname, '../../crypto/.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const nexusConfigs = [
  {
    config_key: 'topic_distribution',
    config_value: {
      how_to: 0.7,
      comparison: 0.2,
      analysis: 0.1,
    },
    updated_by: 'seed',
  },
  {
    config_key: 'audience_focus',
    config_value: {
      iniciante: 0.5,
      intermédio: 0.4,
      avançado: 0.1,
    },
    updated_by: 'seed',
  },
  {
    config_key: 'daily_publish_limit',
    config_value: 3,
    updated_by: 'seed',
  },
  {
    config_key: 'circuit_breaker_threshold',
    config_value: 3,
    updated_by: 'seed',
  },
  {
    config_key: 'article_length',
    config_value: {
      min: 800,
      max: 3000,
    },
    updated_by: 'seed',
  },
]

async function seedNexusConfig() {
  console.log('=== SEEDING NEXUS CONFIG ===')

  for (const config of nexusConfigs) {
    const { error } = await supabase
      .from('nexus_config')
      .upsert(config, { onConflict: 'config_key' })

    if (error) {
      console.error(`Erro ao inserir ${config.config_key}:`, error.message)
    } else {
      console.log(`✅ ${config.config_key} inserido`)
    }
  }

  console.log('=== SEED COMPLETO ===')
}

seedNexusConfig()
