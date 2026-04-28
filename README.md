# WHC - Web společnosti

Moderní, responzivní web společnosti WHC s.r.o. s AI asistentem, SEO optimalizacemi a Netlify deploymentem.

## 🎯 Funkce

- ✨ **Moderní design** - Dark/Light mode, animace, Tailwind CSS
- 🤖 **AI Asistent** - Plovoucí chatbot widget (připraven na Cloudflare Workers)
- 📱 **Responzivní** - Optimalizováno pro desktop, tablet i mobil
- 🔍 **SEO optimalizace** - JSON-LD schema, robots.txt, sitemap.xml
- 📋 **Kontaktní formulář** - Netlify Forms
- 🎨 **Light/Dark mode** - Uživatelská volba s localStorage

## 📦 Složka struktura

```
.
├── index.html           # Hlavní stránka
├── netlify.toml         # Netlify konfigurace
├── robots.txt          # SEO config
├── sitemap.xml         # Mapa webu
├── .gitignore          # Git ignorování
└── README.md           # Tato dokumentace
```

## 🚀 Nasazení na Netlify

1. **Push do GitHubu**
   ```bash
   git add .
   git commit -m "Production ready: Netlify + AI asistent + SEO"
   git push origin main
   ```

2. **Jdi na [Netlify.com](https://netlify.com)**
   - "Add new site" → "Import an existing project"
   - Vyber `MEVERIK-SOLUTION/whc`
   - Deploy automaticky

## 🤖 AI Asistent - Setup

Chatbot je připraven na Cloudflare Workers. Uprav v `index.html`:

```javascript
const workerURL = 'https://your-worker.workers.dev/api/chat';
```

## 📧 Kontakt

info@whc.cz

---

**Verze:** 1.0.0 | **Status:** Production-ready
