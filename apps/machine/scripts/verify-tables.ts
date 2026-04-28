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

async function verifyTables() {
  console.log('=== VERIFICANDO TABELAS ===\n')

  // Check content_research
  console.log('1. CONTENT_RESEARCH:')
  const { data: researchData, error: researchError, count: researchCount } = await supabase
    .from('content_research')
    .select('*', { count: 'exact' })
    .limit(1)

  if (researchError) {
    console.log(`   ✗ ERRO: ${researchError.message}`)
  } else {
    console.log(`   ✅ TABELA EXISTE (${researchCount} registos)`)
  }

  // Check nexus_config
  console.log('\n2. NEXUS_CONFIG:')
  const { data: nexusData, error: nexusError, count: nexusCount } = await supabase
    .from('nexus_config')
    .select('*', { count: 'exact' })

  if (nexusError) {
    console.log(`   ✗ ERRO: ${nexusError.message}`)
  } else {
    console.log(`   ✅ TABELA EXISTE (${nexusCount} registos)`)
    if (nexusData) {
      nexusData.forEach((item: any) => {
        console.log(`      - ${item.config_key}`)
      })
    }
  }
}

verifyTables()
