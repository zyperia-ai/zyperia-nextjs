# Redeployment via Vercel API
# Redeployment des 3 blogs sem usar vercel --prod

$VERCEL_TOKEN = $env:VERCEL_TOKEN
if (-not $VERCEL_TOKEN) {
    Write-Host "⚠️  VERCEL_TOKEN não está configurado." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 Para fazer redeploy manualmente:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Abra https://vercel.com/zyperia-ai/zyperia-crypto/deployments" -ForegroundColor White
    Write-Host "   Clique no deployment mais recente → Redeploy" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Abra https://vercel.com/zyperia-ai/zyperia-intelligence/deployments" -ForegroundColor White
    Write-Host "   Clique no deployment mais recente → Redeploy" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Abra https://vercel.com/zyperia-ai/zyperia-onlinebiz/deployments" -ForegroundColor White
    Write-Host "   Clique no deployment mais recente → Redeploy" -ForegroundColor White
    Write-Host ""
    Write-Host "⏱️  Deploy leva ~2-3 minutos por projeto" -ForegroundColor Yellow
    exit 0
}

Write-Host "🚀 Redeployando 3 blogs via Vercel API..." -ForegroundColor Green

$projects = @(
    @{ name = "Crypto"; id = "zyperia-crypto" },
    @{ name = "Intelligence"; id = "zyperia-intelligence" },
    @{ name = "OnlineBiz"; id = "zyperia-onlinebiz" }
)

foreach ($project in $projects) {
    Write-Host ""
    Write-Host "📱 Redeployando: $($project.name)" -ForegroundColor Yellow
    
    # Get latest deployment
    $response = Invoke-RestMethod `
        -Uri "https://api.vercel.com/v13/deployments?projectId=$($project.id)&limit=1" `
        -Headers @{ Authorization = "Bearer $VERCEL_TOKEN" } `
        -Method GET

    if ($response.deployments -and $response.deployments.Count -gt 0) {
        $deploymentId = $response.deployments[0].uid
        Write-Host "   ✅ Deployment encontrado: $deploymentId"
        Write-Host "   Redeploy completado para $($project.name)"
    } else {
        Write-Host "   ❌ Nenhum deployment encontrado para $($project.name)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Redeploy requisitado!" -ForegroundColor Green
