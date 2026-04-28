# 🚀 WHC Web - Deployment Guide

**Status:** ✅ LIVE na Netlify | 🟡 Vyžaduje finalizaci

---

## Current Status

- **Live URL:** https://whc-web.netlify.app
- **Netlify Project:** whc-web.netlify.app
- **GitHub:** MEVERIK-SOLUTION/whc (branch: main)
- **Auto-deploy:** ✅ Aktivní (push do main = automaticky nasadí)

---

## ✅ Co je hotovo

- [x] Web design s dark/light mode
- [x] SEO optimalizace (robots.txt, sitemap.xml, JSON-LD)
- [x] Netlify konfigurace (netlify.toml)
- [x] Kontaktní formulář (Netlify Forms)
- [x] AI Asistent widget (UI ready, mock backend)
- [x] Responzivní mobilní design
- [x] Performance & Security headers

---

## 🎯 Finalizace - Co zbývá

### 1. Custom doména (5 min)

#### V Netlify UI:
1. Jdi na https://app.netlify.com/projects/whc-web
2. **Site settings** → **Domain management**
3. Klikni **Add custom domain**
4. Zadej svou doménu: `whc.cz` (nebo jakou máš)
5. Zkopíruj **DNS nastavení** z Netlify
6. Jdi na svého registrátora domény (GoDaddy, Wedos, apod.)
7. Vlož DNS záznamy (A records, CNAME)
8. Netlify automaticky vystaví SSL certifikát (Let's Encrypt)

**Poznámka:** Propagace DNS může trvat 24-48 hodin.

---

### 2. Email notifikace z formulářů (3 min)

1. Netlify → **Forms** tab
2. Vyber formulář "contact"
3. Klikni **Edit settings**
4. Přidej svůj email na **Form notifications**
5. Od teď dostaneš email, když se někdo podělí formulář

---

### 3. Cloudflare Workers AI (10-15 min)

#### A) Vytvoření Workeru:

1. Jdi na https://workers.cloudflare.com
2. Přihlas se / Založ účet (free tier dostačuje)
3. Vytvoř nový Worker: **Create a Service** → **Hello World**
4. Zkopíruj obsah z `cloudflare-worker-template.js`
5. Vlož to do editoru workeru
6. Ulož a nasaď ("Deploy")

#### B) Získání Worker URL:

Po nasazení dostaneš URL typu:
```
https://your-subdomain.workers.dev/api/chat
```

#### C) Propojení s webem:

1. Otevři `index.html` v editoru
2. Najdi řádek: `const workerURL = 'https://your-worker.workers.dev/api/chat';`
3. Nahraď `your-worker` svým Worker subdoménem
4. `git add index.html && git commit && git push`
5. Netlify automaticky redeploy

#### D) Testování:

- Jdi na https://whc-web.netlify.app
- Klikni na AI Asistent (chat bubble vpravo dole)
- Napiš zprávu
- Worker by měl odpovědět (aktuálně jen echo zprávy)

---

### 4. Propojení AI Modelu (volitelné, na později)

Máš 3 možnosti:

#### Option 1: Cloudflare AI (Doporučeno - free)
- V Cloudflare Workeru máš přístup ke modelům (llama-2, mistral)
- Bez dalších API klíčů
- Viz `cloudflare-worker-template.js` → `generateWithCloudflareAI()`

#### Option 2: GitHub Models (Pokud máš GitHub Copilot)
- V `cloudflare-worker-template.js` zakomentuj `generateWithCloudflareAI()`
- Odkomentuj `generateWithGitHubModels()`
- Přidej env var: `GITHUB_TOKEN` v Netlify

#### Option 3: OpenAI (Nejdražší, ale nejlepší)
- Zakomentuj ostatní
- Aktivuj `generateWithOpenAI()`
- Přidej env var: `OPENAI_API_KEY` v Netlify

---

## 📊 Performance & SEO

### Ověření:

```bash
# SEO Score
https://pagespeed.web.dev/?url=https://whc-web.netlify.app

# SEO Audit
https://www.seobility.net/de/seocheck/check.php?url=https://whc-web.netlify.app

# Lighthouse Report
# (Otevři Chrome DevTools → Lighthouse)
```

### Očekávané skóre:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

---

## 🔐 Security Checklist

- [x] HTTPS/SSL (auto)
- [x] Security headers (netlify.toml)
- [x] CORS headers přidány
- [x] X-Frame-Options: SAMEORIGIN
- [x] X-Content-Type-Options: nosniff

---

## 📱 Monitora & Support

### Netlify Monitoring:
- **Analytics:** Site overview → Analytics tab
- **Logy:** Deploys → Build logs
- **Errors:** Functions tab (pokud budeš používat)

### Cloudflare Monitoring (pokud používáš Worker):
- **Analytics:** Workers Overview tab
- **Errors:** Real time logs

---

## 🛠 Maintenance & Updates

### Jak updatovat web:

```bash
# 1. Uprav kód v index.html nebo jakémkoliv souboru
nano index.html

# 2. Ulož
# 3. Commituj
git add .
git commit -m "Update: Popis změny"

# 4. Push
git push origin main

# 5. Netlify automaticky redeploy (2-3 min)
```

### Jak updatovat Worker:

1. Jdi na https://workers.cloudflare.com
2. Edituj Worker
3. Deploy
4. Výsledky jsou okamžité

---

## 📞 Support & Help

### Netlify Docs:
- https://docs.netlify.com

### Cloudflare Workers Docs:
- https://developers.cloudflare.com/workers

### Kontakt:
- **Email:** info@whc.cz
- **GitHub Issues:** (pokud budeš chtít feedback)

---

## 🎉 Očekávaný timeline

| Krok | Čas | Status |
|------|-----|--------|
| Custom doména | 5 min + 24h DNS | ⏳ |
| Email z formulářů | 3 min | ⏳ |
| Cloudflare Worker | 15 min | ⏳ |
| AI Model propojení | 30 min | ⏳ |
| **Celkový čas** | **~1 hodina + čekání DNS** | |

---

**Last Updated:** 28.4.2026  
**Version:** 1.0.0
