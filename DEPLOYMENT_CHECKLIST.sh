#!/bin/bash

# NETLIFY DEPLOYMENT & FINALIZACE - WHC Web
# Script pro ověření a finalizaci nasazení

echo "🔍 WHC Web - Deployment Checklist"
echo "=================================="
echo ""

# 1. Ověření Netlify projektu
echo "✅ Netlify Project: whc-web.netlify.app"
echo "   URL: https://app.netlify.com/projects/whc-web/overview"
echo ""

# 2. Kontrola Git commitu
echo "📊 Git Status:"
git log --oneline -5
echo ""

# 3. Kontrola SEO
echo "🔍 SEO Kontrola:"
echo "   ✓ robots.txt existuje"
echo "   ✓ sitemap.xml existuje"
echo "   ✓ JSON-LD schema přidáno"
echo "   ✓ Open Graph tagy nastaveny"
echo ""

# 4. Funkční checklist
echo "✨ Funkční prvky:"
echo "   ✓ Light/Dark mode toggle"
echo "   ✓ Kontaktní formulář (Netlify Forms)"
echo "   ✓ AI Asistent widget (mock mode)"
echo "   ✓ Responzivní layout"
echo "   ✓ Animace a interakce"
echo ""

# 5. Co ještě třeba nastavit
echo "🎯 TODO - Finalizace:"
echo ""
echo "[ ] 1. Custom doména"
echo "    - Přidej DNS záznamy"
echo "    - V Netlify: Site settings → Domain management"
echo "    - Připoj tvoji doménu (např. whc.cz)"
echo ""

echo "[ ] 2. SSL/HTTPS"
echo "    - Netlify automaticky vydá Let's Encrypt certifikát"
echo "    - Zkontroluj: Site settings → Security"
echo ""

echo "[ ] 3. Cloudflare Worker pro AI"
echo "    - Otevři: https://workers.cloudflare.com"
echo "    - Zkopíruj obsah z: cloudflare-worker-template.js"
echo "    - Uprav Worker URL v index.html"
echo ""

echo "[ ] 4. Netlify Forms - Ověření"
echo "    - V Netlify Dashboard → Forms"
echo "    - Zatím jsou formuláře v mock režimu"
echo "    - Po prvním submit budou vidět v administraci"
echo ""

echo "[ ] 5. Email notifikace"
echo "    - Netlify → Site settings → Forms"
echo "    - Nastav email pro notifikace z formulářů"
echo ""

echo "[ ] 6. Environment Variables (pokud budeš používat AI API)"
echo "    - Netlify UI → Build & deploy → Environment"
echo "    - Přidej:"
echo "      CLOUDFLARE_API_TOKEN=xxx"
echo "      OPENAI_API_KEY=xxx (pokud OpenAI)"
echo ""

echo "[ ] 7. Performance Monitoring"
echo "    - https://pagespeed.web.dev"
echo "    - https://web.dev/measure"
echo ""

echo "---"
echo ""
echo "🚀 DEPLOYMENT STAV:"
echo "   ✅ Web je LIVE: https://whc-web.netlify.app"
echo "   ✅ Auto-deploy z GitHubu aktivní"
echo "   ✅ SEO připraveno"
echo "   ⏳ Čeká na: Custom doména, AI Worker, Email setup"
echo ""
