import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, articleId, prompt, imageUrl, base64Data, filename } = body

    const { supabaseAdmin } = await import('../../../../lib/supabase-admin')

    if (action === 'generate') {
      if (!articleId || !prompt) {
        return NextResponse.json({ error: 'articleId e prompt obrigatórios' }, { status: 400 })
      }

      const replicate_api_token = process.env.REPLICATE_API_TOKEN
      if (!replicate_api_token) {
        return NextResponse.json({ error: 'REPLICATE_API_TOKEN não configurada' }, { status: 500 })
      }

      // Start generation
      const generateRes = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${replicate_api_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: 'cab8f17b7b86cc5e0c5d1a1e51d2e5d3d5d5d5d5',
          input: { prompt },
        }),
      })

      if (!generateRes.ok) {
        const error = await generateRes.text()
        return NextResponse.json({ error: `Replicate error: ${error}` }, { status: 500 })
      }

      const prediction = await generateRes.json()
      const predictionId = prediction.id

      // Poll for completion (max 30s)
      let result: any = null
      let completed = false
      const startTime = Date.now()

      while (Date.now() - startTime < 30000) {
        const statusRes = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
          headers: { 'Authorization': `Bearer ${replicate_api_token}` },
        })
        const statusData = await statusRes.json()

        if (statusData.status === 'succeeded') {
          result = statusData.output
          completed = true
          break
        } else if (statusData.status === 'failed') {
          return NextResponse.json({ error: 'Geração de imagem falhou' }, { status: 500 })
        }

        await new Promise(resolve => setTimeout(resolve, 500))
      }

      if (!completed) {
        return NextResponse.json({ error: 'Timeout gerando imagem' }, { status: 500 })
      }

      const imageUrl = Array.isArray(result) ? result[0] : result

      // Deactivate previous image
      await supabaseAdmin
        .from('article_images')
        .update({ is_active: false })
        .eq('article_id', articleId)

      // Insert new image
      const { data: imageData, error: insertError } = await supabaseAdmin
        .from('article_images')
        .insert({
          article_id: articleId,
          image_url: imageUrl,
          image_type: 'generated',
          is_active: true,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Update blog_posts
      const { error: updateError } = await supabaseAdmin
        .from('blog_posts')
        .update({
          featured_image_url: imageUrl,
          og_image_url: imageUrl,
          hero_image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', articleId)

      if (updateError) throw updateError

      return NextResponse.json({ ok: true, imageUrl })
    }

    if (action === 'set_url') {
      if (!articleId || !imageUrl) {
        return NextResponse.json({ error: 'articleId e imageUrl obrigatórios' }, { status: 400 })
      }

      // Deactivate previous
      await supabaseAdmin
        .from('article_images')
        .update({ is_active: false })
        .eq('article_id', articleId)

      // Insert new
      const { data: imageData, error: insertError } = await supabaseAdmin
        .from('article_images')
        .insert({
          article_id: articleId,
          image_url: imageUrl,
          image_type: 'url',
          is_active: true,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Update blog_posts
      const { error: updateError } = await supabaseAdmin
        .from('blog_posts')
        .update({
          featured_image_url: imageUrl,
          og_image_url: imageUrl,
          hero_image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', articleId)

      if (updateError) throw updateError

      return NextResponse.json({ ok: true, imageUrl })
    }

    if (action === 'register_upload') {
      if (!articleId || !imageUrl) {
        return NextResponse.json({ error: 'articleId e imageUrl obrigatórios' }, { status: 400 })
      }

      // Deactivate previous
      await supabaseAdmin
        .from('article_images')
        .update({ is_active: false })
        .eq('article_id', articleId)

      // Insert new with image_type 'uploaded'
      const { error: insertError } = await supabaseAdmin
        .from('article_images')
        .insert({
          article_id: articleId,
          image_url: imageUrl,
          image_type: 'uploaded',
          is_active: true,
          created_at: new Date().toISOString(),
        })

      if (insertError) throw insertError

      // Update blog_posts with multiple image URL fields
      const { error: updateError } = await supabaseAdmin
        .from('blog_posts')
        .update({
          featured_image_url: imageUrl,
          og_image_url: imageUrl,
          hero_image_url: imageUrl,
          image_type: 'uploaded',
          updated_at: new Date().toISOString(),
        })
        .eq('id', articleId)

      if (updateError) throw updateError

      return NextResponse.json({ ok: true, image_url: imageUrl })
    }

    if (action === 'upload') {
      if (!articleId || !base64Data || !filename) {
        return NextResponse.json({ error: 'articleId, base64Data e filename obrigatórios' }, { status: 400 })
      }

      // Decode base64
      const buffer = Buffer.from(base64Data.split(',')[1] || base64Data, 'base64')

      // Upload to Supabase Storage
      const timestamp = Date.now()
      const storagePath = `article-images/${articleId}/${timestamp}-${filename}`

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('images')
        .upload(storagePath, buffer, {
          contentType: `image/${filename.split('.').pop()}`,
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: publicUrl } = supabaseAdmin.storage
        .from('images')
        .getPublicUrl(storagePath)

      const imageUrl = publicUrl.publicUrl

      // Deactivate previous
      await supabaseAdmin
        .from('article_images')
        .update({ is_active: false })
        .eq('article_id', articleId)

      // Insert new
      const { data: imageData, error: insertError } = await supabaseAdmin
        .from('article_images')
        .insert({
          article_id: articleId,
          image_url: imageUrl,
          image_type: 'upload',
          is_active: true,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Update blog_posts
      const { error: updateError } = await supabaseAdmin
        .from('blog_posts')
        .update({
          featured_image_url: imageUrl,
          og_image_url: imageUrl,
          hero_image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', articleId)

      if (updateError) throw updateError

      return NextResponse.json({ ok: true, imageUrl })
    }

    if (action === 'remove') {
      if (!articleId) {
        return NextResponse.json({ error: 'articleId obrigatório' }, { status: 400 })
      }

      // Deactivate image
      await supabaseAdmin
        .from('article_images')
        .update({ is_active: false })
        .eq('article_id', articleId)

      // Nullify URLs
      const { error: updateError } = await supabaseAdmin
        .from('blog_posts')
        .update({
          featured_image_url: null,
          og_image_url: null,
          hero_image_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', articleId)

      if (updateError) throw updateError

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'action inválida' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
